'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import HeroSkeleton from '../../Skeleton/Hero'
import Link from 'next/link'
import { motion, useScroll, useTransform, AnimatePresence, easeOut, type Variants } from 'motion/react'
import { getContenido, getInstitucionPrincipal } from '@/services/ambientalService'
import { PortadaType, InstitucionType } from '@/app/types/ambiental.types'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
}

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 50, filter: 'blur(8px)' },
  visible: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
}

const fadeInVariant: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1, scale: 1,
    transition: { duration: 0.5, ease: easeOut },
  },
}

const slideRightVariant: Variants = {
  hidden: { opacity: 0, x: 80, rotateY: -15 },
  visible: {
    opacity: 1, x: 0, rotateY: 0,
    transition: { duration: 0.7, ease: [0.34, 1.2, 0.64, 1] as [number, number, number, number] },
  },
}

// ── Letras que caen una por una ───────────────────────────────────────
const LetterByLetter = ({ text, className }: { text: string; className?: string }) => (
  <span className={className} aria-label={text}>
    {text.split('').map((char, i) => (
      <motion.span
        key={i}
        className='inline-block'
        style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        initial={{ opacity: 0, y: -40, scale: 0.6 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.5,
          delay: 0.3 + i * 0.04,
          ease: [0.34, 1.56, 0.64, 1],
        }}
        whileHover={{
          scale: 1.3,
          rotate: [-8, 8, -4, 0],
          transition: { duration: 0.4, ease: 'easeInOut' },
        }}
      >
        {char}
      </motion.span>
    ))}
  </span>
)

// ── Texto que gira en 3D al entrar ────────────────────────────────────
const SpinIn = ({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) => (
  <motion.span
    className={`inline-block ${className ?? ''}`}
    initial={{ rotateX: 90, opacity: 0, transformPerspective: 800 }}
    animate={{ rotateX: 0, opacity: 1 }}
    transition={{ duration: 0.7, delay, ease: [0.34, 1.2, 0.64, 1] }}
    style={{ transformOrigin: 'bottom center', display: 'inline-block' }}
  >
    {text}
  </motion.span>
)

// ── Botón ─────────────────────────────────────────────────────────────
const ActionButton = ({
  href, children, variant = 'primary',
}: {
  href: string; children: React.ReactNode; variant?: 'primary' | 'secondary'
}) => {
  const isPrimary = variant === 'primary'
  return (
    <Link href={href}>
      <motion.button
        whileHover={{ scale: 1.05, y: -3 }}
        whileTap={{ scale: 0.96, y: 0 }}
        className='px-8 py-3.5 font-semibold rounded-xl transition-all duration-300 cursor-pointer relative overflow-hidden flex items-center gap-2'
        style={
          isPrimary
            ? {
              color: '#ffffff',
              backgroundColor: 'var(--color-primario)',
              boxShadow: '0 4px 15px color-mix(in srgb, var(--color-primario) 30%, transparent)',
            }
            : {
              color: 'var(--color-primario)',
              backgroundColor: 'transparent',
              border: '2px solid var(--color-primario)',
            }
        }
        onMouseEnter={e => {
          if (!isPrimary) {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-primario)'
              ; (e.currentTarget as HTMLButtonElement).style.color = '#ffffff'
          }
        }}
        onMouseLeave={e => {
          if (!isPrimary) {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
              ; (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-primario)'
          }
        }}
      >
        <motion.span
          className='absolute inset-0 pointer-events-none'
          initial={{ x: '-100%', opacity: 0 }}
          whileHover={{ x: '100%', opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
          }}
        />
        {children}
      </motion.button>
    </Link>
  )
}

// ── Constantes de fondo ───────────────────────────────────────────────
const BUBBLES = [
  { size: 6, left: '7%', delay: 0, dur: 9, dx: 10 },
  { size: 10, left: '18%', delay: 1.4, dur: 12, dx: -8 },
  { size: 4, left: '31%', delay: 2.8, dur: 8, dx: 14 },
  { size: 8, left: '47%', delay: 0.6, dur: 13, dx: -11 },
  { size: 5, left: '61%', delay: 3.5, dur: 7, dx: 9 },
  { size: 12, left: '73%', delay: 1.9, dur: 11, dx: -7 },
  { size: 4, left: '84%', delay: 4.2, dur: 9, dx: 13 },
  { size: 7, left: '93%', delay: 0.3, dur: 10, dx: -9 },
] as const

const SHAPES = [
  { size: 48, top: '15%', left: '3%', delay: 0, dur: 14, rotate: 45 },
  { size: 32, top: '55%', left: '5%', delay: 2, dur: 10, rotate: 20 },
  { size: 56, top: '22%', right: '4%', delay: 1, dur: 16, rotate: -30 },
  { size: 24, top: '68%', right: '7%', delay: 3.5, dur: 11, rotate: 60 },
  { size: 40, top: '80%', left: '14%', delay: 1.5, dur: 13, rotate: -15 },
  { size: 20, top: '38%', right: '2%', delay: 4, dur: 9, rotate: 90 },
] as const

// ── Componente principal ──────────────────────────────────────────────
const Hero = () => {
  const [portadas, setPortadas] = useState<PortadaType[]>([])
  const [institucion, setInstitucion] = useState<InstitucionType | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)

  const { scrollY } = useScroll()
  const yParallax = useTransform(scrollY, [0, 500], [0, -80])
  const opacityParallax = useTransform(scrollY, [0, 300], [1, 0.5])

  useEffect(() => {
    let cancelled = false
    const fetchData = async () => {
      try {
        const [contenidoData, principalData] = await Promise.all([
          getContenido(),
          getInstitucionPrincipal(),
        ])
        if (cancelled) return
        setPortadas(contenidoData.portada)
        setInstitucion(principalData.Descripcion)
      } catch (error) {
        console.error('Error fetching Hero data:', error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchData()
    return () => { cancelled = true }
  }, [])

  const sliderSettings = {
    dots: true,
    arrows: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 1000,
    fade: true,
    cssEase: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    beforeChange: (_: number, next: number) => setCurrentSlide(next),
    appendDots: (dots: React.ReactNode) => (
      <div className='rounded-full px-4 py-2'>
        <ul className='flex gap-2 justify-center'>{dots}</ul>
      </div>
    ),
    customPaging: (i: number) => (
      <div
        className='h-2.5 rounded-full transition-all duration-300'
        style={{
          width: currentSlide === i ? '24px' : '10px',
          backgroundColor: currentSlide === i ? 'var(--color-primario)' : undefined,
        }}
      />
    ),
  }

  return (
    <section className='relative min-h-screen'>

      {/* ── ONDA SUPERIOR ── */}
      <div className='absolute top-0 left-0 right-0 pointer-events-none' style={{ zIndex: -5 }}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 1440 320'
          className='w-full h-auto block'
          style={{ fill: 'var(--color-bg-wave)', transform: 'rotate(180deg)' }}
          preserveAspectRatio='none'
        >
          <path d='M0,288L0,224L36.9,224L36.9,64L73.8,64L73.8,256L110.8,256L110.8,64L147.7,64L147.7,224L184.6,224L184.6,64L221.5,64L221.5,256L258.5,256L258.5,128L295.4,128L295.4,256L332.3,256L332.3,32L369.2,32L369.2,256L406.2,256L406.2,160L443.1,160L443.1,160L480,160L480,288L516.9,288L516.9,320L553.8,320L553.8,256L590.8,256L590.8,320L627.7,320L627.7,160L664.6,160L664.6,128L701.5,128L701.5,288L738.5,288L738.5,160L775.4,160L775.4,128L812.3,128L812.3,128L849.2,128L849.2,224L886.2,224L886.2,96L923.1,96L923.1,192L960,192L960,32L996.9,32L996.9,288L1033.8,288L1033.8,96L1070.8,96L1070.8,224L1107.7,224L1107.7,0L1144.6,0L1144.6,64L1181.5,64L1181.5,224L1218.5,224L1218.5,96L1255.4,96L1255.4,256L1292.3,256L1292.3,224L1329.2,224L1329.2,128L1366.2,128L1366.2,192L1403.1,192L1403.1,192L1440,192L1440,320L1403.1,320L1403.1,320L1366.2,320L1366.2,320L1329.2,320L1329.2,320L1292.3,320L1292.3,320L1255.4,320L1255.4,320L1218.5,320L1218.5,320L1181.5,320L1181.5,320L1144.6,320L1144.6,320L1107.7,320L1107.7,320L1070.8,320L1070.8,320L1033.8,320L1033.8,320L996.9,320L996.9,320L960,320L960,320L923.1,320L923.1,320L886.2,320L886.2,320L849.2,320L849.2,320L812.3,320L812.3,320L775.4,320L775.4,320L738.5,320L738.5,320L701.5,320L701.5,320L664.6,320L664.6,320L627.7,320L627.7,320L590.8,320L590.8,320L553.8,320L553.8,320L516.9,320L516.9,320L480,320L480,320L443.1,320L443.1,320L406.2,320L406.2,320L369.2,320L369.2,320L332.3,320L332.3,320L295.4,320L295.4,320L258.5,320L258.5,320L221.5,320L221.5,320L184.6,320L184.6,320L147.7,320L147.7,320L110.8,320L110.8,320L73.8,320L73.8,320L36.9,320L36.9,320L0,320L0,320Z' />
        </svg>
      </div>

      {/* ── FONDO ── */}
      <div className='absolute inset-0 overflow-hidden' style={{ zIndex: -10 }} aria-hidden='true'>

        <div
          className='absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl animate-pulse opacity-10'
          style={{ backgroundColor: 'var(--color-primario)' }}
        />
        <div
          className='absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl animate-pulse delay-1000 opacity-10'
          style={{ backgroundColor: 'var(--color-primario)' }}
        />

        <motion.div
          className='absolute inset-0 opacity-[0.035] dark:opacity-[0.06]'
          animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          style={{
            backgroundImage: 'radial-gradient(circle, var(--color-primario) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />

        {/* Ondas bottom */}
        <div className='absolute bottom-0 left-0 right-0 h-[220px]'>
          <motion.svg viewBox='0 0 1440 220' preserveAspectRatio='none'
            className='absolute bottom-0 left-0 w-full h-full' style={{ opacity: 0.07 }}>
            <motion.path fill='var(--color-primario)'
              animate={{
                d: [
                  'M0,160 C180,100 360,200 540,150 C720,100 900,200 1080,155 C1260,110 1380,180 1440,160 L1440,220 L0,220 Z',
                  'M0,140 C200,190 400,110 540,160 C680,210 860,120 1080,165 C1300,210 1380,140 1440,150 L1440,220 L0,220 Z',
                  'M0,160 C180,100 360,200 540,150 C720,100 900,200 1080,155 C1260,110 1380,180 1440,160 L1440,220 L0,220 Z',
                ]
              }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.svg>
          <motion.svg viewBox='0 0 1440 220' preserveAspectRatio='none'
            className='absolute bottom-0 left-0 w-full h-full' style={{ opacity: 0.05 }}>
            <motion.path fill='var(--color-primario)'
              animate={{
                d: [
                  'M0,180 C240,130 480,200 720,165 C960,130 1200,195 1440,170 L1440,220 L0,220 Z',
                  'M0,165 C240,200 480,140 720,185 C960,200 1200,145 1440,175 L1440,220 L0,220 Z',
                  'M0,180 C240,130 480,200 720,165 C960,130 1200,195 1440,170 L1440,220 L0,220 Z',
                ]
              }}
              transition={{ duration: 9, delay: 1, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.svg>
          <motion.svg viewBox='0 0 1440 220' preserveAspectRatio='none'
            className='absolute bottom-0 left-0 w-full h-full' style={{ opacity: 0.11 }}>
            <motion.path fill='var(--color-primario)'
              animate={{
                d: [
                  'M0,195 C300,170 600,210 900,185 C1100,165 1300,205 1440,190 L1440,220 L0,220 Z',
                  'M0,185 C300,210 600,175 900,200 C1100,215 1300,180 1440,195 L1440,220 L0,220 Z',
                  'M0,195 C300,170 600,210 900,185 C1100,165 1300,205 1440,190 L1440,220 L0,220 Z',
                ]
              }}
              transition={{ duration: 5, delay: 0.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.svg>
        </div>

        {/* Onda superior animada del fondo */}
        <div className='absolute top-0 left-0 right-0 h-[140px]'>
          <motion.svg viewBox='0 0 1440 140' preserveAspectRatio='none'
            className='absolute top-0 left-0 w-full h-full rotate-180' style={{ opacity: 0.04 }}>
            <motion.path fill='var(--color-primario)'
              animate={{
                d: [
                  'M0,60 C360,100 720,30 1080,75 C1260,95 1380,50 1440,60 L1440,140 L0,140 Z',
                  'M0,75 C360,30 720,100 1080,50 C1260,25 1380,85 1440,70 L1440,140 L0,140 Z',
                  'M0,60 C360,100 720,30 1080,75 C1260,95 1380,50 1440,60 L1440,140 L0,140 Z',
                ]
              }}
              transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.svg>
        </div>

        {/* Líneas de escaneo */}
        {[
          { width: '45%', top: '28%', delay: 0 },
          { width: '30%', top: '58%', delay: 2.2 },
          { width: '55%', top: '72%', delay: 4.5 },
        ].map((line, i) => (
          <motion.div key={i} className='absolute h-px'
            style={{
              width: line.width, top: line.top,
              background: 'linear-gradient(90deg, transparent, color-mix(in srgb, var(--color-primario) 30%, transparent), transparent)',
            }}
            animate={{ x: ['-100%', '400%'] }}
            transition={{ duration: 6, delay: line.delay, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
          />
        ))}

        {/* Burbujas ascendentes */}
        {BUBBLES.map((b, i) => (
          <motion.div key={i}
            className='absolute bottom-0 rounded-full border'
            style={{
              width: b.size, height: b.size, left: b.left,
              borderColor: 'color-mix(in srgb, var(--color-primario) 35%, transparent)',
              backgroundColor: 'color-mix(in srgb, var(--color-primario) 6%, transparent)',
            }}
            animate={{ y: [0, -620], x: [0, b.dx, -b.dx, 0], opacity: [0, 0.65, 0.5, 0], scale: [0.8, 1, 1.1, 0.9] }}
            transition={{ duration: b.dur, delay: b.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}

        {/* Formas geométricas flotantes */}
        {SHAPES.map((s, i) => (
          <motion.div key={i}
            className='absolute rounded-md'
            style={{
              width: s.size, height: s.size, top: s.top,
              ...('left' in s ? { left: s.left } : { right: s.right }),
              rotate: s.rotate,
              border: '1px solid color-mix(in srgb, var(--color-primario) 18%, transparent)',
              backgroundColor: 'color-mix(in srgb, var(--color-primario) 4%, transparent)',
            }}
            animate={{ y: [0, -18, 0], rotate: [s.rotate, s.rotate + 15, s.rotate - 10, s.rotate], opacity: [0.35, 0.65, 0.35] }}
            transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <div className='overflow-hidden'>
        <div className='container relative z-20 pt-28 lg:pt-32'>

          {/* ── Badge universidad ── */}
          <motion.div className='text-center mb-10' initial='hidden' animate='visible' variants={containerVariants}>
            <motion.div
              variants={fadeInVariant}
              className='inline-flex items-center gap-3 px-6 py-2.5 rounded-full backdrop-blur-md relative overflow-hidden'
              style={{
                background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-primario) 15%, transparent), color-mix(in srgb, var(--color-primario) 5%, transparent))',
                border: '1px solid color-mix(in srgb, var(--color-primario) 25%, transparent)',
                boxShadow: '0 4px 24px color-mix(in srgb, var(--color-primario) 12%, transparent), inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
              whileHover={{ scale: 1.04, y: -1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {/* Shimmer de fondo */}
              <motion.span
                className='absolute inset-0 pointer-events-none'
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
                style={{
                  background: 'linear-gradient(90deg, transparent, color-mix(in srgb, var(--color-primario) 20%, rgba(255,255,255,0.08)), transparent)',
                }}
              />

              {/* Punto parpadeante */}
              <span className='relative flex h-2.5 w-2.5 shrink-0'>
                <span
                  className='animate-ping absolute inline-flex h-full w-full rounded-full opacity-60'
                  style={{ backgroundColor: 'var(--color-primario)' }}
                />
                <span
                  className='relative inline-flex rounded-full h-2.5 w-2.5'
                  style={{ backgroundColor: 'var(--color-primario)' }}
                />
              </span>

              {/* Separador vertical */}
              <span
                className='w-px h-4 shrink-0 opacity-40'
                style={{ backgroundColor: 'var(--color-primario)' }}
              />

              {/* Texto */}
              <span
                className='relative tracking-[0.28em] text-sm font-bold uppercase dark:text-white text-black'
                style={{ letterSpacing: '0.28em' }}
              >
                Universidad Pública de El Alto
              </span>

              {/* Estrella giratoria */}
              <motion.span
                className='text-[10px] shrink-0 opacity-70'
                animate={{ rotate: [0, 180, 360], scale: [1, 1.2, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                style={{ color: 'var(--color-primario)' }}
              >
                ✦
              </motion.span>
            </motion.div>

            <motion.div
              variants={{ hidden: { scaleX: 0, opacity: 0 }, visible: { scaleX: 1, opacity: 1, transition: { duration: 0.7, ease: easeOut, delay: 0.3 } } }}
              className='w-20 h-0.5 mx-auto mt-4'
              style={{ background: 'linear-gradient(to right, transparent, var(--color-primario), transparent)' }}
            />
          </motion.div>

          <div className='relative z-20 grid lg:grid-cols-12 grid-cols-1 items-center lg:justify-items-normal justify-items-center gap-16 pb-16'>

            {/* ── LOGO FLOTANTE CENTRAL ── */}
            {!loading && institucion?.institucion_logo && (
              <motion.div
                className='absolute left-[52%] top-1/2 -translate-x-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center pointer-events-none'
                initial={{ opacity: 0, scale: 0, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.7, type: 'spring', stiffness: 240, damping: 18 }}
              >
                {/* Anillo exterior giratorio */}
                <motion.span
                  className='absolute rounded-full'
                  style={{ width: 460, height: 460, border: '1.5px dashed color-mix(in srgb, var(--color-primario) 40%, transparent)' }}
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                />
                {/* Anillo medio inverso */}
                <motion.span
                  className='absolute rounded-full'
                  style={{ width: 420, height: 420, border: '1px solid color-mix(in srgb, var(--color-primario) 22%, transparent)' }}
                  animate={{ rotate: [360, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                />
                {/* Pulso 1 */}
                <motion.span
                  className='absolute rounded-full'
                  style={{ width: 400, height: 400, backgroundColor: 'color-mix(in srgb, var(--color-primario) 16%, transparent)' }}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                />
                {/* Pulso 2 desfasado */}
                <motion.span
                  className='absolute rounded-full'
                  style={{ width: 400, height: 400, backgroundColor: 'color-mix(in srgb, var(--color-primario) 10%, transparent)' }}
                  animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2.6, delay: 1, repeat: Infinity, ease: 'easeInOut' }}
                />
                {/* Bob vertical */}
                <motion.div
                  className='relative z-10'
                  animate={{ y: [0, -14, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {/* Sombra que respira */}
                  <motion.span
                    className='absolute -bottom-6 left-1/2 -translate-x-1/2 rounded-full'
                    style={{ backgroundColor: 'color-mix(in srgb, var(--color-primario) 25%, transparent)', filter: 'blur(12px)' }}
                    animate={{ width: [160, 80, 160], height: [18, 8, 18], opacity: [0.6, 0.15, 0.6] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <Image
                    src={institucion.institucion_logo}
                    alt={institucion.institucion_nombre}
                    width={380}
                    height={380}
                    className='rounded-full object-contain'
                    style={{
                      border: '4px solid color-mix(in srgb, var(--color-primario) 55%, transparent)',
                      boxShadow: '0 16px 60px color-mix(in srgb, var(--color-primario) 30%, transparent), 0 0 0 12px color-mix(in srgb, var(--color-primario) 8%, transparent)',
                      background: 'color-mix(in srgb, var(--color-primario) 5%, white)',
                    }}
                  />
                </motion.div>
              </motion.div>
            )}
            {/* Columna izquierda */}
            <motion.div
              className='lg:col-span-6 col-span-1 lg:-translate-x-8'
              initial='hidden'
              animate={loading ? 'hidden' : 'visible'}
              variants={containerVariants}
              style={{ y: yParallax, opacity: opacityParallax }}
            >
              <div className='flex flex-col lg:items-start items-center gap-8'>


                {/* Título */}
                <motion.div variants={fadeUpVariant} className='max-w-xl'>
                  {loading ? (
                    <div className='space-y-3'>
                      <div className='w-80 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse' />
                      <div className='w-64 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse' />
                    </div>
                  ) : (
                    <h1>
                      <LetterByLetter
                        text={institucion?.institucion_nombre ?? 'Ingeniería Ambiental'}
                        className='text-4xl lg:text-5xl font-bold tracking-tight'
                      />
                    </h1>
                  )}
                </motion.div>

                {/* Línea decorativa */}
                <motion.div
                  variants={fadeUpVariant}
                  className='h-1 rounded-full'
                  style={{ background: 'linear-gradient(to right, var(--color-primario), color-mix(in srgb, var(--color-primario) 20%, transparent))' }}
                  initial={{ width: 0 }}
                  animate={{ width: ['0px', '80px', '64px', '80px'] }}
                  transition={{ duration: 1.2, delay: 0.8, ease: 'easeInOut', times: [0, 0.6, 0.8, 1] }}
                />

                {/* Misión */}
                {institucion?.institucion_mision && (
                  <motion.div
                    variants={fadeUpVariant}
                    className='text-lightgrey text-sm leading-relaxed line-clamp-3 max-w-md lg:text-start text-center [&>p]:m-0 relative pl-4'
                    style={{ borderLeft: '2px solid color-mix(in srgb, var(--color-primario) 30%, transparent)' }}
                    dangerouslySetInnerHTML={{ __html: institucion.institucion_mision }}
                  />
                )}

                {/* Botones */}
                <motion.div variants={fadeUpVariant} className='flex flex-wrap items-center gap-4'>

                  <ActionButton href='/publicaciones' variant='primary'>
                    <Image
                      src='/images/banner/estrellas.svg'
                      alt=''
                      width={20}      // ← Ajusta este valor
                      height={20}     // ← Ajusta este valor
                    />
                    Explorar
                  </ActionButton>

                  <ActionButton href='/about' variant='secondary'>
                    <Image
                      src='/images/banner/megafono.svg'
                      alt=''
                      width={20}      // ← Ajusta este valor
                      height={20}     // ← Ajusta este valor
                    />
                    Convocatorias
                  </ActionButton>

                </motion.div>

                {/* Redes sociales */}
                {institucion && (
                  <motion.div variants={fadeInVariant} className='flex items-center gap-4 pt-4'>
                    {[
                      {
                        href: institucion.institucion_facebook,
                        label: 'Facebook',
                        icon: '/images/banner/facebook.svg',
                        alt: 'Facebook'
                      },
                      {
                        href: institucion.institucion_youtube,
                        label: 'YouTube',
                        icon: '/images/banner/youtube.svg',
                        alt: 'YouTube'
                      },
                      {
                        href: institucion.institucion_twitter,
                        label: 'Telegram',
                        icon: '/images/banner/telegram.svg',
                        alt: 'Telegram'
                      },
                    ].filter(social => !!social.href).map((social, i) => (
                      <motion.a
                        key={i}
                        whileHover={{ y: -4, scale: 1.08 }}
                        whileTap={{ scale: 0.94 }}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.2 + i * 0.12, type: 'spring', stiffness: 300 }}
                        href={social.href}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-sm text-lightgrey transition-colors duration-300 flex items-center gap-2'
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-primario)')}
                        onMouseLeave={e => (e.currentTarget.style.color = '')}
                      >
                        <Image
                          src={social.icon}
                          alt={social.alt}
                          width={18}
                          height={18}
                          className="transition-all duration-300"
                        />
                        {social.label}
                      </motion.a>
                    ))}
                  </motion.div>
                )}

              </div>
            </motion.div>

            {/* Columna derecha — slider */}
            <motion.div

              className='lg:col-span-6 col-span-1 lg:w-full sm:w-[90%] w-full lg:translate-x-12 lg:scale-115'
              initial='hidden'
              animate='visible'
              variants={slideRightVariant}
            >
              <div className='relative'>
                <motion.div
                  className='absolute -inset-2 rounded-3xl -z-10 pointer-events-none'
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                  style={{
                    background: 'conic-gradient(from 0deg, color-mix(in srgb, var(--color-primario) 25%, transparent), transparent 40%, color-mix(in srgb, var(--color-primario) 15%, transparent) 65%, transparent)',
                    filter: 'blur(10px)',
                    opacity: 0.6,
                  }}
                />

                <motion.div
                  className='rounded-2xl overflow-hidden shadow-2xl relative group'
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  style={{
                    boxShadow: '0 20px 50px -10px color-mix(in srgb, var(--color-primario) 20%, rgba(0,0,0,0.25))',
                  }}>
                  <Slider {...sliderSettings}>
                    {loading
                      ? Array.from({ length: 3 }).map((_, i) => <HeroSkeleton key={i} />)
                      : portadas.map((item, idx) => (
<div key={item.portada_id} className='relative aspect-[16/9]'>
  <div className='absolute inset-0'>
    <Image
      src={item.portada_imagen}
      alt={item.portada_titulo}
      fill
      className='object-cover transition-transform duration-700 group-hover:scale-105'
      priority={idx === 0}
      sizes='(max-width: 1024px) 100vw, 42vw'
    />
  </div>
  <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent' />
  <AnimatePresence>
    <motion.div
      className='absolute bottom-0 left-0 right-0 px-5 py-4'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className='w-12 h-0.5 rounded-full mt-2'
        style={{ backgroundColor: 'color-mix(in srgb, var(--color-primario) 70%, transparent)' }} />
    </motion.div>
  </AnimatePresence>
</div>
                      ))}
                  </Slider>

                  <motion.div
                    className='absolute bottom-0 left-0 right-0 h-[3px]'
                    style={{ background: 'linear-gradient(90deg, transparent, var(--color-primario), transparent)' }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  />


                </motion.div>
              </div>
            </motion.div>

          </div>






          {/* Decorativos flotantes */}
          <motion.div
            className='absolute top-24 -left-10 dark:opacity-10 z-0'
            animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden='true'
          >
            <Image src='/images/banner/pattern1.svg' alt='' width={141} height={141} />
          </motion.div>

          <motion.div
            className='absolute bottom-20 right-10 dark:opacity-10 z-0'
            animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            aria-hidden='true'
          >
            <Image src='/images/banner/pattern2.svg' alt='' width={120} height={120} />
          </motion.div>

          {/* Scroll indicator */}
          <div
            className='absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 z-10 animate-bounce opacity-50'
            aria-hidden='true'
          >
            <span className='text-xs text-lightgrey/50 uppercase tracking-wider'>Scroll</span>
            <div
              className='w-0.5 h-8 rounded-full'
              style={{ background: 'linear-gradient(to bottom, color-mix(in srgb, var(--color-primario) 50%, transparent), transparent)' }}
            />
          </div>

        </div>
      </div>

    </section>
  )
}

export default Hero