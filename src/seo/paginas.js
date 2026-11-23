/**
 * SEO das páginas — fonte única.
 *
 * O build (scripts/prerender.mjs) lê esta lista para gerar um HTML próprio por
 * rota, o sitemap e o llms.txt. No navegador, o <Cabecalho /> lê a mesma lista
 * para trocar título e meta a cada navegação. Página nova entra aqui e em
 * `src/rotas.jsx`, nos dois lugares.
 *
 * As rotas do navegador são derivadas desta lista (`src/rotas.jsx`): um
 * caminho sem página aqui não existe no site, e uma página aqui sem componente
 * lá quebra o build. Não há como as duas divergirem em produção.
 *
 * Regras de escrita (o build avisa quando uma delas é violada):
 * - `titulo` até 60 caracteres, termo de busca antes da marca, único no site;
 * - `descricao` entre 120 e 160 caracteres, no presente, sem superlativo, única;
 * - cada página disputa um assunto próprio — Home o clube, O Clube os
 *   aulas de tênis e quem as dá, O Espaço as quadras, Contato a reserva —, para que duas
 *   páginas do site não concorram pela mesma busca.
 *
 * Campos de dados estruturados (lidos por `src/seo/cabecalho.js`):
 * - `tipo`: subtipo de WebPage do schema.org (`AboutPage`, `ContactPage`…);
 * - `blocos`: grafos extras da página — `perguntas` (FAQPage) e `elenco`
 *   (Person). Só entram onde o conteúdo correspondente está visível na página,
 *   como o Google exige.
 */

/**
 * Endereço público do site, sem barra no fim.
 *
 * É o host que a Vercel serve de fato: `setteclub.com` redireciona (308) para
 * `www.setteclub.com`. Canonical, sitemap e og:url precisam apontar para o
 * destino final — apontar para um endereço que redireciona é o que deixava as
 * páginas em "Página com redirecionamento" no Search Console. Se o domínio
 * principal mudar no painel da Vercel, muda aqui e só aqui.
 */
export const ORIGEM = 'https://www.setteclub.com'

export const IMAGEM_PADRAO = {
  url: `${ORIGEM}/og-sette.jpg`,
  largura: 1200,
  altura: 630,
  alt: 'Vista aérea da quadra de saibro com o brasão do Sette Racket Club gravado no piso',
}

export const PAGINAS = [
  {
    caminho: '/',
    nome: 'Início',
    titulo: 'Clube de tênis e padel em Fortaleza | Sette Racket Club',
    descricao:
      'Clube de tênis e padel no Papicu, em Fortaleza, com aulas de tênis, quadras de saibro e de padel, lounge e bar. Aberto ao público: reserve pelo app.',
    prioridade: 1.0,
    fonte: ['src/pages/Home.jsx', 'src/components/Hero.jsx'],
  },
  {
    caminho: '/o-clube',
    nome: 'O Clube',
    titulo: 'Aulas de tênis em Fortaleza | Sette Racket Club',
    descricao:
      'Aulas de tênis no saibro em Fortaleza, individuais e em grupo, para crianças e adultos, com professores certificados pela CBT e ITF. Agende pelo WhatsApp.',
    prioridade: 0.9,
    fonte: ['src/pages/OClube.jsx', 'src/data/elenco.js', 'src/components/clube/Elenco.jsx'],
    tipo: 'AboutPage',
    blocos: ['elenco'],
  },
  {
    caminho: '/o-espaco',
    nome: 'O Espaço',
    titulo: 'Quadras de saibro e padel em Fortaleza | Sette Racket Club',
    descricao:
      'Oito quadras de tênis no saibro e de padel no Papicu, em Fortaleza, com lounge, bar, área VIP e 25 vagas de estacionamento. Conheça o projeto do Sette.',
    prioridade: 0.8,
    fonte: ['src/pages/OEspaco.jsx'],
  },
  {
    caminho: '/experiencia',
    nome: 'Experiência',
    titulo: 'Torneios, clínicas e convívio | Sette Racket Club',
    descricao:
      'Torneios internos com ranking e premiação, clínicas e workshops com profissionais convidados e encontros no lounge. A rotina do Sette Racket Club.',
    prioridade: 0.7,
    fonte: ['src/pages/Experiencia.jsx'],
  },
  {
    caminho: '/contato',
    nome: 'Contato',
    titulo: 'Reservas de tênis e padel em Fortaleza | Sette Racket Club',
    descricao:
      'Reserve quadra de tênis ou padel pelo app do Sette Racket Club. Endereço no Papicu, horários, WhatsApp (85) 98557-5252 e respostas às dúvidas frequentes.',
    prioridade: 0.9,
    fonte: ['src/pages/Contato.jsx', 'src/config/clube.js', 'src/data/perguntas.js'],
    tipo: 'ContactPage',
    blocos: ['perguntas'],
  },
  {
    // Rota do QR: só redireciona para a loja. Existe para gente, não para busca.
    caminho: '/app',
    nome: 'App do clube',
    titulo: 'Baixe o app | Sette Racket Club',
    descricao:
      'App do Sette Racket Club para iOS e Android: reserve quadra de tênis ou padel, veja horários livres e acompanhe o ranking do clube.',
    indexar: false,
  },
]

/** Página servida com status 404. Fica fora de `PAGINAS` porque não tem rota. */
export const PAGINA_404 = {
  caminho: '/404',
  nome: 'Página não encontrada',
  titulo: 'Página não encontrada | Sette Racket Club',
  descricao: 'O endereço acessado não existe no site do Sette Racket Club.',
  indexar: false,
}

/** Termos de busca que o clube quer disputar. Usados no JSON-LD e no llms.txt. */
export const PALAVRAS_CHAVE = [
  'clube de tênis',
  'clube de tennis',
  'tênis em Fortaleza',
  'tennis Fortaleza',
  'padel em Fortaleza',
  'quadra de saibro',
  'quadra de tênis Fortaleza',
  'quadra de padel Fortaleza',
  'aula de tênis Fortaleza',
  'aulas de tênis em Fortaleza',
  'aula de tênis infantil Fortaleza',
  'professor de tênis Fortaleza',
  'clube de raquete',
  'tênis no Ceará',
  'tênis no Nordeste',
]

export const urlDe = (caminho) => (caminho === '/' ? `${ORIGEM}/` : `${ORIGEM}${caminho}`)

/**
 * Confere as regras de escrita da lista. `erros` quebram o build (título ou
 * descrição faltando ou repetidos: o Google trata páginas assim como cópias);
 * `avisos` só aparecem no log (tamanho fora da faixa: o resultado sai cortado).
 */
export function revisarPaginas(paginas = [...PAGINAS, PAGINA_404]) {
  const erros = []
  const avisos = []
  const vistos = { titulo: new Map(), descricao: new Map() }

  for (const p of paginas) {
    for (const campo of ['titulo', 'descricao']) {
      const valor = p[campo]?.trim()
      if (!valor) {
        erros.push(`${p.caminho}: sem ${campo}`)
        continue
      }
      if (vistos[campo].has(valor)) erros.push(`${p.caminho}: ${campo} igual ao de ${vistos[campo].get(valor)}`)
      vistos[campo].set(valor, p.caminho)
    }
    if (p.indexar === false) continue
    if (p.titulo?.length > 60) avisos.push(`${p.caminho}: título com ${p.titulo.length} caracteres (máx. 60)`)
    const n = p.descricao?.length ?? 0
    if (n < 120 || n > 160) avisos.push(`${p.caminho}: descrição com ${n} caracteres (faixa 120–160)`)
  }

  return { erros, avisos }
}

/** Página do caminho, ou a de 404 quando o caminho não existe. */
export const paginaDe = (caminho) => {
  const limpo = caminho.length > 1 ? caminho.replace(/\/+$/, '') : caminho
  return PAGINAS.find((p) => p.caminho === limpo) ?? PAGINA_404
}
