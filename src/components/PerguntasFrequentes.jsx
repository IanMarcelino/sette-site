import { motion } from 'framer-motion'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { PERGUNTAS } from '../data/perguntas'

const reveal = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.25, 0.1, 0.25, 1] } },
}

/**
 * Perguntas frequentes, em campo claro.
 *
 * Mesmo desenho da tabela de horários — lista entre filetes de Areia Lavada,
 * pergunta em Title, resposta em Body —, para que a seção leia como parte da
 * página e não como bloco colado de outro site.
 *
 * Cada item é um `<details>` nativo: abre e fecha sem JavaScript, funciona com
 * teclado e leitor de tela sem ARIA extra, e a resposta está no HTML desde o
 * início — o que o buscador e a IA leem é o mesmo que o visitante abre. O sinal
 * de abrir é desenhado em traço de 1px, nunca em glifo, como as setas do
 * carrossel; aberto, o traço vertical recolhe e sobra o de fechar.
 *
 * O texto vem de `src/data/perguntas.js`, a mesma fonte do JSON-LD `FAQPage`.
 */
export default function PerguntasFrequentes() {
  const [ref, controls] = useScrollReveal(0.15)

  return (
    <section id="perguntas" className="bg-cream py-20 sm:py-28 px-6" ref={ref}>
      <div className="max-w-3xl mx-auto">
        <motion.div initial="hidden" animate={controls} variants={reveal} className="text-center mb-12">
          <span className="inline-block text-[0.65rem] tracking-ultra-wide uppercase text-terracotta font-light font-body mb-6">
            Antes de reservar
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-light text-navy">Perguntas frequentes</h2>
          <div className="w-12 h-[2px] bg-terracotta mx-auto mt-8" />
        </motion.div>

        <motion.div
          initial="hidden"
          animate={controls}
          variants={reveal}
          className="divide-y divide-sand/70 border-t border-b border-sand/70"
        >
          {PERGUNTAS.map(({ pergunta, resposta }) => (
            <details key={pergunta} className="group">
              <summary className="group/pergunta flex items-center justify-between gap-6 py-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden [-webkit-tap-highlight-color:transparent]">
                <h3 className="font-display text-xl sm:text-2xl font-light text-navy text-balance transition-colors duration-500 ease-out group-hover/pergunta:text-terracotta group-active/pergunta:text-terracotta">
                  {pergunta}
                </h3>
                <span aria-hidden="true" className="relative w-4 h-4 flex-shrink-0">
                  <span className="absolute top-1/2 left-0 w-full h-px -translate-y-1/2 bg-terracotta" />
                  <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-terracotta transition-transform duration-500 ease-out group-open:scale-y-0 motion-reduce:transition-none" />
                </span>
              </summary>
              <p className="pb-7 pr-10 max-w-2xl text-sm sm:text-base text-stone font-light leading-relaxed font-body">
                {resposta}
              </p>
            </details>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
