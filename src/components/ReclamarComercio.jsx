import React, { useState, useRef } from 'react'
import { enviarSolicitud } from '../services/solicitudesService'
import Spinner from './common/SpinnerCom.jsx'
import AcceptDialog from './common/AcceptDialog.jsx'

const ReclamarComercio = ({ comercioId }) => {
  const [email, setEmail] = useState('')
  const [showDialog, setShowDialog] = useState(false)
  const [showSpinner, setShowSpinner] = useState(false)
  const dialogMsgRef = useRef('')
  const sendingMsgRef = useRef(false)
  const successRef = useRef(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (sendingMsgRef.current) return

    if (!email) {
      dialogMsgRef.current = 'Por favor, ingrese su email.'
      setShowDialog(true)
      return
    }

    grecaptcha.enterprise.ready(async () => {
      const token = await grecaptcha.enterprise.execute(
        '6LfLImkrAAAAAKzEHAVXOiv1EIx9bn1eAu0Ay4MK',
        { action: 'enviar_sugerencia' }
      )

      try {
        setShowSpinner(true)
        sendingMsgRef.current = true

        const { ok, data, error } = await enviarSolicitud({
          email,
          comercio_id: comercioId,
          recaptcha_token: token
        })
        if (!ok) {
          dialogMsgRef.current = 'Hubo un problema al enviar el mensaje.'
          setShowDialog(true)
        } else {
          successRef.current = true
          dialogMsgRef.current =
            'Se ha enviado un mensaje a su correo.\n\nSi es la primera vez que solicita, revise su bandeja de correo no deseado y apruébelo.\n\n¡Muchas gracias!'
          setShowDialog(true)
          setEmail('')
        }
      } catch (error) {
        dialogMsgRef.current =
          'Error de conexión. Intente nuevamente más tarde.'
        setShowDialog(true)
      } finally {
        setShowSpinner(false)
        sendingMsgRef.current = false
      }
    })
  }

  const handleCloseDialog = () => {
    setShowDialog(false)
  }

  return (
    <div className='mt-6 border-t pt-4'>
      <h3 className='text-lg font-semibold mb-2'>Reclamar este comercio</h3>
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
          disabled={sendingMsgRef.current}
          className='bg-inf4 text-white font-medium py-2 px-4 rounded-md hover:bg-inf7 disabled:opacity-50'
        >
          {sendingMsgRef.current ? 'Enviando...' : 'Enviar solicitud'}
        </button>
      </form>
      {showDialog && (
        <AcceptDialog
          mensaje={dialogMsgRef.current}
          onClose={handleCloseDialog}
        />
      )}
      {showSpinner && <Spinner />}
    </div>
  )
}

export default ReclamarComercio
