import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { paginaDe } from '../seo/paginas.js'
import { metasDaPagina, dadosEstruturados } from '../seo/cabecalho.js'

/**
 * Mantém o <head> em dia com a rota.
 *
 * Quem chega direto numa URL já recebe o HTML certo do build. Este componente
 * cobre a navegação interna: sem ele, ir da Home para /contato deixaria o
 * título, o canonical e o og:url da Home na aba — e é isso que o Google lê
 * quando renderiza a página navegando pelo app.
 */

function definirMeta(attr, chave, valor) {
  let tag = document.head.querySelector(`meta[${attr}="${chave}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, chave)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', valor)
}

function definirCanonical(url) {
  let tag = document.head.querySelector('link[rel="canonical"]')
  if (!url) {
    tag?.remove()
    return
  }
  if (!tag) {
    tag = document.createElement('link')
    tag.setAttribute('rel', 'canonical')
    document.head.appendChild(tag)
  }
  tag.setAttribute('href', url)
}

function definirJsonLd(dados) {
  let tag = document.head.querySelector('script[type="application/ld+json"]')
  if (!dados) {
    tag?.remove()
    return
  }
  if (!tag) {
    tag = document.createElement('script')
    tag.type = 'application/ld+json'
    document.head.appendChild(tag)
  }
  tag.textContent = JSON.stringify(dados)
}

export default function Cabecalho() {
  const { pathname } = useLocation()

  useEffect(() => {
    const pagina = paginaDe(pathname)
    const { titulo, canonical, metas } = metasDaPagina(pagina)
    document.title = titulo
    for (const [attr, chave, valor] of metas) definirMeta(attr, chave, valor)
    definirCanonical(canonical)
    definirJsonLd(dadosEstruturados(pagina))
  }, [pathname])

  return null
}
