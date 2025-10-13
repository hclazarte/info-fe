// src/components/FormularioPromotor.jsx
import { useState } from 'react'
import Spinner from './common/SpinnerCom.jsx'
import AcceptDialog from './common/AcceptDialog.jsx'
import { crearPromotor } from '../services/promotoresService.js'

export default function FormularioPromotor({ onClose }) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: ''
  })
  const [errores, setErrores] = useState({
    nombre: null,
    email: null,
    telefono: null
  })
  const [cargando, setCargando] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [dialogMsg, setDialogMsg] = useState('')
  const [success, setSuccess] = useState(false)

  const validarNombre = (v) => {
    if (!v || v.trim().length < 3) return 'Ingrese su nombre y apellido.'
    return null
  }
  const validarEmail = (v) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!re.test(v || '')) return 'Ingrese un correo válido.'
    return null
  }
  const validarWhatsApp = (v) => {
    // 8 a 15 dígitos, sin 0 inicial; incluir código de país (ej: 59171234567)
    const regex = /^[1-9]\d{7,14}$/
    if (!regex.test((v || '').replace(/\s+/g, '')))
      return 'El número debe tener entre 8 y 15 dígitos incluyendo el código de país. Ej: 59171234567'
    return null
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    // Solo números en teléfono (permitimos espacios que luego se quitarán al validar)
    const next = name === 'telefono' ? value.replace(/[^\d\s]/g, '') : value
    setFormData({ ...formData, [name]: next })
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    let msg = null
    if (name === 'nombre') msg = validarNombre(value)
    if (name === 'email') msg = validarEmail(value)
    if (name === 'telefono') msg = validarWhatsApp(value)
    setErrores((prev) => ({ ...prev, [name]: msg }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const errs = {
      nombre: validarNombre(formData.nombre),
      email: validarEmail(formData.email),
      telefono: validarWhatsApp(formData.telefono)
    }
    setErrores(errs)
    const hayErrores = Object.values(errs).some(Boolean)
    if (hayErrores) {
      setDialogMsg('Por favor, corrija los campos marcados.')
      setShowDialog(true)
      return
    }

    const token = await grecaptcha.enterprise.execute(
      '6LfLImkrAAAAAKzEHAVXOiv1EIx9bn1eAu0Ay4MK',
      { action: 'crear_promotor' }
    )

    try {
      setCargando(true)
      const { ok, error } = await crearPromotor(
        {
          nombre: formData.nombre.trim(),
          email: formData.email.trim(),
          telefono: formData.telefono.replace(/\s+/g, '')
        },
        token
      )
      if (!ok) {
        setDialogMsg(
          error || 'No se pudo registrar el promotor. Intente nuevamente.'
        )
        setShowDialog(true)
        return
      }

      setDialogMsg(
        'Gracias. Te enviaremos un correo con la información y los siguientes pasos para convertirte en promotor.'
      )
      setSuccess(true)
      setShowDialog(true)
      setFormData({ nombre: '', email: '', telefono: '' })
      setErrores({ nombre: null, email: null, telefono: null })
    } catch {
      setDialogMsg('Error de conexión. Intente más tarde.')
      setShowDialog(true)
    } finally {
      setCargando(false)
    }
  }

  const handleCloseDialog = () => {
    setShowDialog(false)
    if (success && onClose) onClose()
  }

  return (
    <div className='fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center'>
      <div className='bg-inf4 text-white rounded-xl shadow-lg p-6 w-full max-w-xl max-h-[95vh] overflow-y-auto'>
        <h2 className='text-2xl font-bold mb-3 text-center'>
          Sea Promotor Infomóvil
        </h2>

        {/* Texto atractivo de captación */}
        <p className='text-center mb-4 text-sm text-inf_adv'>
          Gana buenas comisiones ayudando a digitalizar comercios de tu ciudad.
          Tú decides cuándo y cómo trabajar: nosotros te damos las herramientas
          y tú te llevas la recompensa por cada registro exitoso. Déjanos tus
          datos y te enviaremos un correo con toda la información y los
          siguientes pasos para convertirte en promotor.
        </p>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block mb-1'>Nombre completo:</label>
            <input
              type='text'
              name='nombre'
              value={formData.nombre}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder='Ej. María Pérez'
              className={`w-full p-2 rounded-md text-black bg-inf2 text-lg focus:bg-white ${errores.nombre ? 'ring-2 ring-red-500' : ''}`}
              required
            />
            {errores.nombre && (
              <p className='mt-1 text-inf_err text-xs'>{errores.nombre}</p>
            )}
          </div>

          <div>
            <label className='block mb-1'>Correo electrónico:</label>
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder='correo@ejemplo.com'
              className={`w-full p-2 rounded-md text-black bg-inf2 text-lg focus:bg-white ${errores.email ? 'ring-2 ring-red-500' : ''}`}
              required
            />
            {errores.email && (
              <p className='mt-1 text-inf_err text-xs'>{errores.email}</p>
            )}
          </div>

          <div>
            <label className='block mb-1'>Teléfono/WhatsApp:</label>
            <input
              type='tel'
              name='telefono'
              value={formData.telefono}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder='Incluya código de país. Ej: 59171234567'
              className={`w-full p-2 rounded-md text-black bg-inf2 text-lg focus:bg-white ${errores.telefono ? 'ring-2 ring-red-500' : ''}`}
              required
            />
            {errores.telefono && (
              <p className='mt-1 text-inf_err text-xs'>{errores.telefono}</p>
            )}
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
              disabled={cargando}
              className={`px-6 py-2 bg-inf3 text-black rounded-md text-lg font-medium ${!cargando ? 'hover:bg-inf5' : 'opacity-50 cursor-not-allowed'}`}
            >
              {cargando ? '...' : 'Enviar'}
            </button>
          </div>
        </form>

        {cargando && <Spinner />}
        {showDialog && (
          <AcceptDialog mensaje={dialogMsg} onClose={handleCloseDialog} />
        )}

        <p className='mt-4 text-sm text-center text-gray-200'>
          Este sitio está protegido por reCAPTCHA y se aplican la
          <a
            href='https://policies.google.com/privacy'
            className='text-blue-300 hover:underline'
            target='_blank'
            rel='noopener noreferrer'
          >
            {' '}
            Política de Privacidad{' '}
          </a>
          y los
          <a
            href='https://policies.google.com/terms'
            className='text-blue-300 hover:underline'
            target='_blank'
            rel='noopener noreferrer'
          >
            {' '}
            Términos de Servicio{' '}
          </a>
          de Google.
        </p>
      </div>
    </div>
  )
}
