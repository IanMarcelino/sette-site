/**
 * Avisa Bing (e Yandex, Seznam, Naver…) que as páginas mudaram, via IndexNow.
 *
 * Rodar DEPOIS do deploy estar no ar — o buscador confere a chave baixando
 * `${ORIGEM}/${CHAVE}.txt`, que vem de public/:
 *
 *   npm run indexnow
 *
 * O Google não participa do IndexNow; para ele vale o sitemap e a Inspeção de
 * URL do Search Console.
 */
import { ORIGEM, PAGINAS, urlDe } from '../src/seo/paginas.js'

const CHAVE = '50fa73c293f491019243e588720c9688'

const urls = PAGINAS.filter((p) => p.indexar !== false).map((p) => urlDe(p.caminho))

const resposta = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: new URL(ORIGEM).host,
    key: CHAVE,
    keyLocation: `${ORIGEM}/${CHAVE}.txt`,
    urlList: urls,
  }),
})

// 200 e 202 são sucesso (202 = recebido, chave ainda em validação).
console.log(`IndexNow respondeu ${resposta.status} para ${urls.length} URLs:`)
for (const u of urls) console.log(`  ${u}`)
if (!resposta.ok) {
  console.error(await resposta.text())
  process.exit(1)
}
