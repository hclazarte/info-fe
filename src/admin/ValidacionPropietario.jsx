import { useEffect, useState, useRef } from 'react'
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
import {
  obtenerCiudades,
  obtenerZonasDeCiudad
} from '../services/ciudadesService'
import {
  validarDocumentoNIT,
  validarDocumentoCI,
  validarComprobantePago
} from '../services/documentosService'
import { actualizarComercio } from '../services/comerciosService'

export default function ValidacionPropietario() {
  const [spinner, setSpinner] = useState(false)
  const [step, setStep] = useState(1)
  const [solicitud, setSolicitud] = useState(null)
  const [comercio, setComercio] = useState(null)
  const [comercioEditable, setComercioEditable] = useState(null)
  const [ciudades, setCiudades] = useState([])
  const [zonas, setZonas] = useState([])
  const [error, setError] = useState(null)
  const [tipoPlan, setTipoPlan] = useState('gratis')
  const [autorizado, setAutorizado] = useState(comercio?.autorizado === 1)
  const [substep, setSubstep] = useState(1)
  const [nitCargado, setNitCargado] = useState(false)
  const [ciCargado, setCiCargado] = useState(false)
  const [comprobanteCargado, setComprobanteCargado] = useState(false)
  const [archivoNIT, setArchivoNIT] = useState(null)
  const [archivoCI, setArchivoCI] = useState(null)
  const [archivoComprobante, setArchivoComprobante] = useState(null)
  const [pagoValidado, setPagoValidado] = useState(false)
  const [tienePlanActivo, setTienePlanActivo] = useState(false)
  const [errorNegocio, setErrorNegocio] = useState('')
  const otp_tokenRef = useRef('')

  useEffect(() => {
    const esValido =
      solicitud?.fecha_fin_servicio &&
      new Date(solicitud.fecha_fin_servicio) > new Date()

    if (esValido) {
      setTipoPlan('pago')
      setTienePlanActivo(true)
    } else {
      setTienePlanActivo(false)
    }
  }, [solicitud])

  useEffect(() => {
    const url = new URL(window.location.href)
    otp_tokenRef.current = url.searchParams.get('token')

    if (!otp_tokenRef.current) {
      setError('No se encontró un token en la URL')
      return
    }

    const cargaInicial = async () => {
      const {
        ok,
        data,
        error: errorSolicitud
      } = await obtenerSolicitudToken(otp_tokenRef.current)
      if (!ok) {
        setError(errorSolicitud || 'Error al obtener la solicitud')
      } else {
        setSolicitud(data.solicitud)
        setComercio(data.comercio)
        if (data.comercio.documentos_validados === 1) setStep(2)
        const {
          ok: ok_ciudades,
          data: ciudades,
          error: errorCiudades
        } = await obtenerCiudades()
        if (!ok_ciudades) {
          setError(errorCiudades || 'Error al obtener las ciudades')
        } else {
          setCiudades(ciudades)
        }
        var ciudad_id = data.comercio.ciudad_id
        const {
          ok: ok_zonas,
          data: zonas,
          error: errorZonas
        } = await obtenerZonasDeCiudad(ciudad_id)
        if (!ok_zonas) {
          setError(errorZonas || 'Error al obtener las zonas')
        } else {
          setZonas(zonas)
        }
      }
    }
    cargaInicial()
  }, [])

  const handleValidarPago = () => {
    const validar = async (file, solicitudId) => {
      setSpinner(true)
      try {
        const { ok, data, error } = await validarComprobantePago(
          file,
          solicitudId
        )
        if (!ok) {
          setErrorNegocio(error)
        }
        if (!data.validado) {
          setErrorNegocio(data.mensaje)
        } else {
          setPagoValidado(true)
          const { ok, data } = await obtenerSolicitudToken(otp_tokenRef.current)
          if (ok) {
            setSolicitud(data.solicitud)
            setComercio(data.comercio)
          }
        }
      } catch (err) {
        setErrorNegocio(err)
      } finally {
        setSpinner(false)
      }
    }

    validar(archivoComprobante, solicitud.id)
  }

  const handleValidar = () => {
    const Validar = async (file, solicitudId) => {
      const url = new URL(window.location.href)

      setSpinner(true)
      try {
        const {
          ok: ok_nit,
          data: nit_resp,
          error: errorNit
        } = await validarDocumentoNIT(file, solicitudId)
        if (!ok_nit) {
          setErrorNegocio(errorNit)
        }
        if (!nit_resp.validado) {
          setErrorNegocio(nit_resp.mensaje)
        }

        const {
          ok: ok_ci,
          data: ci_resp,
          error: errorCi
        } = await validarDocumentoCI(archivoCI, solicitudId)
        if (!ok_ci) {
          setErrorNegocio(errorCi)
        }
        if (!ci_resp.validado) {
          setErrorNegocio(ci_resp.mensaje)
        }

        const {
          ok: ok_solicitud,
          data,
          error: errorSolicitud
        } = await obtenerSolicitudToken(otp_tokenRef.current)
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

  const handleSiguiente = async () => {
    if (step === 1 && comercio?.documentos_validados === 1) {
      setStep(2)
      setSubstep(1)
    } else if (step === 2 && substep === 1) {
      setSubstep(2)
    } else if (step === 2 && substep === 2) {
      if (tienePlanActivo) {
        // No necesita paso 3, verificar si necesita paso 4
        if (comercio?.autorizado === 1 || autorizado) {
          await grabarComercio()
          setStep(5)
        } else {
          setStep(4)
        }
      } else if (tipoPlan === 'pago') {
        setStep(3)
      } else {
        // tipoPlan === 'gratis'
        if (comercio?.autorizado === 1 || autorizado) {
          await grabarComercio()
          setStep(5)
        } else {
          setStep(4)
        }
      }
    } else if (step === 3) {
      // Ya pagó, ahora verificar si requiere autorización
      if (comercio?.autorizado === 1 || autorizado) {
        await grabarComercio()
        setStep(5)
      } else {
        setStep(4)
      }
    } else if (step === 4) {
      // Autoriza manualmente
      await grabarComercio()
      setStep(5)
    } else if (step === 5) {
      window.location.href = `${window.location.origin}/`
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
      if (tienePlanActivo) {
        setStep(2)
        setSubstep(2)
      } else if (tipoPlan === 'gratis') {
        setStep(2)
        setSubstep(2)
      } else {
        setStep(3)
      }
    }
  }

  const handleFileUpload = (type, file) => {
    if (type === 'nit') {
      setNitCargado(true)
      setArchivoNIT(file)
    }
    if (type === 'ci') {
      setCiCargado(true)
      setArchivoCI(file)
    }
    if (type === 'comprobante') {
      setComprobanteCargado(true)
      setArchivoComprobante(file)
    }
  }

  const grabarComercio = async () => {
    comercioEditable.autorizado = 1
    setSpinner(true)
    try {
      const { ok, data, error } = await actualizarComercio(
        comercioEditable.id,
        comercioEditable,
        otp_tokenRef.current
      )
      if (ok) {
        console.log('Comercio actualizado')
      } else {
        console.error(error)
      }
    } catch (err) {
      console.error('Error inesperado:', err)
    } finally {
      setSpinner(false)
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
              errorNegocio={errorNegocio}
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
              comercioEditable={comercioEditable}
              setComercioEditable={setComercioEditable}
            />
          )}
          {step === 3 && tipoPlan === 'pago' && (
            <PasoPago
              qrPago={qrPago}
              comprobanteCargado={comprobanteCargado}
              handleFileUpload={handleFileUpload}
              handleAtras={handleAtras}
              handleValidarPago={handleValidarPago}
              handleSiguiente={handleSiguiente}
              pagoValidado={pagoValidado}
              setPagoValidado={setPagoValidado}
              errorNegocio={errorNegocio}
            />
          )}
          {step === 4 && (
            <PasoAutorizacion
              autorizado={autorizado}
              setAutorizado={setAutorizado}
              handleAtras={handleAtras}
              handleSiguiente={handleSiguiente}
            />
          )}
          {step === 5 && <PasoConfirmacion handleSiguiente={handleSiguiente} />}
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
