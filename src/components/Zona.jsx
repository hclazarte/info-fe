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

  const handlePullUpDown = () => {
    if (!mostrarZonas) {
      // ▼ PullDown
      setZonaOriginal(zona)
      setMostrarZonas(true)
      setZona({ id: '', descripcion: '' })
      inputRef.current?.focus()
    } else {
      //  ▲ PullUp
      setMostrarZonas(false)
      setZona(zonaOriginal)
    }
  }

  const handleSeleccionZona = (zonaSeleccionada) => {
    setZona(zonaSeleccionada)
    setMostrarZonas(false)
    if (!isMobile) filtrosChanged(undefined, undefined, zonaSeleccionada)
  }

  return (
    <div className='w-full' data-testid='zona-control'>
      <div className='flex items-center border border-gray-300 rounded-xl px-3 py-2 bg-white'>
        <input
          ref={inputRef}
          type='text'
          value={zona?.descripcion || ''}
          onChange={handleChange}
          placeholder='Zona'
          className='flex-1 focus:outline-none'
          data-testid='zona-input'
        />
        <button
          onClick={handleBorrar}
          className={`text-4xl mr-3 text-inf7 hover:text-gray-800 px-2 ${
            zona?.descripcion ? 'visible' : 'invisible'
          }`}
          title='Borrar'
          data-testid='zona-erase-button'
        >
          ✕
        </button>
        <button
          onClick={handlePullUpDown}
          className='py-0 px-0 text-inf4 ml-2 text-4xl'
          data-testid='zona-pulldown-button'
        >
          {mostrarZonas ? '▲' : '▼'}
        </button>
      </div>
      {mostrarZonas && zonas?.length > 0 && (
        <ul
          className='area-lista bg-white border border-gray-300 mt-1 w-full shadow max-h-60 overflow-y-auto'
          data-testid='zona-ul'
        >
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
                data-testclass='zona-li'
              >
                {z.descripcion}
              </li>
            ))}
        </ul>
      )}
    </div>
  )
}
