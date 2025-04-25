import { useState } from 'react'

export default function AyudaAdministrarComercio() {
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
          : '¿Qué sucede al presionar "Administrar"?'}
      </button>

      {mostrarDetalle && (
        <div className='mt-2 bg-inf2 text-black p-4 rounded shadow max-w-2xl mx-auto text-justify'>
          <p>
            Al presionar el botón "Administrar", el sistema enviará un correo
            electrónico a la dirección registrada. En dicho correo recibirá un
            enlace temporal que le permitirá ingresar al sistema de Infomóvil
            para gestionar su comercio.
          </p>
          <p className='mt-2 text-justify'>
            Cada vez que desee modificar los datos de su comercio, deberá
            solicitar un nuevo enlace desde este mismo lugar, ya que cada enlace
            tiene una vigencia limitada por razones de seguridad.
          </p>
          <p className='mt-2 text-justify'>
            De esta manera, usted no necesita recordar ni administrar
            contraseñas, y a la vez mantiene la seguridad de su información
            comercial.
          </p>
          <p className='mt-2 font-medium text-justify'>
            Bienvenido a Infomóvil, la plataforma que conecta su empresa con
            miles de potenciales clientes.
          </p>
        </div>
      )}
    </div>
  )
}
