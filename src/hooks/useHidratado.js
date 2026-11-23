import { useSyncExternalStore } from 'react'

const semAssinatura = () => () => {}

/**
 * `false` no build e durante a hidratação; `true` daí em diante.
 *
 * Distingue o que já chegou pintado no HTML (a página em que o visitante
 * entrou) do que o React monta depois, na navegação interna. É o mesmo valor
 * nos dois lados durante a hidratação, então não gera divergência com o HTML.
 */
export function useHidratado() {
  return useSyncExternalStore(
    semAssinatura,
    () => true,
    () => false,
  )
}
