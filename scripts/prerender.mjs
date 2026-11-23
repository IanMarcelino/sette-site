/**
 * Pós-build: gera um HTML pronto por rota, mais sitemap.xml, robots.txt e
 * llms.txt. Roda depois do `vite build` (ver `npm run build`).
 *
 * Por quê: o site é uma SPA. Sem este passo, toda URL entregava o mesmo
 * index.html — mesmo título, mesma descrição, canonical apontando para a Home
 * e um <div id="root"> vazio. O Google tratava as páginas internas como cópias
 * da Home, e crawlers de IA (que não executam JavaScript) não viam texto algum.
 *
 * Saída em dist/:
 *   index.html, o-clube.html, o-espaco.html, ...  (a Vercel serve sem o .html,
 *   via `cleanUrls` no vercel.json), 404.html, sitemap.xml, robots.txt, llms.txt
 */
import { build } from 'vite'
import { readFile, writeFile, rm } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const raiz = fileURLToPath(new URL('..', import.meta.url))
const dist = path.join(raiz, 'dist')
const pastaSsr = path.join(raiz, 'dist-ssr') // já ignorada pelo .gitignore

/* ---------- 1. Bundle de servidor ---------- */

await build({
  root: raiz,
  logLevel: 'warn',
  build: {
    ssr: 'src/entry-server.jsx',
    outDir: pastaSsr,
    emptyOutDir: true,
    rollupOptions: { output: { entryFileNames: 'entry-server.mjs' } },
  },
  // Empacota as dependências em vez de deixá-las para o Node resolver: o gsap
  // publica módulos que o ESM do Node não importa direto.
  ssr: { noExternal: true },
})

const ssr = await import(pathToFileURL(path.join(pastaSsr, 'entry-server.mjs')).href)
const { PAGINAS, PAGINA_404, PALAVRAS_CHAVE, ORIGEM, urlDe, htmlDoCabecalho, render, CLUBE } = ssr

/* ---------- 2. Revisão do SEO ---------- */

// Rotas e páginas já são conferidas ao carregar src/rotas.jsx. Aqui entram as
// regras de texto: título/descrição ausentes ou repetidos param o build;
// tamanho fora da faixa só avisa.
const { erros, avisos } = ssr.revisarPaginas()
for (const a of avisos) console.warn(`  aviso: ${a}`)
if (erros.length) throw new Error(`SEO das páginas:\n  ${erros.join('\n  ')}`)

/* ---------- 3. HTML por rota ---------- */

const modelo = await readFile(path.join(dist, 'index.html'), 'utf8')
const BLOCO_SEO = /<!-- seo:inicio[\s\S]*?<!-- seo:fim -->/
if (!BLOCO_SEO.test(modelo) || !modelo.includes('<!--app-->')) {
  throw new Error('dist/index.html sem os marcadores <!-- seo:inicio --> / <!--app-->')
}

const arquivoDe = (caminho) => (caminho === '/' ? 'index.html' : `${caminho.slice(1)}.html`)

async function gerar(pagina, caminhoRender = pagina.caminho) {
  const corpo = await render(caminhoRender)
  const html = modelo
    .replace(BLOCO_SEO, () => htmlDoCabecalho(pagina).trimStart())
    .replace('<!--app-->', () => corpo)
  const arquivo = arquivoDe(pagina.caminho)
  await writeFile(path.join(dist, arquivo), html)
  console.log(`  ${arquivo.padEnd(18)} ${pagina.titulo}`)
}

console.log('Pré-renderizando:')
for (const pagina of PAGINAS) await gerar(pagina)
await gerar(PAGINA_404, '/pagina-que-nao-existe')

/* ---------- 4. sitemap.xml ---------- */

/** Data do último commit que tocou os arquivos da página; null sem git. */
function ultimaAlteracao(arquivos = []) {
  if (!arquivos.length) return null
  try {
    const data = execFileSync('git', ['log', '-1', '--format=%cs', '--', ...arquivos], {
      cwd: raiz,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
    return data || null
  } catch {
    return null
  }
}

const indexaveis = PAGINAS.filter((p) => p.indexar !== false)

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexaveis
  .map((p) => {
    const data = ultimaAlteracao(p.fonte)
    return [
      '  <url>',
      `    <loc>${urlDe(p.caminho)}</loc>`,
      data && `    <lastmod>${data}</lastmod>`,
      `    <priority>${p.prioridade.toFixed(1)}</priority>`,
      '  </url>',
    ]
      .filter(Boolean)
      .join('\n')
  })
  .join('\n')}
</urlset>
`
await writeFile(path.join(dist, 'sitemap.xml'), sitemap)

/* ---------- 5. robots.txt ---------- */

const robots = `# Sette Racket Club — ${ORIGEM}
# Buscadores e assistentes de IA são bem-vindos em todo o site.

User-agent: *
Allow: /

# Crawlers de IA, nomeados para deixar a permissão explícita.
User-agent: GPTBot
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: ClaudeBot
User-agent: Claude-SearchBot
User-agent: Claude-User
User-agent: PerplexityBot
User-agent: Perplexity-User
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: Amazonbot
User-agent: CCBot
Allow: /

Sitemap: ${ORIGEM}/sitemap.xml
`
await writeFile(path.join(dist, 'robots.txt'), robots)

/* ---------- 6. llms.txt ---------- */

const lojas = [
  ssr.urlAppStore() && `- [App Store (iPhone)](${ssr.urlAppStore()})`,
  ssr.urlPlayStore() && `- [Google Play (Android)](${ssr.urlPlayStore()})`,
].filter(Boolean)

const llms = `# ${CLUBE.nome}

> Clube de tênis e padel em Fortaleza (Ceará, Brasil), no bairro Papicu. Quadras de tênis no saibro e quadras de padel, lounge, bar e área social. Aberto ao público geral, com um número reduzido de membros com acesso privilegiado. A reserva de quadra é feita pelo app do clube.

## Fatos

- Nome: ${CLUBE.nome} ("Sette" é sete em italiano; a pronúncia remete ao set do tênis)
- Modalidades: tênis (quadras de saibro) e padel — somente essas duas; o clube não tem beach tennis
- Estrutura: 8 quadras, 25 vagas de estacionamento, área VIP, lounge e área social, bar e gastronomia
- Aulas de tênis: parte central da oferta do clube. Aulas no saibro, individuais e em grupo, para crianças e adultos, da iniciação à competição, com o elenco listado abaixo. Agendamento pelo WhatsApp ${CLUBE.telefone} (${ssr.urlAgendarAula()})
- Programação: torneios internos com ranking e premiação, clínicas e workshops com profissionais convidados, encontros sociais
- Acesso: aberto ao público geral (não é preciso ser membro para reservar). Novas admissões de membros acontecem por processo seletivo ou lista de prioridade
- Endereço: ${ssr.enderecoCompleto()}
- Horários: ${CLUBE.horarios.map((h) => `${h.dia.replace(' — ', ' a ').replace(' & ', ' e ')} ${h.hora.replace(' — ', ' às ')}`).join('; ')}
- Reserva: pelo app gratuito "SETTE RACKET CLUB" (iOS e Android). Link curto: ${ORIGEM}/app
- Atendimento: WhatsApp ${CLUBE.telefone} (${ssr.urlWhatsapp()}) · e-mail ${CLUBE.email} · Instagram @${CLUBE.instagram}
- Preços e mensalidades não são publicados no site; informações pelo app ou pelo WhatsApp

## Professores e equipe

${ssr.elenco.map((p) => `- ${p.nome} — ${p.papel}. ${p.resumo}`).join('\n')}

Mais em ${urlDe('/o-clube')}

## Perguntas frequentes

${ssr.PERGUNTAS.map((q) => `### ${q.pergunta}\n\n${q.resposta}`).join('\n\n')}

## Páginas

${indexaveis.map((p) => `- [${p.nome}](${urlDe(p.caminho)}): ${p.descricao}`).join('\n')}

## App de reservas

${lojas.join('\n')}

## Termos relacionados

${PALAVRAS_CHAVE.join(', ')}
`
await writeFile(path.join(dist, 'llms.txt'), llms)

await rm(pastaSsr, { recursive: true, force: true })
console.log('sitemap.xml, robots.txt e llms.txt gerados.')
