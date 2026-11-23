import { CLUBE, urlAppStore, urlPlayStore, urlInstagram } from '../config/clube.js'
import { ORIGEM, IMAGEM_PADRAO, PAGINAS, PALAVRAS_CHAVE, urlDe } from './paginas.js'
import { PERGUNTAS } from '../data/perguntas.js'
import { elenco } from '../data/elenco.js'

/**
 * O que vai no <head> de cada página.
 *
 * Duas saídas a partir dos mesmos dados: `htmlDoCabecalho` para o build, que
 * escreve o HTML estático, e `metasDaPagina` para o navegador, que atualiza as
 * tags a cada troca de rota. Assim o que o Google lê no HTML e o que aparece
 * depois da navegação nunca divergem.
 */

/** Tags <meta> da página, como pares [atributo, chave, conteúdo]. */
export function metasDaPagina(pagina) {
  const url = urlDe(pagina.caminho)
  const robots =
    pagina.indexar === false
      ? 'noindex, follow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'

  return {
    titulo: pagina.titulo,
    canonical: pagina.indexar === false ? null : url,
    metas: [
      ['name', 'description', pagina.descricao],
      ['name', 'robots', robots],
      ['property', 'og:type', 'website'],
      ['property', 'og:site_name', CLUBE.nome],
      ['property', 'og:locale', 'pt_BR'],
      ['property', 'og:url', url],
      ['property', 'og:title', pagina.titulo],
      ['property', 'og:description', pagina.descricao],
      ['property', 'og:image', IMAGEM_PADRAO.url],
      ['property', 'og:image:width', String(IMAGEM_PADRAO.largura)],
      ['property', 'og:image:height', String(IMAGEM_PADRAO.altura)],
      ['property', 'og:image:alt', IMAGEM_PADRAO.alt],
      ['name', 'twitter:card', 'summary_large_image'],
      ['name', 'twitter:title', pagina.titulo],
      ['name', 'twitter:description', pagina.descricao],
      ['name', 'twitter:image', IMAGEM_PADRAO.url],
    ],
  }
}

/* ---------- Dados estruturados (schema.org, JSON-LD) ---------- */

const ID_CLUBE = `${ORIGEM}/#clube`
const ID_SITE = `${ORIGEM}/#site`
const ID_APP = `${ORIGEM}/#app`

const DIAS = {
  util: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  sabado: ['Saturday'],
  domingo: ['Sunday'],
}

/** "06h00 — 23h00" → ["06:00", "23:00"] */
const faixa = (texto) => texto.match(/\d{2}h\d{2}/g).map((h) => h.replace('h', ':'))

function horarios() {
  // A ordem de CLUBE.horarios é dias úteis, sábado, domingo e feriados.
  const grupos = [DIAS.util, DIAS.sabado, DIAS.domingo]
  return CLUBE.horarios.map((h, i) => {
    const [abre, fecha] = faixa(h.hora)
    return { '@type': 'OpeningHoursSpecification', dayOfWeek: grupos[i], opens: abre, closes: fecha }
  })
}

const recurso = (nome) => ({ '@type': 'LocationFeatureSpecification', name: nome, value: true })

const oferta = (nome, descricao, url) => ({
  '@type': 'Offer',
  url,
  itemOffered: {
    '@type': 'Service',
    name: nome,
    description: descricao,
    areaServed: { '@type': 'City', name: 'Fortaleza' },
    provider: { '@id': `${ORIGEM}/#clube` },
  },
})

function clube() {
  const perfis = [urlInstagram(), urlAppStore(), urlPlayStore()].filter(Boolean)
  return {
    '@type': 'SportsClub',
    '@id': ID_CLUBE,
    name: CLUBE.nome,
    alternateName: 'Sette',
    description:
      'Clube de tênis e padel em Fortaleza, no bairro Papicu. Aulas de tênis com professores certificados, quadras de tênis no saibro e quadras de padel, lounge, bar e área social. Aberto ao público, com um número reduzido de membros.',
    url: `${ORIGEM}/`,
    logo: `${ORIGEM}/favicon.svg`,
    image: IMAGEM_PADRAO.url,
    telephone: `+${CLUBE.whatsapp}`,
    email: CLUBE.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: CLUBE.endereco,
      addressLocality: 'Fortaleza',
      addressRegion: 'CE',
      postalCode: CLUBE.cep,
      addressCountry: 'BR',
    },
    geo: { '@type': 'GeoCoordinates', latitude: CLUBE.lat, longitude: CLUBE.lng },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${CLUBE.lat},${CLUBE.lng}`,
    areaServed: { '@type': 'City', name: 'Fortaleza' },
    openingHoursSpecification: horarios(),
    amenityFeature: [
      recurso('Quadras de tênis de saibro'),
      recurso('Quadras de padel'),
      recurso('Lounge e área social'),
      recurso('Bar e gastronomia'),
      recurso('Área VIP'),
      recurso('Estacionamento'),
    ],
    publicAccess: true,
    // O que o clube vende. Sem preço: valores não estão registrados no projeto.
    makesOffer: [
      oferta(
        'Aulas de tênis',
        'Aulas de tênis no saibro, individuais e em grupo, para crianças e adultos, da iniciação à competição. Agendamento pelo WhatsApp.',
        `${ORIGEM}/o-clube#aulas`,
      ),
      oferta('Reserva de quadra de tênis', 'Quadras de tênis no saibro, reservadas pelo app do clube.', `${ORIGEM}/contato`),
      oferta('Reserva de quadra de padel', 'Quadras de padel, reservadas pelo app do clube.', `${ORIGEM}/contato`),
    ],
    keywords: PALAVRAS_CHAVE.join(', '),
    sameAs: perfis,
  }
}

function site() {
  return {
    '@type': 'WebSite',
    '@id': ID_SITE,
    name: CLUBE.nome,
    url: `${ORIGEM}/`,
    inLanguage: 'pt-BR',
    publisher: { '@id': ID_CLUBE },
  }
}

function app() {
  const lojas = [urlAppStore(), urlPlayStore()].filter(Boolean)
  if (!lojas.length) return null
  return {
    '@type': 'MobileApplication',
    '@id': ID_APP,
    name: 'SETTE RACKET CLUB',
    operatingSystem: 'iOS, Android',
    applicationCategory: 'SportsApplication',
    description: 'Reserva de quadras, horários, ranking e campeonatos do Sette Racket Club.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'BRL' },
    installUrl: lojas,
    publisher: { '@id': ID_CLUBE },
  }
}

/** Perguntas da página como `Question`, com o mesmo texto da seção visível. */
const perguntas = () =>
  PERGUNTAS.map(({ pergunta, resposta }) => ({
    '@type': 'Question',
    name: pergunta,
    acceptedAnswer: { '@type': 'Answer', text: resposta },
  }))

/** O elenco de O Clube como pessoas ligadas ao clube. */
const pessoas = (url) =>
  elenco.map((p) => ({
    '@type': 'Person',
    '@id': `${url}#${p.id}`,
    name: p.nome,
    jobTitle: p.papel,
    description: p.resumo,
    image: new URL(p.src, ORIGEM).href,
    worksFor: { '@id': ID_CLUBE },
  }))

function paginaWeb(pagina) {
  const url = urlDe(pagina.caminho)
  const blocos = pagina.blocos ?? []
  const tipos = ['WebPage', pagina.tipo, blocos.includes('perguntas') && 'FAQPage'].filter(Boolean)
  const p = {
    '@type': tipos.length > 1 ? tipos : tipos[0],
    '@id': `${url}#pagina`,
    url,
    name: pagina.titulo,
    description: pagina.descricao,
    inLanguage: 'pt-BR',
    isPartOf: { '@id': ID_SITE },
    about: { '@id': ID_CLUBE },
    primaryImageOfPage: { '@type': 'ImageObject', url: IMAGEM_PADRAO.url },
  }
  // Numa FAQPage, as perguntas são a entidade principal da página.
  if (blocos.includes('perguntas')) p.mainEntity = perguntas()
  return p
}

function trilha(pagina) {
  const inicio = PAGINAS[0]
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: inicio.nome, item: urlDe(inicio.caminho) },
      { '@type': 'ListItem', position: 2, name: pagina.nome, item: urlDe(pagina.caminho) },
    ],
  }
}

/** Grafo JSON-LD da página. Páginas fora do índice não recebem nenhum. */
export function dadosEstruturados(pagina) {
  if (pagina.indexar === false) return null
  const grafo = [clube(), site(), paginaWeb(pagina)]
  if (pagina.caminho === '/') grafo.push(app())
  else grafo.push(trilha(pagina))
  if (pagina.blocos?.includes('elenco')) grafo.push(...pessoas(urlDe(pagina.caminho)))
  return { '@context': 'https://schema.org', '@graph': grafo.filter(Boolean) }
}

/* ---------- HTML para o build ---------- */

const escapar = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Bloco que substitui o trecho entre `<!-- seo:inicio -->` e `<!-- seo:fim -->`. */
export function htmlDoCabecalho(pagina) {
  const { titulo, canonical, metas } = metasDaPagina(pagina)
  const linhas = [`<title>${escapar(titulo)}</title>`]
  for (const [attr, chave, valor] of metas) {
    linhas.push(`<meta ${attr}="${chave}" content="${escapar(valor)}" />`)
  }
  if (canonical) linhas.push(`<link rel="canonical" href="${canonical}" />`)
  const ld = dadosEstruturados(pagina)
  if (ld) {
    // `<` escapado: um texto com "</script>" fecharia a tag antes da hora.
    const json = JSON.stringify(ld).replace(/</g, '\\u003c')
    linhas.push(`<script type="application/ld+json">${json}</script>`)
  }
  return linhas.map((l) => `    ${l}`).join('\n')
}
