import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { urlAgendarAula } from '../../config/clube'
import Grain from '../Grain'

// Fecho da página.
//
// "O Clube" apresenta quem ensina, e aula de tênis é o centro da oferta do
// clube. Por isso a ação principal aqui é agendar aula — pelo WhatsApp, que é
// por onde o clube marca aulas. Reservar quadra continua ao lado, como segunda
// porta, levando a Contato, onde estão o app e as lojas.
//
// O texto antigo dizia que a reserva "não passa por formulário: é conversa".
// Deixou de ser verdade quando a reserva de quadra foi para o app.
export default function FechoClube() {
  const [ref, controls] = useScrollReveal(0.25)
  const agendar = urlAgendarAula()

  return (
    <section className="relative py-24 sm:py-32 px-6 bg-navy overflow-hidden" ref={ref}>
      <Grain />
      <div className="absolute top-0 left-0 w-full h-[2px] bg-terracotta" />

      <motion.div
        className="relative z-10 max-w-3xl mx-auto text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={controls}
        variants={{ visible: { opacity: 1, y: 0, transition: { duration: 1 } } }}
      >
        <span className="inline-block text-[0.65rem] tracking-ultra-wide uppercase text-terracotta-on-dark font-light font-body mb-8">
          Venha jogar
        </span>

        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-cream leading-snug text-balance">
          Não é preciso ser membro para entrar em quadra
        </h2>

        <div className="flex items-center justify-center gap-4 my-9">
          <div className="w-8 h-px bg-cream/35" />
          <div className="w-1.5 h-1.5 border border-terracotta-on-dark/60 rotate-45" />
          <div className="w-8 h-px bg-cream/35" />
        </div>

        <p className="text-base text-stone-light/85 font-light leading-relaxed max-w-lg mx-auto font-body text-balance">
          O Sette atende o público em geral. A aula de tênis se agenda pelo
          WhatsApp; a quadra, pelo app do clube.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4">
          {agendar && (
            <a
              href={agendar}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center px-9 py-5 sm:py-4 bg-terracotta border border-terracotta text-cream text-[0.7rem] tracking-ultra-wide uppercase font-body font-light hover:bg-terracotta-light hover:border-terracotta-light active:bg-terracotta-light active:border-terracotta-light transition-all duration-500 ease-out [-webkit-tap-highlight-color:transparent]"
            >
              Agendar uma aula
            </a>
          )}
          <Link
            to="/contato"
            className="block text-center px-9 py-5 sm:py-4 border border-terracotta-on-dark text-terracotta-on-dark text-[0.7rem] tracking-ultra-wide uppercase font-body font-light hover:bg-terracotta-on-dark hover:text-navy active:bg-terracotta-on-dark active:text-navy transition-all duration-500 ease-out [-webkit-tap-highlight-color:transparent]"
          >
            Reservar uma quadra
          </Link>
        </div>
      </motion.div>

      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-terracotta" />
    </section>
  )
}
