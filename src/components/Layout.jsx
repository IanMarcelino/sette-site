import { Outlet, useLocation } from 'react-router-dom'
import { motion, MotionConfig } from 'framer-motion'
import Navbar from './Navbar'
import Footer from './Footer'
import ScrollToTop from './ScrollToTop'
import BotaoWhatsapp from './BotaoWhatsapp'
import Cabecalho from './Cabecalho'
import { useMovimentoReduzido } from '../hooks/useMovimentoReduzido'
import { useHidratado } from '../hooks/useHidratado'

// Chassi compartilhado por todas as páginas: navegação fixa, conteúdo da rota
// com fade-in a cada troca de rota, e rodapé institucional.
// Usamos apenas animação de entrada (key por pathname força a remontagem) —
// evita o bug de tela travada do AnimatePresence + Outlet no data router.
export default function Layout() {
  const location = useLocation()
  const semMovimento = useMovimentoReduzido()
  const hidratado = useHidratado()

  return (
    // `reducedMotion="user"`: para quem pediu movimento reduzido, o framer
    // anula deslocamento e escala em qualquer animação e mantém só a opacidade.
    // É a rede de segurança do primeiro quadro, antes de `useMovimentoReduzido`
    // conhecer a preferência (ver o hook), e de qualquer componente novo que
    // esqueça de tratar o caso.
    <MotionConfig reducedMotion="user">
      {/* Com a navbar fixa, quem navega por teclado tinha de atravessar os
          quatro links em toda página. */}
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:bg-navy-deep focus:text-cream focus:px-5 focus:py-3 focus:text-xs focus:tracking-ultra-wide focus:uppercase focus:font-body"
      >
        Pular para o conteúdo
      </a>
      <Cabecalho />
      <ScrollToTop />
      <Navbar />
      <motion.main
        id="conteudo"
        key={location.pathname}
        // A página de entrada já chega pintada no HTML do build: começar em
        // opacidade 0 esconderia esse HTML até o JavaScript carregar — o
        // conteúdo ficava invisível para quem não executa JS e o maior
        // elemento da tela (LCP) só aparecia depois do bundle. O fade fica
        // para as trocas de rota, que são montagens novas no navegador.
        initial={hidratado ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: semMovimento ? 0.15 : 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <Outlet />
      </motion.main>
      <Footer />
      {/* Fora do <main>: é atalho persistente, não conteúdo da rota. Fica
          depois do rodapé na ordem do DOM para não entrar na frente do
          conteúdo na navegação por teclado. */}
      <BotaoWhatsapp />
    </MotionConfig>
  )
}
