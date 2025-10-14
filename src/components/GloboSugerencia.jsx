import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function GloboSugerencia() {
  const [mostrar, setMostrar] = useState(false)

  useEffect(() => {
    const intervalo = 45000 // cada 45 segundos
    const duracionVisible = 7000 // visible 7 segundos

    const mostrarYOcultar = () => {
      setMostrar(true)
      setTimeout(() => setMostrar(false), duracionVisible)
    }

    // Mostrar la primera vez
    mostrarYOcultar()

    // Repetir intermitentemente
    const intervalId = setInterval(mostrarYOcultar, intervalo)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <AnimatePresence>
      {mostrar && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.5 }}
          className='absolute right-8 bottom-16 z-50 bg-amber-400 text-black px-10 py-2 shadow-lg inline-flex items-center'
          style={{ borderRadius: 30 }} // fuerza ambos bordes redondeados
        >
          💬{' '}
          <span className='ml-2 leading-tight'>
            Gana Dinero
            <br />
            Siendo Promotor
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
