import { useState } from 'react'

export default function AyudaComprobante() {
  const [mostrar, setMostrar] = useState(false)

  return (
    <div className='mt-2 text-sm text-inf1'>
      <button
        type='button'
        onClick={() => setMostrar(!mostrar)}
        className='underline text-yellow-400 hover:text-yellow-200 focus:outline-none'
      >
        {mostrar ? 'Ocultar ayuda' : '¿Qué tipo de comprobante se puede subir?'}
      </button>
      {mostrar && (
        <div className='mt-2 bg-inf2 text-black p-3 rounded shadow text-justify'>
          <p>
            Puede subir una captura de pantalla del pago realizado, incluyendo
            el comprobante generado por su banco o el comprobante QR.
          </p>
          <p className='mt-1 text-justify'>
            Asegúrese de que se vea claramente el{' '}
            <strong>número de cuenta de destino</strong>, el{' '}
            <strong>banco</strong> y la <strong>fecha del pago</strong>.
          </p>
          <p className='mt-1 font-medium text-justify'>
            Formatos aceptados: imagen (JPG, PNG) o PDF. Tamaño máximo: 20 MB.
          </p>
        </div>
      )}
    </div>
  )
}
