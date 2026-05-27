'use client'

import { useEffect, useState } from 'react'
import { getContenido, getInstitucionPrincipal } from '@/services/ambientalService'
import { UbicacionType, InstitucionType } from '@/app/types/ambiental.types'
import RecordSkeleton from '../../Skeleton/Record'
import { motion } from 'motion/react'

const Ubicacion = () => {
  const [ubicacion, setUbicacion] = useState<UbicacionType | null>(null)
  const [institucion, setInstitucion] = useState<InstitucionType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contenidoData, principalData] = await Promise.all([
          getContenido(),
          getInstitucionPrincipal(),
        ])
        setUbicacion(contenidoData.ubicacion[0] ?? null)
        setInstitucion(principalData.Descripcion)
      } catch (error) {
        console.error('Error fetching ubicacion:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <section id='ubicacion' className='scroll-mt-12 py-16 bg-secondary dark:bg-darklight relative overflow-hidden'>

      {/* Fondo decorativo */}
      <div className='absolute inset-0 pointer-events-none' aria-hidden='true'>
        <div
          className='absolute top-0 left-0 w-72 h-72 rounded-full blur-3xl opacity-10'
          style={{ backgroundColor: 'var(--color-primario)' }}
        />
        <div
          className='absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10'
          style={{ backgroundColor: 'var(--color-primario)' }}
        />
        <motion.div
          className='absolute inset-0 opacity-[0.025]'
          animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          style={{
            backgroundImage: 'radial-gradient(circle, var(--color-primario) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className='container relative z-10'>

        {/* Encabezado */}
        <motion.div
          className='text-center mb-10'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <motion.span
            className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4'
            style={{
              color: 'var(--color-primario)',
              backgroundColor: 'color-mix(in srgb, var(--color-primario) 10%, transparent)',
              border: '1px solid color-mix(in srgb, var(--color-primario) 25%, transparent)',
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <span
              className='w-1.5 h-1.5 rounded-full animate-pulse'
              style={{ backgroundColor: 'var(--color-primario)' }}
            />
            ¿Dónde estamos?
          </motion.span>

          <h2 className='text-3xl lg:text-4xl font-bold'>
            Ubicación —{' '}
            <span style={{ color: 'var(--color-primario)' }}>
              {institucion?.institucion_nombre ?? 'Ingeniería Ambiental'}
            </span>
          </h2>

          <motion.div
            className='w-16 h-1 mx-auto mt-4 rounded-full'
            style={{ background: 'linear-gradient(to right, var(--color-primario), color-mix(in srgb, var(--color-primario) 20%, transparent))' }}
            initial={{ width: 0 }}
            whileInView={{ width: 64 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />

          {ubicacion?.ubicacion_descripcion && (
            <p className='text-lightgrey mt-4 max-w-xl mx-auto text-sm leading-relaxed'>
              {ubicacion.ubicacion_descripcion}
            </p>
          )}
        </motion.div>

        {/* Mapa */}
        {loading ? (
          <div className='grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-6'>
            {Array.from({ length: 4 }).map((_, i) => (
              <RecordSkeleton key={i} />
            ))}
          </div>
        ) : institucion?.institucion_api_google_map ? (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
            className='relative rounded-2xl overflow-hidden shadow-2xl'
            style={{
              border: '1px solid color-mix(in srgb, var(--color-primario) 20%, transparent)',
              boxShadow: '0 20px 60px color-mix(in srgb, var(--color-primario) 15%, rgba(0,0,0,0.2))',
            }}
          >
            {/* Barra superior decorativa */}
            <div
              className='h-1 w-full'
              style={{ background: 'linear-gradient(90deg, transparent, var(--color-primario), transparent)' }}
            />

            <iframe
              src={institucion.institucion_api_google_map}
              width='100%'
              height='500'
              style={{ border: 0, display: 'block' }}
              allowFullScreen
              loading='lazy'
              referrerPolicy='no-referrer-when-downgrade'
              title={`Ubicación ${institucion.institucion_nombre}`}
            />

            {/* Etiqueta flotante */}
            <motion.div
              className='absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-md text-sm font-semibold'
              style={{
                backgroundColor: 'color-mix(in srgb, var(--color-primario) 85%, transparent)',
                color: '#fff',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              }}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <svg xmlns='http://www.w3.org/2000/svg' className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z'/>
              </svg>
              {institucion.institucion_nombre}
            </motion.div>
          </motion.div>
        ) : (
          <p className='text-center text-lightgrey'>Mapa no disponible.</p>
        )}

      </div>
    </section>
  )
}

export default Ubicacion