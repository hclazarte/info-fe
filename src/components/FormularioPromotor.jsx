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
  const [acepta, setAcepta] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [dialogMsg, setDialogMsg] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'telefono' && value && !/^\d*$/.test(value)) return
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.nombre || !formData.email || !formData.telefono) {
      setDialogMsg('Por favor, complete los tres campos requeridos.')
      setShowDialog(true)
      return
    }
    if (!acepta) {
      setDialogMsg('Debe aceptar los términos para continuar.')
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
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono
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

      setDialogMsg('Promotor registrado con éxito.')
      setSuccess(true)
      setShowDialog(true)
      setFormData({ nombre: '', email: '', telefono: '' })
      setAcepta(false)
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
        <h2 className='text-2xl font-bold mb-6 text-center'>
          Registro de Promotores
        </h2>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block mb-1'>Nombre completo:</label>
            <input
              type='text'
              name='nombre'
              value={formData.nombre}
              onChange={handleChange}
              placeholder='Ej. Carlos Pérez'
              className='w-full p-2 rounded-md text-black bg-inf2 text-lg focus:bg-white'
              required
            />
          </div>

          <div>
            <label className='block mb-1'>Correo electrónico:</label>
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              placeholder='correo@ejemplo.com'
              className='w-full p-2 rounded-md text-black bg-inf2 text-lg focus:bg-white'
              required
            />
          </div>

          <div>
            <label className='block mb-1'>Teléfono:</label>
            <input
              type='tel'
              name='telefono'
              value={formData.telefono}
              onChange={handleChange}
              placeholder='Solo números'
              className='w-full p-2 rounded-md text-black bg-inf2 text-lg focus:bg-white'
              pattern='[0-9]{6,15}'
              title='Ingrese solo números (6 a 15 dígitos)'
              required
            />
          </div>

          <p className='text-sm text-inf1/90'>
            Este programa es independiente; no hay relación laboral ni horarios
            fijos. Los pagos de clientes se realizan únicamente mediante el QR
            oficial de Infomóvil. No se cobra dinero en efectivo.
          </p>

          <label className='inline-flex items-start gap-3 text-base'>
            <input
              type='checkbox'
              checked={acepta}
              onChange={(e) => setAcepta(e.target.checked)}
              className='w-5 h-5 mt-1 accent-inf3'
              required
            />
            <span>
              Declaro aceptar los términos del programa de promotores de
              Infomóvil, actuando de forma independiente y sin relación laboral.
            </span>
          </label>

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
              disabled={!acepta || cargando}
              className={`px-6 py-2 bg-inf3 text-black rounded-md text-lg font-medium ${
                acepta && !cargando
                  ? 'hover:bg-inf5'
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              {cargando ? '...' : 'Registrar'}
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
