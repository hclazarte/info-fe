import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function GloboSugerencia() {
  const [mostrar, setMostrar] = useState(false)

  useEffect(() => {
    const timeoutMostrar = setTimeout(() => setMostrar(true), 1500)
    const timeoutOcultar = setTimeout(() => setMostrar(false), 8000)
    return () => {
      clearTimeout(timeoutMostrar)
      clearTimeout(timeoutOcultar)
    }
  }, [])

  return (
    <AnimatePresence>
      {mostrar && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className='absolute -top-20 left-[65%] px-3 py-1 bg-white text-black text-xs rounded shadow-md border border-inf3 z-50'
        >
          ➕ Añada su negocio
          <div className='absolute w-3 h-3 rotate-45 bg-white border-l border-t border-inf3 left-[40%] -bottom-1'></div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
