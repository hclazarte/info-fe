import { useState } from 'react'

export default function Buscar({
  filtrosAbiertos,
  setFiltrosAbiertos,
  texto,
  setTexto
}) {
  const handleClear = () => {
    setTexto('')
  }

  return (
    <div className='relative flex flex-col gap-1 mb-4'>
      <div className='flex items-center gap-2'>
        <input
          type='text'
          placeholder='Buscar comercios...'
          className='flex-1 px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-100'
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />

        <button
          onClick={handleClear}
          className={`px-4 py-2 text-white bg-inf8 hover:bg-inf3 rounded-xl text-2xl ${
            texto ? 'visible' : 'invisible'
          }`}
        >
          X
        </button>

        <button
          onClick={() => setFiltrosAbiertos(!filtrosAbiertos)}
          className='px-3 py-2 bg-inf8 hover:bg-inf3 text-white rounded-xl text-3xl md:hidden'
        >
          {filtrosAbiertos ? '▲' : '☰'}
        </button>
      </div>
    </div>
  )
}
