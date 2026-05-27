'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { Icon } from '@iconify/react'
import { getInstitucionPrincipal } from '@/services/ambientalService'
import { InstitucionType } from '@/app/types/ambiental.types'

const quickLinks = [
  {
    section: 'Carrera',
    links: [
      { label: 'Publicaciones', href: '/#publicaciones' },
      { label: 'Convocatorias', href: '/#convocatorias' },
      { label: 'Cursos', href: '/#cursos' },
      { label: 'Eventos', href: '/#eventos' },
    ],
  },
  {
    section: 'Recursos',
    links: [
      { label: 'Servicios', href: '/#servicios' },
      { label: 'Gaceta', href: '/#gaceta' },
      { label: 'Videos', href: '/#videos' },
      { label: 'Ofertas', href: '/#ofertas' },
    ],
  },
]

const Footer = () => {
  const [institucion, setInstitucion] = useState<InstitucionType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInstitucionPrincipal()
        setInstitucion(data.Descripcion)
      } catch (error) {
        console.error('Error fetching footer data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const primaryColor = institucion?.colorinstitucion?.[0]?.color_primario ?? '#4F8D40'

  const hoverOn = (e: React.MouseEvent<Element>) => {
    (e.currentTarget as HTMLElement).style.color = primaryColor
  }
  const hoverOff = (e: React.MouseEvent<Element>) => {
    (e.currentTarget as HTMLElement).style.color = ''
  }

  return (
    <footer className='relative overflow-hidden'>

      {/* Fondo decorativo */}
      <div className='absolute inset-0 pointer-events-none' aria-hidden='true'>
        <div
          className='absolute top-10 left-10 w-72 h-72 rounded-full blur-3xl animate-pulse opacity-10'
          style={{ backgroundColor: primaryColor }}
        />
        <div
          className='absolute bottom-10 right-10 w-96 h-96 rounded-full blur-3xl animate-pulse delay-1000 opacity-10'
          style={{ backgroundColor: primaryColor }}
        />
        <div
          className='absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-[0.06]'
          style={{ backgroundColor: primaryColor }}
        />
        <div
          className='absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-[0.06]'
          style={{ backgroundColor: primaryColor }}
        />
        <motion.div
          className='absolute inset-0 opacity-[0.02]'
          animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          style={{
            backgroundImage: `radial-gradient(circle, ${primaryColor} 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      {/* Línea superior */}
      <div
        className='h-1 w-full'
        style={{ background: `linear-gradient(90deg, transparent, ${primaryColor}, transparent)` }}
      />

      <div className='container relative z-10 py-5'>

        {/* ── Fila superior: logos + plataformas ── */}
        <motion.div
          className='flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3 pb-5 border-b border-lightgrey/10'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Logos lado a lado */}
          <div className='flex items-center gap-3'>
            {loading ? (
              <div className='w-11 h-11 rounded-full bg-gray-200 dark:bg-white/10 animate-pulse' />
            ) : institucion?.institucion_logo ? (
              <Image
                src={institucion.institucion_logo}
                alt={institucion.institucion_nombre}
                width={100}
                height={100}
                className='rounded-full object-contain'
                style={{ border: `2px solid color-mix(in srgb, ${primaryColor} 40%, transparent)` }}
              />
            ) : null}
            <div>
              <p className='text-darkblue dark:text-white font-semibold text-sm'>
                {loading ? '...' : institucion?.institucion_nombre ?? 'Ingeniería Ambiental'}
              </p>
              <p className='text-lightgrey text-xs'>Universidad Pública de El Alto</p>
            </div>

            <div className='w-px h-10 mx-2 bg-lightgrey/20' />

            <motion.a
              href='https://utic.upea.bo/'
              target='_blank'
              rel='noreferrer'
              whileHover={{ scale: 1.05 }}
              className='rounded-full p-1.5 duration-300 transition-colors'
              onMouseEnter={e => {
                const isDark = document.documentElement.classList.contains('dark')
                e.currentTarget.style.backgroundColor = isDark
                  ? 'rgba(255,255,255,0.12)'
                  : 'rgba(59,130,246,0.15)'
                e.currentTarget.style.boxShadow = isDark
                  ? '0 0 0 2px rgba(255,255,255,0.2)'
                  : '0 0 0 2px rgba(59,130,246,0.3)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <Image
                src='/logo/utic_2.png'
                alt='UTIC'
                width={170}
                height={170}
                className='object-contain block dark:hidden'
              />
              <Image
                src='/logo/logo_utic_cir.png'
                alt='UTIC'
                width={100}
                height={100}
                className='rounded-full object-contain hidden dark:block'
              />
            </motion.a>
          </div>

          {/* Plataformas */}
          <div className='flex sm:flex-row flex-col sm:items-center gap-3'>
            <p className='text-lightgrey text-xs uppercase tracking-widest font-semibold'>Plataformas</p>
            <div className='flex flex-wrap items-center gap-2'>
              {[
                { label: 'Inscripciones', href: 'https://inscripcionesambiental.upea.bo/' },
                { label: 'Campus Virtual', href: 'https://virtualambiental.upea.bo/' },
                { label: 'Página Web', href: 'https://ambiental.upea.edu.bo/' },
              ].map((pl, i) => (
                <motion.a
                  key={i}
                  href={pl.href}
                  target='_blank'
                  rel='noreferrer'
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  className='px-4 py-1.5 text-xs font-semibold rounded-lg border duration-300'
                  style={{
                    color: '#ffffff',
                    backgroundColor: primaryColor,
                    borderColor: primaryColor,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = primaryColor
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = primaryColor
                    e.currentTarget.style.color = '#ffffff'
                  }}
                >
                  {pl.label}
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Grid principal ── */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 xl:gap-8'>

          {/* COLUMNA 1 — Info + redes */}
          <motion.div
            className='lg:col-span-4 sm:col-span-2 flex flex-col gap-3'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div>
              <p className='text-darkblue dark:text-white text-xl font-bold mb-0.5'>
                {loading ? '...' : institucion?.institucion_nombre ?? 'Ingeniería Ambiental'}
              </p>
              <p className='text-lightgrey text-sm'>Universidad Pública de El Alto</p>
              <div
                className='w-10 h-0.5 mt-2 rounded-full'
                style={{ background: `linear-gradient(to right, ${primaryColor}, transparent)` }}
              />
            </div>

            <div className='flex gap-2'>
              {institucion?.institucion_facebook && (
                <Link href={institucion.institucion_facebook} target='_blank'>
                  <motion.div
                    whileHover={{ scale: 1.1, y: -2 }}
                    className='text-darkblue dark:text-white rounded-xl p-2.5 duration-300 cursor-pointer'
                    style={{
                      backgroundColor: `color-mix(in srgb, ${primaryColor} 10%, transparent)`,
                      border: `1px solid color-mix(in srgb, ${primaryColor} 20%, transparent)`,
                    }}
                    onMouseEnter={hoverOn}
                    onMouseLeave={hoverOff}
                  >
                    <Icon icon='tabler:brand-facebook' width={22} height={22} />
                  </motion.div>
                </Link>
              )}
              {institucion?.institucion_youtube && (
                <Link href={institucion.institucion_youtube} target='_blank'>
                  <motion.div
                    whileHover={{ scale: 1.1, y: -2 }}
                    className='text-darkblue dark:text-white rounded-xl p-2.5 duration-300 cursor-pointer'
                    style={{
                      backgroundColor: `color-mix(in srgb, ${primaryColor} 10%, transparent)`,
                      border: `1px solid color-mix(in srgb, ${primaryColor} 20%, transparent)`,
                    }}
                    onMouseEnter={hoverOn}
                    onMouseLeave={hoverOff}
                  >
                    <Icon icon='tabler:brand-youtube-filled' width={22} height={22} />
                  </motion.div>
                </Link>
              )}
              {institucion?.institucion_twitter && (
                <Link href={institucion.institucion_twitter} target='_blank'>
                  <motion.div
                    whileHover={{ scale: 1.1, y: -2 }}
                    className='text-darkblue dark:text-white rounded-xl p-2.5 duration-300 cursor-pointer'
                    style={{
                      backgroundColor: `color-mix(in srgb, ${primaryColor} 10%, transparent)`,
                      border: `1px solid color-mix(in srgb, ${primaryColor} 20%, transparent)`,
                    }}
                    onMouseEnter={hoverOn}
                    onMouseLeave={hoverOff}
                  >
                    <Icon icon='tabler:brand-telegram' width={22} height={22} />
                  </motion.div>
                </Link>
              )}
            </div>
          </motion.div>

          {/* COLUMNA 2 — Links rápidos */}
          <motion.div
            className='lg:col-span-4 col-span-1'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className='flex gap-16'>
              {quickLinks.map((group, i) => (
                <div key={i}>
                  <p className='text-darkblue dark:text-white text-base font-bold mb-3 flex items-center gap-2'>
                    <span
                      className='w-1.5 h-1.5 rounded-full'
                      style={{ backgroundColor: primaryColor }}
                    />
                    {group.section}
                  </p>
                  <ul className='flex flex-col gap-2'>
                    {group.links.map((item, j) => (
                      <li key={j}>
                        <Link
                          href={item.href}
                          className='text-darkblue/60 dark:text-white/60 text-sm font-normal duration-300 flex items-center gap-1.5 group'
                          onMouseEnter={hoverOn}
                          onMouseLeave={hoverOff}
                        >
                          <span
                            className='w-0 group-hover:w-3 h-px transition-all duration-300 rounded-full'
                            style={{ backgroundColor: primaryColor }}
                          />
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>

          {/* COLUMNA 3 — Contacto */}
          <motion.div
            className='lg:col-span-4 col-span-1 flex flex-col gap-3'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className='text-darkblue dark:text-white text-base font-bold flex items-center gap-2'>
              <span
                className='w-1.5 h-1.5 rounded-full'
                style={{ backgroundColor: primaryColor }}
              />
              Contacto
            </p>

            <div className='flex flex-col gap-2.5'>
              {institucion?.institucion_direccion && (
                <div className='flex gap-3 items-start'>
                  <div
                    className='p-1.5 rounded-lg shrink-0 mt-0.5'
                    style={{ backgroundColor: `color-mix(in srgb, ${primaryColor} 10%, transparent)` }}
                  >
                    <Icon icon='tabler:map-pin' width={16} height={16} style={{ color: primaryColor }} />
                  </div>
                  <p className='text-sm text-darkblue/70 dark:text-white/70 leading-relaxed'>
                    {institucion.institucion_direccion}
                  </p>
                </div>
              )}

              {institucion?.institucion_celular1 && (
                <div className='flex gap-3 items-center'>
                  <div
                    className='p-1.5 rounded-lg shrink-0'
                    style={{ backgroundColor: `color-mix(in srgb, ${primaryColor} 10%, transparent)` }}
                  >
                    <Icon icon='tabler:phone' width={16} height={16} style={{ color: primaryColor }} />
                  </div>
                  <Link
                    href={`tel:${institucion.institucion_celular1}`}
                    className='text-sm text-darkblue/70 dark:text-white/70 duration-300'
                    onMouseEnter={hoverOn}
                    onMouseLeave={hoverOff}
                  >
                    {institucion.institucion_celular1}
                  </Link>
                </div>
              )}

              {institucion?.institucion_celular2 && (
                <div className='flex gap-3 items-center'>
                  <div
                    className='p-1.5 rounded-lg shrink-0'
                    style={{ backgroundColor: `color-mix(in srgb, ${primaryColor} 10%, transparent)` }}
                  >
                    <Icon icon='tabler:phone' width={16} height={16} style={{ color: primaryColor }} />
                  </div>
                  <Link
                    href={`tel:${institucion.institucion_celular2}`}
                    className='text-sm text-darkblue/70 dark:text-white/70 duration-300'
                    onMouseEnter={hoverOn}
                    onMouseLeave={hoverOff}
                  >
                    {institucion.institucion_celular2}
                  </Link>
                </div>
              )}

              {institucion?.institucion_correo1 && (
                <div className='flex gap-3 items-center'>
                  <div
                    className='p-1.5 rounded-lg shrink-0'
                    style={{ backgroundColor: `color-mix(in srgb, ${primaryColor} 10%, transparent)` }}
                  >
                    <Icon icon='tabler:mail' width={16} height={16} style={{ color: primaryColor }} />
                  </div>
                  <Link
                    href={`mailto:${institucion.institucion_correo1}`}
                    className='text-sm text-darkblue/70 dark:text-white/70 duration-300 break-all'
                    onMouseEnter={hoverOn}
                    onMouseLeave={hoverOff}
                  >
                    {institucion.institucion_correo1}
                  </Link>
                </div>
              )}

              {institucion?.institucion_correo2 && (
                <div className='flex gap-3 items-center'>
                  <div
                    className='p-1.5 rounded-lg shrink-0'
                    style={{ backgroundColor: `color-mix(in srgb, ${primaryColor} 10%, transparent)` }}
                  >
                    <Icon icon='tabler:mail' width={16} height={16} style={{ color: primaryColor }} />
                  </div>
                  <Link
                    href={`mailto:${institucion.institucion_correo2}`}
                    className='text-sm text-darkblue/70 dark:text-white/70 duration-300 break-all'
                    onMouseEnter={hoverOn}
                    onMouseLeave={hoverOff}
                  >
                    {institucion.institucion_correo2}
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Copyright ── */}
      <div
        className='py-3 border-t'
        style={{ borderColor: `color-mix(in srgb, ${primaryColor} 15%, transparent)` }}
      >
        <p className='text-center text-sm text-black dark:text-white flex flex-wrap items-center justify-center gap-1.5 opacity-70'>
          © Universidad Pública de El Alto {new Date().getFullYear()}
          <span className='opacity-40'>|</span>
          <Link
            href='https://utic.upea.bo/'
            target='_blank'
            rel='noreferrer'
            className='duration-300 font-semibold hover:opacity-100'
            onMouseEnter={hoverOn}
            onMouseLeave={hoverOff}
          >
            UTIC
          </Link>
          <span className='opacity-40'>·</span>
          <span>Web Developer:</span>
          <Link
            href='https://www.linkedin.com/in/jhonny-ajno-huchani-6545903a2/'
            target='_blank'
            rel='noreferrer'
            className='duration-300 font-semibold hover:opacity-100'
            onMouseEnter={hoverOn}
            onMouseLeave={hoverOff}
          >
            JhonnyAH
          </Link>
          <span className='opacity-40'>·</span>
          Todos los Derechos Reservados
        </p>
      </div>

    </footer>
  )
}

export default Footer