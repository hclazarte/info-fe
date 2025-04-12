import { useState } from 'react'

function AyudaCI() {
  const [mostrarAyuda, setMostrarAyuda] = useState(false)

  return (
    <div className='mt-2 text-sm text-inf1'>
      <button
        type='button'
        onClick={() => setMostrarAyuda(!mostrarAyuda)}
        className='underline text-yellow-400 hover:text-yellow-200 focus:outline-none'
      >
        {mostrarAyuda
          ? 'Ocultar ayuda'
          : '¿Dónde obtener una copia digital del CI?'}
      </button>
      {mostrarAyuda && (
        <div className='mt-2 bg-inf2 text-black p-3 rounded shadow'>
          <p>
            Puede escanear o tomar una fotografía clara de su{' '}
            <strong>cédula de identidad</strong>, incluyendo{' '}
            <strong>anverso y reverso en una sola imagen o archivo PDF</strong>.
          </p>
          <p className='mt-1'>
            También puede usar la versión digital que proporciona el{' '}
            <strong>SEGIP</strong>, si cuenta con una imagen oficial descargada
            desde su portal o enviada por medios electrónicos.
          </p>
          <p className='mt-1 font-medium'>
            El archivo debe estar en formato PDF o imagen y no debe superar los
            20 MB.
          </p>
        </div>
      )}
    </div>
  )
}

export default AyudaCI
