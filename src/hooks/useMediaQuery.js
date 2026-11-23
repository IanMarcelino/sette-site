import { useCallback, useSyncExternalStore } from 'react'

// Escolhe layout em JavaScript quando duas variantes não podem coexistir no DOM.
//
// Na maioria dos casos o certo é `hidden lg:block` — CSS resolve, sem custo. Mas
// quando as duas variantes carregam os mesmos `id` de âncora, manter as duas no
// documento quebra a navegação: o navegador resolve `#tenis` para a primeira
// ocorrência, mesmo que ela esteja dentro de um `display:none`.
//
// O HTML de cada página sai pronto do build, onde não existe tela para
// consultar: lá a resposta é sempre `false`. `useSyncExternalStore` é o que
// torna isso seguro — na hidratação o React usa o mesmo `false` do servidor
// (o DOM confere com o HTML recebido) e, logo em seguida, re-renderiza com o
// valor real do aparelho. Ler `matchMedia` direto no estado inicial faria o
// primeiro render do navegador divergir do HTML.
export function useMediaQuery(query) {
  const assinar = useCallback(
    (avisar) => {
      const mq = window.matchMedia(query)
      mq.addEventListener('change', avisar)
      return () => mq.removeEventListener('change', avisar)
    },
    [query],
  )

  return useSyncExternalStore(
    assinar,
    () => window.matchMedia(query).matches,
    () => false,
  )
}
