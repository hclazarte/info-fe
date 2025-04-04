import { useEffect, useState } from 'react'
import backgroundImage from '../img/background-image.jpg'
import '../css/output.css'
import qrPago from '../img/QR.jpeg'

export default function ValidacionPropietario() {
  const [step, setStep] = useState(1)
  const [solicitud, setSolicitud] = useState(null)
  const [comercio, setComercio] = useState(null)
  const [ciudades, setCiudades] = useState([])
  const [zonas, setZonas] = useState([])
  const [error, setError] = useState(null)
  const [validado, setValidado] = useState(false)
  const [tipoPlan, setTipoPlan] = useState('gratis')
  const [autorizado, setAutorizado] = useState(false)
  const [substep, setSubstep] = useState(1)
  const [nitCargado, setNitCargado] = useState(false)
  const [ciCargado, setCiCargado] = useState(false)
  const [comprobanteCargado, setComprobanteCargado] = useState(false)

  useEffect(() => {
    fetch('/data/data.json')
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
        } else {
          setSolicitud(data.solicitud)
          setComercio(data.comercio)
        }
      })
      .catch(() => setError('Error al cargar los datos'))

    fetch('/data/ciudades.json')
      .then(res => res.json())
      .then(setCiudades)
      .catch(() => console.error('Error cargando ciudades'))

    fetch('/data/zonas.json')
      .then(res => res.json())
      .then(setZonas)
      .catch(() => console.error('Error cargando zonas'))
  }, [])

  const handleValidar = () => {
    setTimeout(() => {
      setValidado(true)
    }, 800)
  }

  const handleSiguiente = () => {
    if (step === 1 && validado) {
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

  const handleFileUpload = (type) => {
    if (type === 'nit') setNitCargado(true)
    if (type === 'ci') setCiCargado(true)
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
      <div className='fixed inset-0 z-50 bg-white bg-opacity-50 flex items-center justify-center'>
        <div className='bg-inf4 text-white rounded-xl shadow-lg p-6 w-full max-w-md max-h-[95vh] overflow-y-auto'>
          {step === 1 && (
            <div className='space-y-4'>
              <h2 className='text-2xl font-bold text-center mb-4'>Validación de Identidad</h2>
              <div>
                <label className='block text-sm'>Empresa:</label>
                <p className='bg-inf2 text-black p-2 rounded'>{comercio.empresa}</p>
              </div>
              <div>
                <label className='block text-sm'>Imagen del NIT:</label>
                <input type='file' accept='image/*' className='w-full bg-inf1 p-2 rounded text-black' onChange={() => handleFileUpload('nit')} />
              </div>
              <div>
                <label className='block text-sm'>Imagen del CI:</label>
                <input type='file' accept='image/*' className='w-full bg-inf1 p-2 rounded text-black' onChange={() => handleFileUpload('ci')} />
              </div>
              <div className='flex justify-between mt-4'>
                <button
                  onClick={handleValidar}
                  disabled={!(nitCargado && ciCargado)}
                  className={`px-6 py-2 rounded-md text-lg font-medium ${nitCargado && ciCargado ? 'bg-inf3 text-black hover:bg-inf5' : 'bg-gray-400 text-white cursor-not-allowed'}`}
                >
                  Validar
                </button>
                <button
                  onClick={handleSiguiente}
                  disabled={!validado}
                  className={`px-6 py-2 rounded-md text-lg font-medium ${validado ? 'bg-inf3 text-black hover:bg-inf5' : 'bg-gray-400 text-white cursor-not-allowed'}`}
                >
                  Siguiente
                </button>
              </div>
              {validado && (
                <p className='text-green-200 font-semibold text-center'>Registro Validado</p>
              )}
            </div>
          )}
          {step === 2 && (
            <div className='space-y-4'>
              <h2 className='text-2xl font-bold text-center mb-4'>Información del Comercio</h2>
              <div>
                <label className='block text-sm font-medium'>Tipo de Plan:</label>
                <div className='flex items-center gap-4 mt-1'>
                  <label className='flex items-center gap-2'>
                    <input
                      type='radio'
                      name='tipoPlan'
                      value='gratis'
                      checked={tipoPlan === 'gratis'}
                      onChange={(e) => setTipoPlan(e.target.value)}
                    />
                    Gratuito
                  </label>
                  <label className='flex items-center gap-2'>
                    <input
                      type='radio'
                      name='tipoPlan'
                      value='pago'
                      checked={tipoPlan === 'pago'}
                      onChange={(e) => setTipoPlan(e.target.value)}
                    />
                    De Pago (Bs. 50/año)
                  </label>
                </div>
                <div className='bg-inf3 text-black rounded p-3 text-sm mt-2'>
                  <p className='font-semibold mb-1'>Con el plan <span className='capitalize'>{tipoPlan}</span> puede modificar:</p>
                  <ul className='list-disc pl-8'>
                    <li>Ciudad de ubicación del comercio</li>
                    <li>Zona o barrio</li>
                    <li>Dirección exacta (calle y número)</li>
                    <li>Teléfonos de contacto</li>
                    <li>Palabras clave para que le encuentren más fácilmente</li>
                    {tipoPlan === 'pago' && (
                      <>
                        <li>WhatsApp de atención al cliente</li>
                        <li>Su página web o red social</li>
                        <li>Descripción de los servicios que ofrece</li>
                        <li>Indexación del comercio en Google y constante monitoreo</li>
                      </>
                    )}
                  </ul>
                  {tipoPlan === 'pago' && (
                    <p className='mt-2 text-sm font-medium text-inf7'>
                      ¡Una inversión de solo Bs. 50 al año que le permite destacar y facilitar que nuevos clientes le encuentren en línea!
                    </p>
                  )}
                </div>
              </div>
              {substep === 1 && (
                <>
                  <div>
                    <label className='block text-sm'>Empresa:</label>
                    <input disabled value={comercio.empresa} className='w-full p-2 rounded bg-inf2 text-black' />
                  </div>
                  <div>
                    <label className='block text-sm'>Correo electrónico:</label>
                    <input disabled value={solicitud.email} className='w-full p-2 rounded bg-inf2 text-black' />
                  </div>
                  <div>
                    <label className='block text-sm'>NIT:</label>
                    <input 
                      disabled value={comercio.nit} 
                      className='w-full p-2 rounded bg-inf2 text-black' 
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/\D/g, '')
                      }}
                      />
                  </div>
                  <div>
                    <label className='block text-sm'>Ciudad:</label>
                    <select defaultValue={comercio.ciudad_id} className='w-full p-2 rounded bg-inf2 text-black'>
                      <option value=''>Seleccione una ciudad</option>
                      {ciudades.map((ciudad) => (
                        <option key={ciudad.id} value={ciudad.id}>{ciudad.ciudad}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className='block text-sm'>Zona:</label>
                    <select defaultValue={comercio.zona_id} className='w-full p-2 rounded bg-inf2 text-black'>
                      <option value=''>Seleccione una zona</option>
                      {zonas.map((zona) => (
                        <option key={zona.id} value={zona.id}>{zona.descripcion}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className='block text-sm'>Nombre de Zona:</label>
                    <input 
                    defaultValue={comercio.zona_nombre} 
                    onInput={(e) => e.target.value = e.target.value.toUpperCase()}
                    className='w-full p-2 rounded bg-inf2 text-black focus:bg-white' />
                  </div>
                  <div>
                    <label className='block text-sm'>Dirección (Calle y número):</label>
                    <input defaultValue={comercio.calle_numero} className='w-full p-2 rounded bg-inf2 text-black focus:bg-white' />
                  </div>
                  <div>
                    <label className='block text-sm'>Planta:</label>
                    <input defaultValue={comercio.planta || ''} className='w-full p-2 rounded bg-inf2 text-black focus:bg-white' />
                  </div>
                  <div>
                    <label className='block text-sm'>Número de local:</label>
                    <input defaultValue={comercio.numero_local || ''} className='w-full p-2 rounded bg-inf2 text-black focus:bg-white' />
                  </div>
                </>
              )}

              {substep === 2 && (
                <>
                  <div>
                    <label className='block text-sm'>Teléfono 1:</label>
                    <input
                      defaultValue={comercio.telefono1}
                      inputMode='numeric'
                      pattern='[0-9]*'
                      className='w-full p-2 rounded bg-inf2 text-black focus:bg-white'
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/\D/g, '') // elimina todo lo que no sea dígito
                      }}
                      disabled={false} />
                  </div>
                  <div>
                    <label className='block text-sm'>Palabras clave:</label>
                    <textarea
                      defaultValue={comercio.palabras_clave || ''}
                      onInput={(e) => e.target.value = e.target.value.toUpperCase()}
                      className='w-full p-2 rounded bg-inf2 text-black focus:bg-white'
                      disabled={false}
                      rows='5'
                    />
                  </div>
                  <div>
                    <label className='block text-sm'>
                      Teléfono 2:'
                      {tipoPlan !== 'pago' && <span title='Disponible solo con el plan de pago' className='ml-1 cursor-help'>ℹ️</span>}
                    </label>
                    <input
                      defaultValue={comercio.telefono2 || ''}
                      inputMode='numeric'
                      pattern='[0-9]*'
                      className='w-full p-2 rounded bg-inf2 text-black focus:bg-white'
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/\D/g, '') // elimina todo lo que no sea dígito
                      }}
                    />
                  </div>
                  <div>
                    <label className='block text-sm'>
                      WhatsApp:
                      {tipoPlan !== 'pago' && <span title='Disponible solo con el plan de pago' className='ml-1 cursor-help'>ℹ️</span>}
                    </label>
                    <input
                      defaultValue={comercio.telefono3 || ''}
                      inputMode='numeric'
                      pattern='[0-9]*'
                      className='w-full p-2 rounded bg-inf2 text-black focus:bg-white'
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/\D/g, '') // elimina todo lo que no sea dígito
                      }}
                    />
                  </div>
                  <div>
                    <label className='block text-sm'>
                      Página web:
                      {tipoPlan !== 'pago' && <span title='Disponible solo con el plan de pago' className='ml-1 cursor-help'>ℹ️</span>}
                    </label>
                    <input
                      type='url'
                      defaultValue={comercio.pagina_web || ''}
                      className='w-full p-2 rounded bg-inf2 text-black focus:bg-white'
                      disabled={tipoPlan !== 'pago'}
                    />
                  </div>
                  <div>
                    <label className='block text-sm'>
                      Servicios:
                      {tipoPlan !== 'pago' && <span title='Disponible solo con el plan de pago' className='ml-1 cursor-help'>ℹ️</span>}
                    </label>
                    <textarea
                      defaultValue={comercio.servicios || ''}
                      onInput={(e) => e.target.value = e.target.value.toUpperCase()}
                      className='w-full p-2 rounded bg-inf2 text-black focus:bg-white'
                      disabled={tipoPlan !== 'pago'}
                      rows='5'
                    />
                  </div>
                </>
              )}
              <div className='flex justify-between mt-4'>
                <button
                  onClick={handleAtras}
                  className='bg-inf3 text-black px-6 py-2 rounded-md font-medium hover:bg-inf5'
                >
                  Atrás
                </button>
                <button
                  onClick={handleSiguiente}
                  className='bg-inf3 text-black px-6 py-2 rounded-md font-medium hover:bg-inf5'
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className='space-y-6'>
              <h2 className='text-2xl font-bold text-center mb-2'>Autorización</h2>
              <p className='text-center'>¿Autoriza la publicación de esta información en Internet?</p>
              <div className='flex justify-center'>
                <label className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={autorizado}
                    onChange={(e) => setAutorizado(e.target.checked)}
                  />
                  Sí, autorizo
                </label>
              </div>
              <div className='flex justify-between mt-4'>
                <button
                  onClick={handleAtras}
                  className='bg-inf3 text-black px-6 py-2 rounded-md font-medium hover:bg-inf5'
                >
                  Atrás
                </button>
                <button
                  disabled={!autorizado}
                  className={`px-6 py-2 rounded-md font-medium ${autorizado
                    ? 'bg-inf3 text-black hover:bg-inf5'
                    : 'bg-gray-400 text-white cursor-not-allowed'
                    }`}
                  onClick={handleSiguiente}
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
          {step === 4 && tipoPlan === 'pago' && (
            <div className='space-y-6'>
              <h2 className='text-2xl font-bold text-center mb-2'>Pago del Plan</h2>
              <p className='text-center text-sm'>
                Por favor, escanee el siguiente código QR y realice el pago correspondiente de <strong>Bs. 50</strong>. A continuación, cargue una imagen del comprobante.
              </p>

              <div className='flex justify-center'>
                <img src={qrPago} alt='QR para pago' className='w-60 h-60 rounded-lg shadow-md' />
              </div>

              <div>
                <label className='block text-sm text-center mt-4'>Cargar comprobante de pago:</label>
                <input
                  type='file'
                  accept='image/*,.pdf'
                  className='w-full bg-inf1 p-2 rounded text-black'
                  onChange={(e) => setComprobanteCargado(!!e.target.files.length)}
                />
              </div>

              <div className='flex justify-between mt-4'>
                <button
                  onClick={handleAtras}
                  className='bg-inf3 text-black px-6 py-2 rounded-md font-medium hover:bg-inf5'
                >
                  Atrás
                </button>
                <button
                  onClick={handleSiguiente}
                  disabled={!comprobanteCargado}
                  className={`px-6 py-2 rounded-md font-medium ${comprobanteCargado
                      ? 'bg-inf3 text-black hover:bg-inf5'
                      : 'bg-gray-400 text-white cursor-not-allowed'
                    }`}
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
          {step === 5 && (
            <div className='space-y-6 text-center'>
              <h2 className='text-2xl font-bold mb-2'>¡Gracias por registrarse!</h2>

              <p className='text-inf1'>
                La solicitud fue recibida correctamente. La información será revisada y actualizada en un plazo de <strong>24 a 48 horas hábiles</strong>.
              </p>

              <div className='text-4xl mt-4'>🎉🎉🎉</div>

              <p className='text-lg font-semibold text-inf2 mt-2'>
                ¡Le agradecemos la confianza depositada en Infomóvil!
              </p>

              <div className='text-sm text-inf1'>
                Se le notificará cuando su información esté publicada en línea.
              </div>

              <div className='mt-6'>
                <button
                  className='bg-inf3 text-black px-6 py-2 rounded-md font-medium hover:bg-inf5'
                  onClick={() => window.location.reload()}
                >
                  Finalizar
                </button>
              </div>
            </div>
          )}
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
