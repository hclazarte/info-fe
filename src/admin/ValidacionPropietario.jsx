import { useEffect, useState } from 'react'
import '../css/output.css'
import backgroundImage from '../img/background-image.jpg'
import qrPago from '../img/QR.jpeg'
import PasoValidacionIdentidad from './PasoValidacionIdentidad'
import PasoInformacionComercio from './PasoInformacionComercio'
import PasoAutorizacion from './PasoAutorizacion'
import PasoPago from './PasoPago'
import PasoConfirmacion from './PasoConfirmacion'
import SpinnerCom from '../components/common/SpinnerCom'
import { obtenerSolicitudToken } from '../services/solicitudesService'
import { obtenerCiudades, obtenerZonasDeCiudad } from '../services/ciudadesService'
import { validarDocumentoNIT, validarDocumentoCI, validarComprobantePago } from '../services/documentosService'

export default function ValidacionPropietario() {
  const [spinner, setSpinner] = useState(false)
  const [step, setStep] = useState(1)
  const [solicitud, setSolicitud] = useState(null)
  const [comercio, setComercio] = useState(null)
  const [ciudades, setCiudades] = useState([])
  const [zonas, setZonas] = useState([])
  const [error, setError] = useState(null)
  const [tipoPlan, setTipoPlan] = useState('gratis')
  const [autorizado, setAutorizado] = useState(false)
  const [substep, setSubstep] = useState(1)
  const [nitCargado, setNitCargado] = useState(false)
  const [ciCargado, setCiCargado] = useState(false)
  const [comprobanteCargado, setComprobanteCargado] = useState(false)
  const [archivoNIT, setArchivoNIT] = useState(null)
  const [archivoCI, setArchivoCI] = useState(null)

  useEffect(() => {
    const url = new URL(window.location.href)
    const otp_token = url.searchParams.get('token')
  
    if (!otp_token) {
      setError('No se encontró un token en la URL')
      return
    }
  
    const cargaInicial = async () => {
      const { ok, data, error: errorSolicitud } = await obtenerSolicitudToken(otp_token)
      if (!ok) {
        setError(errorSolicitud || 'Error al obtener la solicitud')
      } else {
        setSolicitud(data.solicitud)
        setComercio(data.comercio)
        const { ok: ok_ciudades, data: ciudades, error: errorCiudades } = await obtenerCiudades()
        if (!ok_ciudades) {
          setError(errorCiudades || 'Error al obtener las ciudades')
        } else {
          setCiudades(ciudades)
        }
        var ciudad_id = data.comercio.ciudad_id
        const { ok: ok_zonas, data: zonas, error: errorZonas } = await obtenerZonasDeCiudad(ciudad_id)
        if (!ok_zonas) {
          setError(errorZonas || 'Error al obtener las zonas')
        } else {
          setZonas(zonas)
        }
      }
    }
    cargaInicial()
  }, [])  

  const handleValidar = () => {
    const Validar = async (file, solicitudId) => {
      const url = new URL(window.location.href)
      const otp_token = url.searchParams.get('token')
  
      if (!otp_token) {
        setError('No se encontró un token en la URL')
        return
      }
  
      setSpinner(true)
      try {
        const { ok: ok_nit, nit_resp, errorNit } = await validarDocumentoNIT(file, solicitudId)
        if (!ok_nit) {
          throw new Error(errorNit || 'Error al validar el NIT')
        }
  
        const { ok: ok_ci, ci_resp, errorCi } = await validarDocumentoCI(archivoCI, solicitudId)
        if (!ok_ci) {
          throw new Error(errorCi || 'Error al validar el CI')
        }
  
        const { ok: ok_solicitud, data, error: errorSolicitud } = await obtenerSolicitudToken(otp_token)
        if (!ok_solicitud) {
          throw new Error(errorSolicitud || 'Error al recuperar la solicitud')
        }
  
        setSolicitud(data.solicitud)
        setComercio(data.comercio)
      } catch (err) {
        setError(err.message)
      } finally {
        setSpinner(false)
      }
    }
  
    Validar(archivoNIT, solicitud.id)
  }  

  const handleSiguiente = () => {
    if (step === 1 && (comercio?.documentos_validados === 1)) {
      setStep(2)
      setSubstep(1)
    } else if (step === 2 && substep === 1) {
      setSubstep(2)
    } else if (step === 2 && substep === 2) {
      setStep(3) // va a autorización
    } else if (step === 3) {
      setStep(tipoPlan === 'pago' ? 4 : 5)
    } else if (step === 4) {
      setStep(5)
    }
  }

  const handleAtras = () => {
    if (step === 2 && substep === 2) {
      setSubstep(1)
    } else if (step === 2 && substep === 1) {
      setStep(1)
    } else if (step === 3) {
      setStep(2)
      setSubstep(2)
    } else if (step === 4) {
      setStep(3)
    } else if (step === 5) {
      setStep(tipoPlan === 'pago' ? 4 : 3)
    }
  }

  const handleFileUpload = (type,file) => {
    if (type === 'nit') {
      setNitCargado(true)
      setArchivoNIT(file)
    }
    if (type === 'ci') {
      setCiCargado(true)
      setArchivoCI(file)
    }
  }

  if (error) {
    return (
      <div className='p-6 bg-red-100 text-red-700 rounded-xl max-w-xl mx-auto mt-10'>
        <h2 className='text-xl font-bold mb-4'>Error en la solicitud</h2>
        <p>{error}</p>
      </div>
    )
  }

  if (!solicitud || !comercio) {
    return <div className='text-center p-10'>Cargando...</div>
  }

  return (
    <div
      className='min-h-screen'
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundRepeat: 'repeat'
      }}
    >
      {spinner && <SpinnerCom />}
      <div className='fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center'>
        <div className='bg-inf4 text-white rounded-xl shadow-lg p-6 w-full max-w-md max-h-[95vh] overflow-y-auto'>
          {step === 1 && (
            <PasoValidacionIdentidad
              comercio={comercio}
              nitCargado={nitCargado}
              ciCargado={ciCargado}
              handleFileUpload={handleFileUpload}
              handleValidar={handleValidar}
              handleSiguiente={handleSiguiente}
            />
          )}
          {step === 2 && (
            <PasoInformacionComercio
              substep={substep}
              tipoPlan={tipoPlan}
              setTipoPlan={setTipoPlan}
              comercio={comercio}
              solicitud={solicitud}
              ciudades={ciudades}
              zonas={zonas}
              handleAtras={handleAtras}
              handleSiguiente={handleSiguiente}
            />
          )}
          {step === 3 && (
            <PasoAutorizacion
              autorizado={autorizado}
              setAutorizado={setAutorizado}
              handleAtras={handleAtras}
              handleSiguiente={handleSiguiente}
            />
          )}
          {step === 4 && tipoPlan === 'pago' && (
            <PasoPago
              qrPago={qrPago}
              comprobanteCargado={comprobanteCargado}
              setComprobanteCargado={setComprobanteCargado}
              handleAtras={handleAtras}
              handleSiguiente={handleSiguiente}
            />
          )}
          {step === 5 && <PasoConfirmacion />}
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
        </div>
      </div>
    </div>
  )
}
