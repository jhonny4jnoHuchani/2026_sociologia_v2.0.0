'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

export default function MantenimientoPage() {
  const router = useRouter()
  const [dots, setDots] = useState('.')

  // Animación de puntos suspensivos
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '.' : prev + '.')
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className='min-h-screen bg-[#f5f5f5] flex flex-col items-center justify-center px-4 relative overflow-hidden'>

      {/* Fondo geométrico sutil */}
      <div className='absolute inset-0 pointer-events-none'>
        {/* Grid de líneas */}
        <svg
          className='absolute inset-0 w-full h-full opacity-[0.04]'
          xmlns='http://www.w3.org/2000/svg'
        >
          <defs>
            <pattern id='grid' width='48' height='48' patternUnits='userSpaceOnUse'>
              <path d='M 48 0 L 0 0 0 48' fill='none' stroke='#000' strokeWidth='1' />
            </pattern>
          </defs>
          <rect width='100%' height='100%' fill='url(#grid)' />
        </svg>

        {/* Círculos decorativos */}
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.06, 0.1, 0.06] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className='absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full border border-gray-400'
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.04, 0.08, 0.04] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className='absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full border border-gray-400'
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-dashed border-gray-300 opacity-30'
        />
      </div>

      {/* Contenido principal */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className='relative z-10 text-center max-w-xl w-full'
      >

        {/* Ícono herramienta */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className='flex justify-center mb-8'
        >
          <div className='relative w-24 h-24 flex items-center justify-center'>
            <div className='absolute inset-0 rounded-2xl bg-white shadow-lg border border-gray-200' />
            <motion.div
              animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='w-10 h-10 relative z-10'
                fill='none'
                viewBox='0 0 24 24'
                stroke='#6b7280'
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z'
                />
              </svg>
            </motion.div>
          </div>
        </motion.div>

        {/* Etiqueta */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-200 text-gray-500 text-xs font-semibold uppercase tracking-widest mb-5'
        >
          <span className='w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse' />
          Estado del sistema
        </motion.div>

        {/* Título */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className='text-4xl sm:text-5xl font-black text-gray-800 leading-tight mb-4 tracking-tight'
        >
          Servicio temporalmente
          <br />
          <span className='text-gray-400'>en mantenimiento</span>
        </motion.h1>

        {/* Descripción */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className='text-gray-500 text-base leading-relaxed mb-10 max-w-md mx-auto'
        >
          Estamos realizando mejoras en nuestros servidores.
          El servicio estará disponible nuevamente en breve.
        </motion.p>

        {/* Indicador de carga animado */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className='flex items-center justify-center gap-2 mb-10'
        >
          {[0, 1, 2, 3].map(i => (
            <motion.div
              key={i}
              animate={{ scaleY: [1, 2, 1] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
              className='w-1 h-4 rounded-full bg-gray-300'
            />
          ))}
          <span className='text-gray-400 text-sm ml-2 font-mono'>
            Reconectando{dots}
          </span>
        </motion.div>

        {/* Divisor */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className='h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-8'
        />

        {/* Botón volver */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.back()}
          className='inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-gray-200 text-gray-600 text-sm font-medium shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200'
        >
          <svg xmlns='http://www.w3.org/2000/svg' className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
            <path strokeLinecap='round' strokeLinejoin='round' d='M10 19l-7-7m0 0l7-7m-7 7h18' />
          </svg>
          Volver
        </motion.button>

      </motion.div>

      {/* Pie */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className='absolute bottom-6 text-gray-400 text-xs'
      >
        Si el problema persiste, contacte al administrador del sistema.
      </motion.p>

    </div>
  )
}