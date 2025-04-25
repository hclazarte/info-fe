import { useState } from 'react'

export default function AyudaRegistroCorreo() {
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
          : '¿Por qué se solicita un correo electrónico?'}
      </button>

      {mostrarDetalle && (
        <div className='mt-2 bg-inf2 text-black p-4 rounded shadow max-w-2xl mx-auto text-justify'>
          <p>
            El correo electrónico es imprescindible para gestionar la
            inscripción de su comercio en Infomóvil. A través de este medio se
            enviarán los códigos de verificación y las notificaciones
            relacionadas con su solicitud.
          </p>
          <p className='mt-2 text-justify'>
            Es importante que el correo proporcionado sea válido y de uso
            frecuente, ya que será el canal principal para completar el proceso
            de validación de documentos y autorización de publicación.
          </p>
          <p className='mt-2 text-justify'>
            Si el correo ya está asociado a una solicitud previa, el sistema
            intentará recuperar la solicitud existente para evitar registros
            duplicados.
          </p>
          <p className='mt-2 font-medium text-justify'>
            Puede utilizar el mismo correo para administrar varios comercios o
            empresas dentro del sistema. Ingrese su correo y presione "Buscar";
            en la lista podrá ver todos los registros asociados a su correo,
            seleccionar uno o crear uno nuevo.
          </p>
        </div>
      )}
    </div>
  )
}
