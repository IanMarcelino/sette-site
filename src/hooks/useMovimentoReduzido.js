import { useMediaQuery } from './useMediaQuery'

/**
 * `true` quando o visitante pediu movimento reduzido ao sistema.
 *
 * Substitui o `useReducedMotion` do framer-motion em todo o projeto. O do
 * framer lê a preferência já no primeiro render do navegador, e o HTML
 * pré-renderizado foi gerado sem ela: quem tem movimento reduzido ligado
 * receberia um `initial` diferente do que está no HTML, e o deslocamento de
 * entrada ficaria preso no DOM. Este começa igual ao servidor e se corrige logo
 * depois da hidratação.
 *
 * Nesse primeiro quadro quem garante o comportamento acessível é o
 * `<MotionConfig reducedMotion="user">` do Layout, que anula deslocamento e
 * escala para quem pediu movimento reduzido, independentemente deste valor.
 */
export function useMovimentoReduzido() {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}
