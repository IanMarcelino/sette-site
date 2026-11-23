import { useEffect, useRef } from 'react'
import { useAnimation, useInView } from 'framer-motion'
import { useMovimentoReduzido } from './useMovimentoReduzido'

export function useScrollReveal(threshold = 0.3) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: threshold })
  const controls = useAnimation()
  const semMovimento = useMovimentoReduzido()

  useEffect(() => {
    // Sem movimento o conteúdo já entra no estado final: nada de esperar um
    // reveal que nunca vai acontecer.
    if (semMovimento) {
      controls.set('visible')
      return
    }
    if (inView) controls.start('visible')
  }, [inView, controls, semMovimento])

  return [ref, controls]
}
