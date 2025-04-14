/* global grecaptcha */
import { useEffect, useState, useRef } from 'react'
import '../css/output.css'
import Spinner from './common/SpinnerCom.jsx'
import AcceptDialog from './common/AcceptDialog.jsx'
import { enviarCorreo } from '../services/correosService.js'

export default function BuzonSugerencias({ onClose }) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    categoria: 'Consulta',
    asunto: '',
    mensaje: ''
  })
  const [showDialog, setShowDialog] = useState(false)
  const [showSpinner, setShowSpinner] = useState(false)
  const dialogMsgRef = useRef('')
  const sendingMsgRef = useRef(false) // Para bloquear cuando está enviando msg
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (sendingMsgRef.current) return

    if (
      !formData.nombre ||
      !formData.email ||
      !formData.asunto ||
      !formData.mensaje
    ) {
      dialogMsgRef.current =
        'Por favor, complete todos los campos obligatorios.'
      setShowDialog(true)
      return
    }

    grecaptcha.enterprise.ready(async () => {
      const token = await grecaptcha.enterprise.execute(
        '6Ldln-oqAAAAACslpXN9rUqQr2Bn7qXybNqY0o-i',
        { action: 'enviar_sugerencia' }
      )

      const datosCorreo = {
        remitente: formData.email,
        asunto: 'Consulta de usuario',
        tipo: formData.categoria.toLowerCase(),
        nombre: formData.nombre,
        cuerpo: formData.mensaje
      }

      try {
        setShowSpinner(true)
        sendingMsgRef.current = true

        const { ok, data, error } = await enviarCorreo(datosCorreo, token)

        if (!ok) {
          dialogMsgRef.current = 'Hubo un problema al enviar el mensaje.'
          setShowDialog(true)
        } else {
          successRef.current = true
          dialogMsgRef.current = 'Mensaje enviado con éxito.'
          setShowDialog(true)
          setFormData({
            nombre: '',
            email: '',
            categoria: 'Consulta',
            asunto: '',
            mensaje: ''
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
    <div className='fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center'>
      <div className='bg-inf4 text-white rounded-xl shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto'>
        <h2 className='text-2xl font-bold mb-6 text-center'>
          Buzón de Sugerencias
        </h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block mb-1'>Nombre:</label>
            <input
              type='text'
              name='nombre'
              value={formData.nombre}
              onChange={handleChange}
              placeholder='Juan Pérez'
              className='w-full p-2 rounded-md text-black bg-inf2 text-lg focus:bg-white'
              required
            />
          </div>
          <div>
            <label className='block mb-1'>Correo Electrónico:</label>
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              placeholder='juan.perez@gmail.com'
              className='w-full p-2 rounded-md text-black bg-inf2 text-lg focus:bg-white'
              required
            />
          </div>
          <div>
            <label className='block mb-1'>Categoría:</label>
            <select
              name='categoria'
              value={formData.categoria}
              onChange={handleChange}
              className='w-full p-2 rounded-md text-black bg-inf2 text-lg focus:bg-white'
            >
              <option value='Consulta'>Consulta</option>
              <option value='Sugerencia'>Sugerencia</option>
              <option value='Otro'>Otro</option>
            </select>
          </div>
          <div>
            <label className='block mb-1'>Asunto:</label>
            <input
              type='text'
              name='asunto'
              value={formData.asunto}
              onChange={handleChange}
              placeholder='Breve descripción del mensaje'
              className='w-full p-2 rounded-md text-black bg-inf2 text-lg focus:bg-white'
              required
            />
          </div>
          <div>
            <label className='block mb-1'>Mensaje:</label>
            <textarea
              name='mensaje'
              value={formData.mensaje}
              onChange={handleChange}
              rows='4'
              className='w-full p-2 rounded-md text-black bg-inf2 text-lg focus:bg-white'
              required
            ></textarea>
          </div>
          <div className='flex justify-end gap-4 mt-6'>
            <button
              type='button'
              onClick={onClose}
              className='px-6 py-2 bg-inf3 text-black rounded-md text-lg font-medium hover:bg-blue-600'
            >
              Cancelar
            </button>
            <button
              type='submit'
              className='px-6 py-2 bg-inf3 text-black rounded-md text-lg font-medium hover:bg-blue-600'
            >
              Enviar
            </button>
          </div>
        </form>
        <p className='mt-4 text-sm text-center text-gray-200'>
          Este sitio está protegido por reCAPTCHA y se aplican la
          <a
            href='https://policies.google.com/privacy'
            className='text-blue-300 hover:underline'
          >
            {' '}
            Política de Privacidad{' '}
          </a>
          y los{' '}
          <a
            href='https://policies.google.com/terms'
            className='text-blue-300 hover:underline'
          >
            {' '}
            Términos de Servicio{' '}
          </a>{' '}
          de Google.
        </p>
        {showDialog && (
          <AcceptDialog
            mensaje={dialogMsgRef.current}
            onClose={handleCloseDialog}
          />
        )}
        {showSpinner && <Spinner />}
      </div>
    </div>
  )
}
