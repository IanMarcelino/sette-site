import Layout from './components/Layout'
import Home from './pages/Home'
import { PAGINAS } from './seo/paginas.js'

/**
 * Rotas do site — usadas pelo navegador (main.jsx) e pelo build que gera o
 * HTML de cada página (entry-server.jsx). Uma lista só, para que a página que
 * o Google recebe pronta seja a mesma que o visitante vê.
 *
 * Os caminhos não são escritos aqui: saem de `PAGINAS` (src/seo/paginas.js),
 * a mesma lista que gera sitemap, títulos e dados estruturados. Este arquivo só
 * diz qual componente desenha cada caminho. Uma página sem componente, ou um
 * componente sem página, interrompe o carregamento do módulo — e com ele o
 * build —, em vez de publicar uma rota que a Vercel responderia com 404 ou uma
 * página que o sitemap não conhece.
 */

// Carregamento sob demanda no formato do React Router (`lazy` da rota), não
// `React.lazy`: o roteador resolve o módulo antes de trocar de página, e o
// main.jsx consegue resolver o da página de entrada antes de hidratar. Com
// `React.lazy` + `Suspense`, a hidratação encontraria um componente ainda não
// baixado e a página pré-renderizada poderia ser trocada pelo fallback.
const sobDemanda = (importar) => ({
  lazy: () => importar().then((m) => ({ Component: m.default })),
})

const COMPONENTES = {
  // A Home entra estática — é a porta de entrada e não deve pagar um round
  // trip extra. As páginas internas viram chunks próprios.
  '/': { element: <Home /> },
  '/o-clube': sobDemanda(() => import('./pages/OClube')),
  '/o-espaco': sobDemanda(() => import('./pages/OEspaco')),
  '/experiencia': sobDemanda(() => import('./pages/Experiencia')),
  '/contato': sobDemanda(() => import('./pages/Contato')),
  // Destino do QR: redireciona para a loja do aparelho. Quase ninguém chega
  // por aqui pelo site — chega pela câmera do celular.
  '/app': sobDemanda(() => import('./pages/BaixarApp')),
}

const semComponente = PAGINAS.filter((p) => !COMPONENTES[p.caminho]).map((p) => p.caminho)
const semPagina = Object.keys(COMPONENTES).filter((c) => !PAGINAS.some((p) => p.caminho === c))
if (semComponente.length || semPagina.length) {
  throw new Error(
    [
      semComponente.length && `Página sem componente em src/rotas.jsx: ${semComponente.join(', ')}`,
      semPagina.length && `Componente sem página em src/seo/paginas.js: ${semPagina.join(', ')}`,
    ]
      .filter(Boolean)
      .join('\n'),
  )
}

export const rotas = [
  {
    element: <Layout />,
    children: [
      ...PAGINAS.map((p) => ({ path: p.caminho, ...COMPONENTES[p.caminho] })),
      // Endereço inexistente: diz que não existe, em vez de mostrar a Home.
      // Para o Google, uma URL errada que devolve a Home é um "soft 404" e
      // conteúdo duplicado. Na Vercel, o mesmo endereço responde com status
      // 404 e o 404.html gerado no build.
      { path: '*', ...sobDemanda(() => import('./pages/NaoEncontrada')) },
    ],
  },
]
