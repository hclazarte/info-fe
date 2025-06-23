import React, { useState, useRef } from 'react'
import Spinner from './common/SpinnerCom.jsx'
import AcceptDialog from './common/AcceptDialog.jsx'
import { enviarCorreoUsuario } from '../services/correosUsuariosService.js'

const FormularioCorreo = ({ comercioId, nombreComercio, onEnviado }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    remitente: '',
    asunto: '',
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
    if (successRef.current && onClose) {
      onClose()
    }
  }

  const handleEnviarCorreo = async (e) => {
    e.preventDefault()

    if (sendingMsgRef.current) return
    console.log(formData)
    if (
      !formData.nombre ||
      !formData.remitente ||
      !formData.asunto ||
      !formData.cuerpo
    ) {
      dialogMsgRef.current =
        'Por favor, complete todos los campos obligatorios.'
      setShowDialog(true)
      return
    }

    grecaptcha.enterprise.ready(async () => {
      const token = await grecaptcha.enterprise.execute(
        '6LfLImkrAAAAAKzEHAVXOiv1EIx9bn1eAu0Ay4MK',
        { action: 'enviar_sugerencia' }
      )

      const datosCorreo = {
        nombre: formData.nombre,
        remitente: formData.remitente,
        asunto: formData.asunto,
        cuerpo: formData.cuerpo,
        comercio_id: comercioId
      }

      try {
        setShowSpinner(true)
        sendingMsgRef.current = true

        const { ok, data, error } = await enviarCorreoUsuario(
          datosCorreo,
          token
        )

        if (!ok) {
          dialogMsgRef.current = 'Hubo un problema al enviar el mensaje.'
          setShowDialog(true)
        } else {
          successRef.current = true
          dialogMsgRef.current = 'Mensaje enviado con éxito.'
          setShowDialog(true)
          setFormData({
            nombre: '',
            remitente: '',
            asunto: '',
            cuerpo: ''
          })
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
    <form className='mt-4 flex flex-col gap-2' onSubmit={handleEnviarCorreo}>
      <h3 className='text-sm font-semibold text-gray-700 mb-1'>
        Correo para <span className='text-inf7'>{nombreComercio}</span>
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
        type='email'
        name='remitente'
        placeholder='Tu correo electrónico'
        value={formData.remitente}
        onChange={handleChange}
        required
        className='bg-inf3 p-2 border rounded-md text-sm'
      />
      <input
        type='text'
        name='asunto'
        placeholder='Asunto'
        value={formData.asunto}
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

export default FormularioCorreo
