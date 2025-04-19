import { useState, useRef } from 'react'

export default function Zona({
  zona,
  setZona,
  mostrarZonas,
  setMostrarZonas,
  zonas,
  isMobile,
  filtrosChanged
}) {
  const [zonaOriginal, setZonaOriginal] = useState(zona)
  const inputRef = useRef(null)

  const zonasFiltradas = zonas?.filter(
    (c) =>
      !zona?.descripcion ||
      c.descripcion.toLowerCase().includes(zona.descripcion.toLowerCase())
  )

  const handleBorrar = () => {
    setZona((prev) => ({ ...prev, id: '', descripcion: '' }))
    setZonaOriginal({ id: '', descripcion: '' })
    inputRef.current?.focus()
    if (!isMobile)
      filtrosChanged(undefined, undefined, { id: '', descripcion: '' })
  }

  const handleChange = (e) => {
    const nuevoValor = e.target.value
    setZona((prev) => ({ ...prev, descripcion: nuevoValor }))
    if (!mostrarZonas) setMostrarZonas(true)
  }

  const handleBlur = () => {
    if (!mostrarZonas) return

    setMostrarZonas(false)

    const zonaInput = zona?.descripcion?.trim().toLowerCase()
    if (!zonaInput) {
      setZona(zonaOriginal)
      return
    }

    const seleccionada = zonasFiltradas.find(
      (z) => z.descripcion.toLowerCase() === zonaInput
    )

    if (seleccionada) {
      setZona(seleccionada)
      setZonaOriginal(seleccionada)
      if (!isMobile) filtrosChanged(undefined, undefined, seleccionada)
    } else {
      setZona(zonaOriginal)
    }
  }

  const handleSeleccionZona = (zonaSeleccionada) => {
    setZona(zonaSeleccionada)
    setMostrarZonas(false)
    if (!isMobile) filtrosChanged(undefined, undefined, zonaSeleccionada)
  }

  return (
    <div className='w-full'>
      <div className='flex items-center border border-gray-300 rounded-xl px-3 py-2 bg-white'>
        <input
          ref={inputRef}
          type='text'
          value={zona?.descripcion || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder='Zona'
          className='flex-1 focus:outline-none'
        />
        <button
          onClick={handleBorrar}
          className={`text-4xl mr-3 text-inf7 hover:text-gray-800 px-2 ${
            zona?.descripcion ? 'visible' : 'invisible'
          }`}
          title='Borrar'
        >
          ✕
        </button>
        <button
          onClick={() => setMostrarZonas(!mostrarZonas)}
          className='py-0 px-0 text-inf4 ml-2 text-4xl'
        >
          {mostrarZonas ? '▲' : '▼'}
        </button>
      </div>
      {mostrarZonas && zonas?.length > 0 && (
        <ul className='area-lista bg-white border border-gray-300 mt-1 w-full shadow max-h-60 overflow-y-auto'>
          {zonas
            .filter(
              (z) =>
                !zona?.descripcion ||
                z.descripcion
                  .toLowerCase()
                  .includes(zona.descripcion.toLowerCase())
            )
            .map((z) => (
              <li
                key={z.id}
                className='px-3 py-2 hover:bg-inf2 cursor-pointer'
                onMouseDown={() => handleSeleccionZona(z)}
              >
                {z.descripcion}
              </li>
            ))}
        </ul>
      )}
    </div>
  )
}
