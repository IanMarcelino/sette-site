import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { createBrowserRouter, matchRoutes, RouterProvider } from 'react-router-dom'
import './index.css'
import { rotas } from './rotas'

/**
 * Em produção o #root chega preenchido pelo build (scripts/prerender.mjs):
 * cada rota tem o próprio HTML, para buscadores e IAs que não executam
 * JavaScript. O React *hidrata* esse HTML — reaproveita o DOM que já está na
 * tela e só liga os eventos — em vez de apagá-lo e desenhar de novo. O
 * visitante vê a página no primeiro paint, sem piscar.
 *
 * Para a hidratação conferir com o HTML, o primeiro render precisa ser idêntico
 * ao do build. Por isso:
 * - o módulo da página de entrada é resolvido *antes* de hidratar (é o
 *   procedimento documentado do React Router para rotas `lazy` com SSR);
 * - o que depende do aparelho (media queries, movimento reduzido, plataforma)
 *   começa no valor do servidor e se corrige logo depois — ver
 *   `useMediaQuery`, `useMovimentoReduzido` e `usePlataforma`.
 *
 * No `npm run dev` não há pré-render — o #root chega vazio — e o app é montado
 * do zero.
 */
async function iniciar() {
  const raiz = document.getElementById('root')

  const pendentes = matchRoutes(rotas, window.location)?.filter((m) => m.route.lazy) ?? []
  await Promise.all(
    pendentes.map(async (m) => {
      const modulo = await m.route.lazy()
      Object.assign(m.route, { ...modulo, lazy: undefined })
    }),
  )

  const app = (
    <StrictMode>
      <RouterProvider router={createBrowserRouter(rotas)} />
    </StrictMode>
  )

  if (raiz.firstElementChild) hydrateRoot(raiz, app)
  else createRoot(raiz).render(app)
}

iniciar()
