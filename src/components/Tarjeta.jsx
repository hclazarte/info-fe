import React from 'react'
import { FaWhatsapp, FaCheckCircle } from 'react-icons/fa'
import { MdMarkEmailRead } from 'react-icons/md'

const truncarTexto = (texto, longitudMaxima = 80) => {
  if (!texto) return ''
  if (texto.length <= longitudMaxima) return texto
  return texto.slice(0, longitudMaxima) + '...'
}

const Tarjeta = ({ comercio, onClick }) => {
  const tarjetaBase =
    'max-w-sm rounded overflow-hidden shadow-lg cursor-pointer relative transition-shadow hover:shadow-xl'
  const fondo = comercio.autorizado
    ? 'bg-yellow-50 border border-yellow-300'
    : 'bg-white'

  return (
    <section
      onClick={onClick}
      className={`${tarjetaBase} ${fondo}`}
      data-testclass='tarjeta-control'
    >
      <div className='px-6 py-4'>
        {/* Nombre de la Empresa */}
        <div
          className='font-bold text-xl mb-2 flex items-center gap-2'
          data-testclass='tarjeta-title'
        >
          {comercio.empresa}
          {comercio.autorizado === 1 && (
            <FaCheckCircle
              className='text-blue-600 w-5 h-5'
              title='Comercio validado'
            />
          )}
          {comercio.telefono_whatsapp && (
            <FaWhatsapp
              className='text-green-500 w-5 h-5'
              title='Contacto por WhatsApp'
            />
          )}
          {comercio.email_verificado && (
            <MdMarkEmailRead
              className='text-inf4 w-5 h-5'
              title='Contacto por Email'
            />
          )}
        </div>
        {/* Descripción de Servicios */}
        <p
          className='text-gray-700 text-base'
          data-testclass='tarjeta-servicios'
        >
          {truncarTexto(comercio.servicios)}
        </p>

        {/* Dirección */}
        <p className='text-gray-600 text-sm mt-2'>
          {comercio.calle_numero}, {comercio.zona_nombre}
        </p>

        {/* Teléfonos */}
        <p className='text-gray-600 text-sm'>
          {comercio.telefono1}
          {comercio.telefono2 ? `, ${comercio.telefono2}` : ''}
          {comercio.telefono_whatsapp ? `, ${comercio.telefono_whatsapp}` : ''}
        </p>
      </div>
    </section>
  )
}

export default Tarjeta
