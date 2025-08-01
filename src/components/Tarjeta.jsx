import { FaWhatsapp, FaStar } from 'react-icons/fa'
import { MdMarkEmailRead, MdEmail } from 'react-icons/md'
import { LuMapPinCheckInside, LuMapPin } from 'react-icons/lu'

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

  const tieneMapa = comercio.latitud !== null && comercio.longitud !== null
  const tieneWhatsApp = comercio.whatsapp_verificado
  const tieneCorreo = !!comercio.email_verificado

  return (
    <section
      onClick={onClick}
      className={`${tarjetaBase} ${fondo}`}
      data-testclass='tarjeta-control'
    >
      {/* Estrella solo si autorizado */}
      {comercio.autorizado === 1 && (
        <div className='absolute top-2 right-2'>
          <FaStar
            className='text-yellow-400 w-5 h-5'
            title='Comercio destacado'
          />
        </div>
      )}

      <div className='px-6 py-4'>
        {/* Nombre de la Empresa */}
        <div className='font-bold text-xl mb-2' data-testclass='tarjeta-title'>
          {comercio.empresa}
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

        {/* Teléfonos (sin mostrar WhatsApp) */}
        <p className='text-gray-600 text-sm'>
          {comercio.telefono1}
          {comercio.telefono2 ? `, ${comercio.telefono2}` : ''}
        </p>
      </div>

      {/* Íconos de contacto */}
      <div className='flex justify-around items-center py-2 border-t border-gray-200'>
        {tieneCorreo ? (
          <MdMarkEmailRead
            className='text-inf4 w-6 h-6'
            title='Email disponible'
          />
        ) : (
          <MdEmail
            className='text-gray-400 w-6 h-6'
            title='Email no disponible'
          />
        )}

        {tieneMapa ? (
          <LuMapPinCheckInside
            className='text-inf4 w-6 h-6'
            title='Ubicación disponible'
          />
        ) : (
          <LuMapPin
            className='text-gray-400 w-6 h-6'
            title='Ubicación no disponible'
          />
        )}

        {tieneWhatsApp ? (
          <FaWhatsapp
            className='text-green-500 w-6 h-6'
            title='WhatsApp disponible'
          />
        ) : (
          <FaWhatsapp
            className='text-gray-400 w-6 h-6'
            title='WhatsApp no disponible'
          />
        )}
      </div>
    </section>
  )
}

export default Tarjeta
