import { useState, useRef } from 'react'

export default function Ciudad({
  ciudad,
  setCiudad,
  mostrarCiudades,
  setMostrarCiudades,
  ciudades,
  onCiudadChanged,
  isMobile,
  filtrosChanged
}) {
  const [ciudadOriginal, setCiudadOriginal] = useState(ciudad)
  const inputRef = useRef(null)

  const ciudadesFiltradas = ciudades?.filter(
    (c) =>
      !ciudad?.ciudad ||
      c.ciudad.toLowerCase().includes(ciudad.ciudad.toLowerCase())
  )

  const handleBorrar = () => {
    setCiudad((prev) => ({ ...prev, id: '', ciudad: '' }))
    setCiudadOriginal({ id: '', ciudad: '' })
    inputRef.current?.focus()
    onCiudadChanged?.({ id: '', ciudad: '' })
    if (!isMobile)
      filtrosChanged(undefined, { id: '', descripcion: '' }, undefined)
  }

  const handleChange = (e) => {
    const nuevoValor = e.target.value
    setCiudad((prev) => ({ ...prev, ciudad: nuevoValor }))
    if (!mostrarCiudades) setMostrarCiudades(true)
  }

  const handlePullUpDown = () => {
    if (!mostrarCiudades) {
      // ▼ PullDown
      setCiudadOriginal(ciudad)
      setMostrarCiudades(true)
      setCiudad({ id: '', ciudad: '' })
      inputRef.current?.focus()
    } else {
      //  ▲ PullUp
      setMostrarCiudades(false)
      setCiudad(ciudadOriginal)
    }
  }

  const handleSeleccionCiudad = (ciudadSeleccionada) => {
    setCiudad(ciudadSeleccionada)
    setMostrarCiudades(false)
    setCiudadOriginal(ciudadSeleccionada)
    onCiudadChanged?.(ciudadSeleccionada)
    if (!isMobile) filtrosChanged(undefined, ciudadSeleccionada, undefined)
  }

  return (
    <div className='w-full'>
      <div className='flex items-center border border-gray-300 rounded-xl px-3 py-2 bg-white'>
        <input
          ref={inputRef}
          type='text'
          value={ciudad?.ciudad || ''}
          onChange={handleChange}
          placeholder='Ciudad'
          className='flex-1 focus:outline-none'
        />
        <button
          onClick={handleBorrar}
          className={`text-4xl mr-3 text-inf7 hover:text-gray-800 px-2 ${
            ciudad?.ciudad ? 'visible' : 'invisible'
          }`}
          title='Borrar'
        >
          ✕
        </button>
        <button
          onClick={handlePullUpDown}
          className='py-0 px-0 text-inf4 ml-2 text-4xl'
        >
          {mostrarCiudades ? '▲' : '▼'}
        </button>
      </div>

      {mostrarCiudades && ciudadesFiltradas.length > 0 && (
        <ul className='area-lista bg-white border border-gray-300 mt-1 w-full shadow max-h-60 overflow-y-auto'>
          {ciudadesFiltradas.map((c) => (
            <li
              key={c.id}
              className='px-3 py-2 hover:bg-inf2 cursor-pointer'
              onMouseDown={() => handleSeleccionCiudad(c)}
            >
              {c.ciudad}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
