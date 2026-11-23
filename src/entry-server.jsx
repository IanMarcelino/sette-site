/* eslint-disable react-refresh/only-export-components -- roda só no build, sem HMR */
import { StrictMode } from 'react'
import { renderToPipeableStream } from 'react-dom/server'
import { Writable } from 'node:stream'
import { Buffer } from 'node:buffer'
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router-dom'
import { rotas } from './rotas'

/**
 * Entrada do build de pré-renderização (scripts/prerender.mjs).
 *
 * Gera o HTML de cada rota para que buscadores e crawlers de IA — que em boa
 * parte não executam JavaScript — leiam o conteúdo da página, e não um
 * <div id="root"> vazio. Não roda no navegador.
 */

export { PAGINAS, PAGINA_404, PALAVRAS_CHAVE, ORIGEM, urlDe, revisarPaginas } from './seo/paginas.js'
export { PERGUNTAS } from './data/perguntas.js'
export { elenco } from './data/elenco.js'
export { htmlDoCabecalho } from './seo/cabecalho.js'
export { CLUBE, urlAppStore, urlPlayStore, urlInstagram, urlWhatsapp, urlAgendarAula, enderecoCompleto } from './config/clube.js'

const handler = createStaticHandler(rotas)

export async function render(caminho) {
  const contexto = await handler.query(new Request(`http://localhost${caminho}`))
  if (contexto instanceof Response) throw new Error(`A rota ${caminho} respondeu com redirecionamento`)
  const router = createStaticRouter(handler.dataRoutes, contexto)

  // As páginas já chegam resolvidas pelo `handler.query` (rotas `lazy` do
  // React Router). O streaming com `onAllReady` cobre os `React.lazy` internos,
  // como o carrossel da Home: `renderToString` entregaria só o fallback do
  // Suspense, e a seção sairia vazia no HTML.
  return new Promise((resolve, reject) => {
    // Os pedaços são juntados como bytes e decodificados uma vez no fim: um
    // caractere acentuado (2 bytes em UTF-8) pode cair partido entre dois
    // pedaços, e decodificar cada um separado o trocaria por "�".
    const pedacos = []
    const destino = new Writable({
      write(pedaco, _cod, pronto) {
        pedacos.push(Buffer.from(pedaco))
        pronto()
      },
      final(pronto) {
        resolve(Buffer.concat(pedacos).toString('utf8'))
        pronto()
      },
    })
    const { pipe } = renderToPipeableStream(
      <StrictMode>
        <StaticRouterProvider router={router} context={contexto} hydrate={false} />
      </StrictMode>,
      {
        onAllReady: () => pipe(destino),
        onShellError: reject,
        onError: reject,
      },
    )
  })
}
