import { useState, useEffect } from 'react'
import Spinner from './common/SpinnerCom.jsx'
import AcceptDialog from './common/AcceptDialog.jsx'
import {
  obtenerComercioPorEmail,
  registrarComercioNoSeprec
} from '../services/comerciosService.js'
import { obtenerCiudades } from '../services/ciudadesService.js'
import { enviarSolicitud } from '../services/solicitudesService.js'
import AyudaRegistroCorreo from './AyudaRegistroCorreo.jsx'
import AyudaAdministrarComercio from './AyudaAdministrarComercio.jsx'

export default function FormularioSolicitudComercio({ onClose }) {
  const [emailBusqueda, setEmailBusqueda] = useState('')
  const [formData, setFormData] = useState({
    empresa: '',
    calle_numero: '',
    ciudad_id: '',
    nit: ''
  })
  const [comerciosEncontrados, setComerciosEncontrados] = useState([])
  const [cargando, setCargando] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [dialogMsg, setDialogMsg] = useState('')
  const [success, setSuccess] = useState(false)
  const [crearNuevo, setCrearNuevo] = useState(false)
  const [ciudades, setCiudades] = useState([])
  const [formBloqueado, setFormBloqueado] = useState(false)
  const [habilitarAdmin, setHabilitarAdmin] = useState(false)

  useEffect(() => {
    const cargarCiudades = async () => {
      const { ok, data } = await obtenerCiudades()
      if (ok && Array.isArray(data)) {
        setCiudades(data)
      }
    }
    cargarCiudades()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target

    // Validar NIT: solo números
    if (name === 'nit' && value && !/^\d*$/.test(value)) return

    // Convertir a mayúsculas solo en 'empresa'
    const newValue = name === 'empresa' ? value.toUpperCase() : value

    setFormData({ ...formData, [name]: newValue })
  }

  const handleBuscar = async () => {
    if (!emailBusqueda) {
      setDialogMsg('Debe ingresar un correo.')
      setShowDialog(true)
      return
    }

    try {
      setCargando(true)
      const { ok, data, error } = await obtenerComercioPorEmail(emailBusqueda)
      if (!ok || !data) {
        setComerciosEncontrados([])
        setDialogMsg(error || 'No se encontraron comercios.')
        setShowDialog(true)
      } else {
        setComerciosEncontrados(data)
      }
      setHabilitarAdmin(true)
    } catch (err) {
      setDialogMsg('Error al buscar. Intente más tarde.')
      setShowDialog(true)
    } finally {
      setCargando(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const token = await grecaptcha.enterprise.execute(
      '6LfLImkrAAAAAKzEHAVXOiv1EIx9bn1eAu0Ay4MK',
      { action: 'enviar_solicitud' }
    )

    try {
      setCargando(true)

      if (formBloqueado) {
        // Comercio existente → enviar solicitud
        const { ok, error } = await enviarSolicitud({
          email: emailBusqueda,
          comercio_id: formData.id, // id debe estar en el formData también
          token
        })

        if (!ok) {
          setDialogMsg(error || 'Error al enviar solicitud.')
          setShowDialog(true)
          return
        }
      } else {
        // Comercio nuevo → registrar
        const { empresa, calle_numero, ciudad_id } = formData
        if (!empresa || !emailBusqueda || !calle_numero || !ciudad_id) {
          setDialogMsg('Por favor, complete todos los campos obligatorios.')
          setShowDialog(true)
          return
        }

        const { ok, error } = await registrarComercioNoSeprec(
          { ...formData, email: emailBusqueda },
          token
        )

        if (!ok) {
          setDialogMsg(error || 'Error al registrar comercio.')
          setShowDialog(true)
          return
        }
      }

      // Éxito: mostrar diálogo
      setDialogMsg(
        'Se ha enviado un mensaje a su correo.\n\nSi es la primera vez que solicita, revise su bandeja de correo no deseado y apruébelo.\n\n¡Muchas gracias!'
      )
      setSuccess(true)
      setShowDialog(true)
    } catch (err) {
      setDialogMsg('Error de conexión.')
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
          Registro de Comercios
        </h2>
        {/* Buscar por email */}
        <div className='mb-6 space-y-2'>
          <label className='block'>Correo electrónico del administrador:</label>
          <div className='flex gap-2'>
            <input
              type='email'
              value={emailBusqueda}
              onChange={(e) => setEmailBusqueda(e.target.value)}
              placeholder='correo@ejemplo.com'
              className='w-full p-2 rounded-md text-black bg-inf2 text-lg focus:bg-white'
            />
            <button
              onClick={handleBuscar}
              disabled={cargando}
              className='px-4 py-2 bg-inf3 text-black rounded-md font-medium hover:bg-blue-600'
            >
              {cargando ? '...' : 'Buscar'}
            </button>
          </div>
          <AyudaRegistroCorreo />
        </div>
        <div className='mb-6'>
          <p className='font-semibold mb-2 text-white'>
            Comercios Administrados:
          </p>
          <div
            className='bg-inf1 rounded-md overflow-y-auto'
            style={{ height: '192px', padding: '12px' }}
          >
            <div className='flex flex-col h-full'>
              {comerciosEncontrados.length > 0 ? (
                comerciosEncontrados.map((com, idx) => (
                  <div
                    key={com.id}
                    className='bg-inf2 text-black rounded-md shadow-sm px-3 py-2 flex justify-between items-center mb-2 last:mb-0'
                  >
                    <p
                      className='font-semibold cursor-pointer hover:underline hover:text-inf5 transition-colors'
                      onClick={() => {
                        setFormData({
                          id: com.id,
                          empresa: com.empresa || '',
                          calle_numero: com.calle_numero || '',
                          ciudad_id: com.ciudad_id || '',
                          nit: com.nit || ''
                        })
                        setFormBloqueado(true)
                        setCrearNuevo(false)
                      }}
                    >
                      {com.empresa}
                    </p>
                    <button
                      className='bg-inf3 text-black px-3 py-1 rounded text-sm font-medium hover:bg-inf5 focus:outline-none'
                      onClick={() => {
                        setFormData({
                          id: com.id,
                          empresa: com.empresa || '',
                          calle_numero: com.calle_numero || '',
                          ciudad_id: com.ciudad_id || '',
                          nit: com.nit || ''
                        })
                        setFormBloqueado(true)
                        setCrearNuevo(false)
                      }}
                    >
                      Seleccionar
                    </button>
                  </div>
                ))
              ) : (
                <div className='flex-1 flex items-center justify-center text-inf6 text-sm italic'>
                  No hay comercios que administrar, cree uno nuevo.
                </div>
              )}
            </div>
          </div>
          {/* Checkbox para crear nuevo comercio */}
          <div className='mt-6 flex justify-center'>
            <label className='inline-flex items-center'>
              <input
                type='checkbox'
                checked={crearNuevo}
                className='form-checkbox w-5 h-5 mr-3 accent-inf3'
                onChange={(e) => {
                  const checked = e.target.checked
                  setCrearNuevo(checked)
                  setHabilitarAdmin(checked)
                  if (checked) {
                    setFormData({
                      empresa: '',
                      calle_numero: '',
                      ciudad_id: '',
                      nit: ''
                    })
                    setFormBloqueado(false)
                  }
                }}
              />
              <span className='text-base font-medium'>
                Crear nuevo comercio
              </span>
            </label>
          </div>
        </div>
        {/* Formulario completo */}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block mb-1'>Nombre de Empresa/Comercio:</label>
            <input
              type='text'
              name='empresa'
              value={formData.empresa}
              onChange={handleChange}
              className='w-full p-2 rounded-md text-black bg-inf2 text-lg focus:bg-white'
              disabled={formBloqueado}
              required
            />
          </div>
          <div>
            <label className='block mb-1'>Calle y Número:</label>
            <input
              type='text'
              name='calle_numero'
              value={formData.calle_numero}
              onChange={handleChange}
              className='w-full p-2 rounded-md text-black bg-inf2 text-lg focus:bg-white'
              disabled={formBloqueado}
              required
            />
          </div>
          <select
            name='ciudad_id'
            value={formData.ciudad_id}
            onChange={handleChange}
            className='w-full p-2 rounded-md text-black bg-inf2 text-lg focus:bg-white'
            disabled={formBloqueado}
            required
          >
            <option value=''>Seleccione una ciudad</option>
            {ciudades.map((ciudad) => (
              <option key={ciudad.id} value={ciudad.id}>
                {ciudad.ciudad}
              </option>
            ))}
          </select>
          <div>
            <label className='block mb-1'>NIT (opcional):</label>
            <input
              type='text'
              name='nit'
              value={formData.nit}
              onChange={handleChange}
              className='w-full p-2 rounded-md text-black bg-inf2 text-lg focus:bg-white'
              disabled={formBloqueado}
            />
          </div>

          <AyudaAdministrarComercio />
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
              disabled={!habilitarAdmin}
              className={`px-6 py-2 bg-inf3 text-black rounded-md text-lg font-medium ${
                habilitarAdmin
                  ? 'hover:bg-inf5'
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              Administrar
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
          </a>{' '}
          de Google.
        </p>
      </div>
    </div>
  )
}
