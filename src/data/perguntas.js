import { CLUBE } from '../config/clube.js'

/**
 * Perguntas frequentes — fonte única.
 *
 * O mesmo texto aparece em três lugares: na seção visível da página Contato,
 * no JSON-LD `FAQPage` dessa página e no `llms.txt`. O Google só aceita dado
 * estruturado que o visitante também consegue ler, e uma resposta de IA vale o
 * que vale a fonte — por isso não há uma versão "para robô".
 *
 * Toda resposta se apoia em fato registrado no projeto (PRODUCT.md,
 * `config/clube.js`, `data/elenco.js`). Preço, mensalidade, número de membros e
 * datas não estão registrados e não entram aqui sem confirmação do clube.
 * Valores que mudam (telefone, horário, endereço) vêm de `CLUBE`, nunca
 * digitados à mão.
 */

/** "Segunda — Sexta" + "06h00 — 23h00" → "segunda a sexta, das 06h00 às 23h00" */
const faixaDeHorario = ({ dia, hora }) => {
  const dias = dia.replace(' — ', ' a ').replace(' & ', ' e ').toLowerCase()
  const [abre, fecha] = hora.split(' — ')
  return `${dias}, das ${abre} às ${fecha}`
}

const horarios = CLUBE.horarios.map(faixaDeHorario)
const horariosPorExtenso = `${horarios.slice(0, -1).join('; ')}; e ${horarios.at(-1)}`

export const PERGUNTAS = [
  {
    pergunta: 'Preciso ser membro para jogar no Sette?',
    resposta: `Não. O ${CLUBE.nome} é aberto ao público: qualquer pessoa reserva quadra de tênis ou de padel pelo app do clube. Os membros, em número reduzido, têm acesso privilegiado.`,
  },
  {
    pergunta: 'Como reservo uma quadra?',
    resposta: `Pelo app gratuito SETTE RACKET CLUB, para iPhone e Android. É nele que ficam os horários livres e a reserva. Se preferir falar com alguém, o WhatsApp ${CLUBE.telefone} atende.`,
  },
  {
    pergunta: 'Quais esportes posso jogar no clube?',
    resposta: 'Tênis, em quadras de saibro, e padel. São as duas modalidades do clube, em oito quadras no total.',
  },
  {
    pergunta: 'O clube tem aulas de tênis?',
    resposta: `Sim. O Sette dá aulas de tênis no saibro, individuais e em grupo, para crianças e adultos, da iniciação à competição. Quem ensina é o elenco do clube: professores e treinadores com certificações da CBT e da ITF, além de preparação física.`,
  },
  {
    pergunta: 'Como agendo uma aula de tênis?',
    resposta: `Pelo WhatsApp do clube, ${CLUBE.telefone}. Diga se a aula é para você ou para uma criança e qual o seu nível de jogo, e o clube combina o horário com você.`,
  },
  {
    pergunta: 'Preciso saber jogar para fazer aula?',
    resposta:
      'Não. As aulas vão do primeiro contato com a raquete à preparação de quem compete, e o elenco tem experiência com todos os níveis.',
  },
  {
    pergunta: 'Qual é o horário de funcionamento?',
    resposta: `O clube abre todos os dias: ${horariosPorExtenso}.`,
  },
  {
    pergunta: 'Onde fica o clube? Tem estacionamento?',
    resposta: `Na ${CLUBE.endereco}, no ${CLUBE.bairro}, em Fortaleza (CE), CEP ${CLUBE.cep}. O clube tem 25 vagas de estacionamento.`,
  },
  {
    pergunta: 'O que há no clube além das quadras?',
    resposta:
      'Lounge e área social, bar e gastronomia e uma área VIP. Ao longo da temporada há torneios internos com ranking e premiação, clínicas e workshops com profissionais convidados e encontros sociais.',
  },
  {
    pergunta: 'Quanto custa jogar no Sette?',
    resposta: `Os valores não são publicados no site. Consulte pelo app do clube ou pelo WhatsApp ${CLUBE.telefone}.`,
  },
  {
    pergunta: 'Como faço para me tornar membro?',
    resposta: `As novas admissões de membros acontecem por processo seletivo ou por lista de prioridade. Para saber como participar, fale com o clube pelo WhatsApp ${CLUBE.telefone}.`,
  },
]
