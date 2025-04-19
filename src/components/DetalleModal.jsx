import React, { useState } from 'react'
import { enviarSolicitud } from '../services/solicitudesService'
import AcceptDialog from './common/AcceptDialog'
import SpinnerCom from '../components/common/SpinnerCom'

export default function DetalleModal({ comercio, onClose }) {
  const [email, setEmail] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [mostrarDialogo, setMostrarDialogo] = useState(false)
  const [spinner, setSpinner] = useState(false)

  if (!comercio) return null

  const {
    empresa,
    zona_nombre,
    calle_numero,
    servicios,
    telefono1,
    telefono2,
    telefono3,
    id
  } = comercio

  const telefonos = [telefono1, telefono2, telefono3].filter(Boolean)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setEnviando(true)
    setSpinner(true)
    try {
      grecaptcha.enterprise.ready(async () => {
        const token = await grecaptcha.enterprise.execute(
          '6Ldln-oqAAAAACslpXN9rUqQr2Bn7qXybNqY0o-i',
          { action: 'enviar_solicitud' }
        )

        try {
          await enviarSolicitud({
            email,
            id_comercio: id,
            recaptcha_token: token
          })
          setMensaje(
            'Se ha enviado un mensaje a su correo. Si es la primera vez que solicita, revise su bandeja de correo no deseado y apruébelo. ¡Muchas gracias!'
          )
        } catch (error) {
          console.error('Error al enviar solicitud:', error)
          setMensaje(
            'Hubo un error al enviar la solicitud. Intente nuevamente.'
          )
        } finally {
          setMostrarDialogo(true)
          setEnviando(false)
        }
      })
    } catch (error) {
      console.error('Error al ejecutar reCAPTCHA:', error)
      setMensaje('No se pudo validar el reCAPTCHA. Intente nuevamente.')
      setMostrarDialogo(true)
      setEnviando(false)
    } finally {
      setSpinner(false)
    }
  }

  return (
    <>
      {spinner && <SpinnerCom />}
      <div className='fixed inset-0 bg-black bg-opacity-50 z-20 flex items-center justify-center'>
        <div
          className='bg-white rounded-xl shadow-lg w-11/12 max-w-md p-6 relative'
          style={{ maxHeight: '90vh', overflowY: 'auto' }}
        >
          {/* Cerrar */}
          <button
            className='absolute top-2 right-3 text-3xl text-gray-500 hover:text-gray-800'
            onClick={onClose}
          >
            ✕
          </button>

          {/* Título */}
          <h2 className='pt-4 text-2xl font-bold mb-2 text-inf7'>{empresa}</h2>

          {/* Dirección */}
          <p className='text-gray-700 mb-1'>
            <strong>Zona:</strong> {zona_nombre}
          </p>
          <p className='text-gray-700 mb-4'>
            <strong>Dirección:</strong> {calle_numero}
          </p>

          {/* Servicios */}
          <p className='text-gray-800 mb-4'>
            <strong>Servicios:</strong> {servicios || 'No especificado'}
          </p>

          {/* Teléfonos */}
          {telefonos.length > 0 && (
            <div className='mb-4'>
              <strong className='text-gray-800'>Teléfonos:</strong>
              <ul className='list-disc list-inside text-gray-700'>
                {telefonos.map((tel, idx) => (
                  <li key={idx}>{tel}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Reclamar comercio */}
          <div className='mt-6 border-t pt-4'>
            <h3 className='text-lg font-semibold mb-2'>
              Reclamar este comercio
            </h3>
            <p className='text-sm text-gray-600 mb-2'>
              Si usted es el propietario de este comercio, ingrese su correo
              electrónico para iniciar el proceso de validación:
            </p>
            <form className='flex flex-col gap-2' onSubmit={handleSubmit}>
              <input
                type='email'
                placeholder='tucorreo@ejemplo.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='p-2 border rounded-md w-full text-sm'
              />
              <button
                type='submit'
                disabled={enviando}
                className='bg-inf4 text-white font-medium py-2 px-4 rounded-md hover:bg-inf7 disabled:opacity-50'
              >
                {enviando ? 'Enviando...' : 'Enviar solicitud'}
              </button>
            </form>
          </div>
        </div>
      </div>
      {mostrarDialogo && (
        <AcceptDialog
          mensaje={mensaje}
          onClose={() => setMostrarDialogo(false)}
        />
      )}
    </>
  )
}
