import React, { useState, useRef } from 'react'
import Spinner from './common/SpinnerCom.jsx'
import AcceptDialog from './common/AcceptDialog.jsx'
import { enviarMensajeWhatsapp } from '../services/whatsappUsuariosService.js'

const FormularioWhatsapp = ({ comercioId, nombreComercio, onEnviado }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    celular: '',
    cuerpo: ''
  })
  const [showDialog, setShowDialog] = useState(false)
  const [showSpinner, setShowSpinner] = useState(false)
  const dialogMsgRef = useRef('')
  const sendingMsgRef = useRef(false)
  const successRef = useRef(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleCloseDialog = () => {
    setShowDialog(false)
    if (successRef.current && onEnviado) {
      onEnviado()
    }
  }

  const handleEnviarWhatsapp = async (e) => {
    e.preventDefault()

    if (sendingMsgRef.current) return

    if (!formData.nombre || !formData.celular || !formData.cuerpo) {
      dialogMsgRef.current =
        'Por favor, complete todos los campos obligatorios.'
      setShowDialog(true)
      return
    }

    const celularValido = /^591\d{8}$/.test(formData.celular)
    if (!celularValido) {
      dialogMsgRef.current =
        'Ingrese un número de celular válido (ej: 591XXXXXXXX).'
      setShowDialog(true)
      return
    }

    grecaptcha.enterprise.ready(async () => {
      const token = await grecaptcha.enterprise.execute(
        '6LfLImkrAAAAAKzEHAVXOiv1EIx9bn1eAu0Ay4MK',
        { action: 'enviar_sugerencia' }
      )

      const datosWhatsapp = {
        nombre: formData.nombre,
        celular: formData.celular,
        cuerpo: formData.cuerpo,
        comercio_id: comercioId
      }

      try {
        setShowSpinner(true)
        sendingMsgRef.current = true

        const { ok, data, error } = await enviarMensajeWhatsapp(
          datosWhatsapp,
          token
        )

        if (!ok) {
          dialogMsgRef.current = 'Hubo un problema al enviar el mensaje.'
          setShowDialog(true)
        } else {
          successRef.current = true
          dialogMsgRef.current =
            'Hemos registrado su mensaje.\nPor favor, responda SI cuando reciba la confirmación en su WhatsApp'
          setShowDialog(true)
          setFormData({ nombre: '', celular: '', cuerpo: '' })
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

  return (
    <form className='mt-4 flex flex-col gap-2' onSubmit={handleEnviarWhatsapp}>
      <h3 className='text-sm font-semibold text-gray-700 mb-1'>
        WhatsApp para <span className='text-inf7'>{nombreComercio}</span>
      </h3>
      <input
        type='text'
        name='nombre'
        placeholder='Tu nombre'
        value={formData.nombre}
        onChange={handleChange}
        required
        className='bg-inf3 p-2 border rounded-md text-sm'
      />
      <input
        type='tel'
        name='celular'
        placeholder='Tu número de celular'
        value={formData.celular}
        onChange={handleChange}
        required
        className='bg-inf3 p-2 border rounded-md text-sm'
      />
      <textarea
        name='cuerpo'
        placeholder='Escribe tu mensaje'
        value={formData.cuerpo}
        onChange={handleChange}
        required
        className='bg-inf3 p-2 border rounded-md text-sm'
      />
      <p className='text-center mb-4 text-sm text-inf_adv'>
        Esta aplicación utiliza WhatsApp para enviar sus mensajes, para que
        podamos transmitirlo, debe autorizar el envío desde su WhatsApp. Responda Si cuando le llegue la solicitud.
      </p>
      <button
        type='submit'
        className='bg-inf4 text-white font-medium py-2 px-4 rounded-md hover:bg-inf7 disabled:opacity-50'
      >
        Enviar mensaje
      </button>
      {showDialog && (
        <AcceptDialog
          mensaje={dialogMsgRef.current}
          onClose={handleCloseDialog}
        />
      )}
      {showSpinner && <Spinner />}
    </form>
  )
}

export default FormularioWhatsapp
