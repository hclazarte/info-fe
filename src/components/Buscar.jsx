import { useEffect, useRef } from 'react'

export default function Buscar({
  filtrosAbiertos,
  setFiltrosAbiertos,
  texto,
  setTexto,
  filtrosChanged
}) {
  const inputRef = useRef(null)
  const debounceTimeout = useRef(null)

  const handleClear = () => {
    setTexto('')
    inputRef.current?.focus()
    filtrosChanged('', undefined, undefined)
  }
  const handleOpenClose = () => {
    setFiltrosAbiertos(!filtrosAbiertos)
    if (filtrosAbiertos) filtrosChanged()
  }
  const handleChange = (e) => {
    const nuevoTexto = e.target.value
    setTexto(nuevoTexto)

    // Cancelar temporizador previo
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    // Iniciar nuevo temporizador
    debounceTimeout.current = setTimeout(() => {
      filtrosChanged(nuevoTexto, undefined, undefined)
    }, 600)
  }
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      clearTimeout(debounceTimeout.current)
      filtrosChanged()
    }
  }
  const handlePaste = () => {}

  return (
    <div className='relative flex flex-col gap-1 mb-4'
      data-testid='buscar-control'>
      <div className='flex items-center gap-2'>
        <input
          ref={inputRef}
          type='text'
          placeholder='Buscar comercios...'
          className='flex-1 px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-100'
          value={texto}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          data-testid='buscar-input'
        />
        <button
          onClick={handleClear}
          className={`px-4 py-2 text-white bg-inf8 hover:bg-inf8 rounded-xl text-2xl ${
            texto ? 'visible' : 'invisible'
          }`}
          data-testid='buscar-erase-button'
        >
          X
        </button>
        <button
          onClick={handleOpenClose}
          className='px-3 py-2 bg-inf8 hover:bg-inf8 text-white rounded-xl text-3xl md:hidden'
          data-testid='buscar-pulldown-button'
        >
          {filtrosAbiertos ? '▲' : '☰'}
        </button>
      </div>
    </div>
  )
}
