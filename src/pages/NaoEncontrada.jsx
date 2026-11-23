import { Link } from 'react-router-dom'
import Grain from '../components/Grain'
import badgeWhite from '../assets/badge-white.svg'

/** Endereço que não existe. Mesmo chassi da rota /app: campo navy, régua, selo. */
export default function NaoEncontrada() {
  return (
    <section className="relative bg-navy min-h-svh flex items-center justify-center overflow-hidden px-6 py-32">
      <Grain />
      <div className="absolute top-0 left-0 w-full h-[2px] bg-terracotta" />

      <div className="relative z-10 w-full max-w-lg text-center">
        <img src={badgeWhite} alt="" aria-hidden="true" width={72} height={72} className="w-16 h-16 mx-auto mb-8 opacity-60" />

        <span className="inline-block text-[0.65rem] tracking-ultra-wide uppercase text-terracotta-on-dark font-light font-body mb-6">
          Erro 404
        </span>

        <h1 className="font-display text-3xl sm:text-4xl font-light text-cream leading-snug text-balance">
          Esta página não existe
        </h1>

        <div className="w-12 h-[2px] bg-terracotta-on-dark mx-auto my-7" />

        <p className="text-sm sm:text-base text-stone-light/85 font-light leading-relaxed font-body text-balance">
          O endereço pode ter mudado ou ter sido digitado com erro.
        </p>

        <p className="mt-10">
          <Link
            to="/"
            className="text-[0.65rem] tracking-ultra-wide uppercase text-terracotta-on-dark hover:text-cream transition-colors duration-300 font-light font-body"
          >
            Ir para o início
          </Link>
        </p>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-terracotta" />
    </section>
  )
}
