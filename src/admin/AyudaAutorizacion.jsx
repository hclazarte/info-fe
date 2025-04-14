import { useState } from 'react'

export default function AyudaAutorizacion() {
  const [mostrarDetalle, setMostrarDetalle] = useState(false)

  return (
    <div className='text-sm text-inf1 text-center mt-2'>
      <button
        type='button'
        onClick={() => setMostrarDetalle(!mostrarDetalle)}
        className='underline text-yellow-400 hover:text-yellow-200 focus:outline-none'
      >
        {mostrarDetalle
          ? 'Ocultar detalles'
          : '¿Qué significa esta autorización?'}
      </button>

      {mostrarDetalle && (
        <div className='mt-2 bg-inf2 text-black p-4 rounded shadow max-w-2xl mx-auto text-justify'>
          <p>
            Al autorizar, usted permite que Infomóvil publique la información de
            su comercio, incluyendo nombre, ubicación, contacto, servicios y
            página web, para que pueda ser encontrado por clientes a través de
            la plataforma.
          </p>
          <p className='mt-2 text-justify'>
            Esta autorización es necesaria para que su comercio esté visible, ya
            sea en el plan gratuito o de pago.
          </p>
          <p className='mt-2 text-justify'>
            Usted confirma que los datos proporcionados son correctos y acepta
            su difusión pública.
          </p>
          <p className='mt-2 font-medium text-justify'>
            Esta autorización se otorga conforme a la Ley N°164 (Ley General de
            Telecomunicaciones y TIC) y puede ser revocada solicitando la baja
            del comercio en cualquier momento.
          </p>
        </div>
      )}
    </div>
  )
}
