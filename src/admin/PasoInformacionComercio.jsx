// Este componente espera props: step, substep, tipoPlan, setTipoPlan, comercio, solicitud,
// ciudades, zonas, handleAtras, handleSiguiente, comercioEditable, setComercioEditable
import MapaUbicacion from './MapaUbicacion'
import { useEffect, useState } from 'react'
import { Lock } from 'lucide-react'

const PasoInformacionComercio = ({
  substep,
  tipoPlan,
  setTipoPlan,
  comercio,
  solicitud,
  ciudades,
  zonas,
  handleAtras,
  handleSiguiente,
  comercioEditable,
  setComercioEditable,
  bloquearAtras
}) => {
  useEffect(() => {
    if (comercio && solicitud) {
      setComercioEditable((prev) => ({
        ...prev,
        ...comercio
      }))
    }
  }, [comercio, solicitud])

  useEffect(() => {
    if (comercio?.seprec === false) {
      setTipoPlan('pago')
    }
  }, [comercio])

  useEffect(() => {
    if (!comercio) return
    const snap = {}
    CAMPOS_DE_PAGO.forEach((k) => {
      snap[k] = comercio?.[k] ?? ''
    })
    setSnapshotPagoInicial(snap)
    setComercioEditable((prev) => ({ ...prev, ...comercio }))
  }, [comercio])

  const [errores, setErrores] = useState({})
  const [snapshotPagoInicial, setSnapshotPagoInicial] = useState({})
  const campoModificado = (k) => {
    const actual = comercioEditable?.[k] ?? ''
    const inicial = snapshotPagoInicial?.[k] ?? ''
    return String(actual) !== String(inicial)
  }
  const handleChangePlan = (nuevoPlan) => {
    // Actualiza tipo de plan
    setTipoPlan(nuevoPlan)

    if (nuevoPlan === 'gratis') {
      // Detecta qué campos de pago fueron editados y restáuralos al snapshot
      const restaurados = {}
      const nuevosErrores = {}

      CAMPOS_DE_PAGO.forEach((k) => {
        if (campoModificado(k)) {
          restaurados[k] = snapshotPagoInicial[k] ?? ''
          // Mensaje rojo por campo (inmutabilidad)
          nuevosErrores[k] =
            'Este campo no puede modificarse con el plan gratuito. Se ha restablecido su valor.'
        }
      })

      if (Object.keys(restaurados).length > 0) {
        setComercioEditable((prev) => ({ ...prev, ...restaurados }))
        setErrores((prev) => ({ ...prev, ...nuevosErrores }))
      }
    } else {
      // Si pasa a pago, limpia mensajes de inmutabilidad solo en campos de pago
      const nuevosErrores = { ...errores }
      CAMPOS_DE_PAGO.forEach((k) => {
        delete nuevosErrores[k]
      })
      setErrores(nuevosErrores)
    }
  }
  const CAMPOS_DE_PAGO = ['pagina_web', 'telefono_whatsapp', 'servicios']

  if (!comercioEditable) {
    return (
      <p className='text-center text-sm text-gray-500'>
        Cargando datos del comercio...
      </p>
    )
  }

  const handleChange = (field) => (e) => {
    const value = e.target.value
    setComercioEditable((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleUppercase = (field) => (e) => {
    const value = e.target.value.toUpperCase()
    setComercioEditable((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNumeric = (field) => (e) => {
    const value = e.target.value.replace(/\D/g, '')
    setComercioEditable((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleInputWhatsApp = (e) => {
    let valor = e.target.value.replace(/\D/g, '') // solo dígitos
    setComercioEditable((prev) => ({ ...prev, telefono_whatsapp: valor }))
  }

  const handleBlurWhatsApp = () => {
    const valor = comercioEditable.telefono_whatsapp || ''
    const regex = /^[1-9]\d{7,14}$/
    const esValido = regex.test(valor)
    setErrores((prev) => ({
      ...prev,
      whatsapp: esValido
        ? null
        : 'El número debe tener entre 8 y 15 dígitos incluyendo el código de país. Ej: 59171234567'
    }))
  }

  const candado = (condicion = true) => {
    if (!condicion) return null
    return <Lock size={14} className='inline-block text-white' />
  }

  const campoSoloPago = tipoPlan !== 'pago'
  const planBloqueado =
    solicitud?.fecha_fin_servicio &&
    new Date(solicitud.fecha_fin_servicio) > new Date()

  return (
    <div className='space-y-4'>
      <h2
        data-testid='titulo-paso'
        className='text-2xl font-bold text-center mb-4'
      >
        Información del Comercio
      </h2>
      <div>
        <label className='block text-sm font-medium'>Tipo de Plan:</label>
        <div className='flex items-center gap-4 mt-1'>
          <label className='flex items-center gap-2'>
            <input
              data-testid='gratuito-input'
              type='radio'
              name='tipoPlan'
              value='gratis'
              checked={tipoPlan === 'gratis'}
              onChange={(e) => handleChangePlan(e.target.value)}
              disabled={planBloqueado || comercio?.seprec === false}
            />
            Gratuito
          </label>
          <label className='flex items-center gap-2'>
            <input
              data-testid='depago-input'
              type='radio'
              name='tipoPlan'
              value='pago'
              checked={tipoPlan === 'pago'}
              onChange={(e) => handleChangePlan(e.target.value)}
              disabled={planBloqueado || comercio?.seprec === false}
            />
            De Pago (Bs. 50/año)
          </label>
        </div>
        <div className='bg-inf3 text-black rounded p-3 text-sm mt-2'>
          <p className='font-semibold mb-1'>
            Con el plan <span className='capitalize'>{tipoPlan}</span> puede
            modificar:
          </p>
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
              ¡Una inversión de solo Bs. 50 al año que le permite destacar y
              facilitar que nuevos clientes le encuentren en línea!
            </p>
          )}
        </div>
      </div>
      {substep === 1 && (
        <>
          <div>
            <label className='block text-sm'>Empresa: {candado()}</label>
            <input
              data-testid='empresa-input'
              disabled
              value={comercioEditable.empresa || ''}
              className='w-full p-2 rounded bg-inf2 text-black'
            />
          </div>
          <div>
            <label className='block text-sm'>Email: {candado()}</label>
            <input
              data-testid='email-input'
              disabled
              value={solicitud.email || ''}
              className='w-full p-2 rounded bg-inf2 text-black'
            />
          </div>
          <div>
            <label className='block text-sm'>NIT: {candado()}</label>
            <input
              data-testid='nit-input'
              disabled
              value={comercioEditable.nit || ''}
              className='w-full p-2 rounded bg-inf2 text-black'
            />
          </div>
          <div>
            <label className='block text-sm'>Ciudad:</label>
            <select
              data-testid='ciudad-select'
              value={comercioEditable.ciudad_id || ''}
              onChange={handleChange('ciudad_id')}
              className='w-full p-2 rounded bg-inf2 text-black'
            >
              <option value=''>Seleccione una ciudad</option>
              {ciudades.map((ciudad) => (
                <option key={ciudad.id} value={ciudad.id}>
                  {ciudad.ciudad}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className='block text-sm'>Zona:</label>
            <select
              data-testid='zona-select'
              value={comercioEditable.zona_id || ''}
              onChange={handleChange('zona_id')}
              className='w-full p-2 rounded bg-inf2 text-black'
            >
              <option value=''>Seleccione una zona</option>
              {zonas.map((zona) => (
                <option key={zona.id} value={zona.id}>
                  {zona.descripcion}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className='block text-sm'>Nombre de Zona:</label>
            <input
              data-testid='nombre-zona-input'
              value={comercioEditable.zona_nombre || ''}
              onInput={handleUppercase('zona_nombre')}
              className='w-full p-2 rounded bg-inf2 text-black focus:bg-white'
            />
          </div>
          <div>
            <label className='block text-sm'>Dirección (Calle y número):</label>
            <input
              data-testid='calle-numero-input'
              value={comercioEditable.calle_numero || ''}
              onChange={handleChange('calle_numero')}
              className='w-full p-2 rounded bg-inf2 text-black focus:bg-white'
            />
          </div>
          <div>
            <label className='block text-sm'>Planta:</label>
            <input
              data-testid='planta-input'
              value={comercioEditable.planta || ''}
              onChange={handleChange('planta')}
              className='w-full p-2 rounded bg-inf2 text-black focus:bg-white'
            />
          </div>
          <div>
            <label className='block text-sm'>Número de local:</label>
            <input
              data-testid='numero-local-input'
              value={comercioEditable.numero_local || ''}
              onChange={handleChange('numero_local')}
              className='w-full p-2 rounded bg-inf2 text-black focus:bg-white'
            />
          </div>
        </>
      )}
      {substep === 2 && (
        <>
          <div>
            <label className='block text-sm'>Teléfono 1:</label>
            <input
              data-testid='telefono1-input'
              value={comercioEditable.telefono1 || ''}
              onInput={handleNumeric('telefono1')}
              className='w-full p-2 rounded bg-inf2 text-black focus:bg-white'
            />
          </div>
          <div>
            <label className='block text-sm'>Palabras clave:</label>
            <textarea
              data-testid='claves-textarea'
              value={comercioEditable.palabras_clave || ''}
              onInput={handleUppercase('palabras_clave')}
              className='w-full p-2 rounded bg-inf2 text-black focus:bg-white'
              rows='5'
            />
          </div>
          <div>
            <label className='block text-sm'>Teléfono 2:</label>
            <input
              data-testid='telefono2-input'
              value={comercioEditable.telefono2 || ''}
              onInput={handleNumeric('telefono2')}
              className='w-full p-2 rounded bg-inf2 text-black focus:bg-white'
            />
          </div>
          <div>
            <label className='block text-sm'>
              WhatsApp: {candado(tipoPlan === 'gratis')}
            </label>
            <input
              data-testid='whatsapp-input'
              value={comercioEditable.telefono_whatsapp || ''}
              onInput={handleInputWhatsApp}
              onBlur={handleBlurWhatsApp}
              className='w-full p-2 rounded bg-inf2 text-black focus:bg-white'
              disabled={campoSoloPago}
              placeholder='59171234567'
            />
            {errores.telefono_whatsapp && (
              <p
                className='text-inf_err text-sm mt-1'
                data-testid='error-telefono_whatsapp'
              >
                {errores.telefono_whatsapp}
              </p>
            )}
          </div>
          <div>
            <label className='block text-sm'>
              Página web: {candado(tipoPlan === 'gratis')}
            </label>
            <input
              data-testid='pagina-web-input'
              type='url'
              value={comercioEditable.pagina_web || ''}
              onChange={handleChange('pagina_web')}
              className='w-full p-2 rounded bg-inf2 text-black focus:bg-white'
              disabled={campoSoloPago}
            />
            {errores.pagina_web && (
              <p
                className='text-inf_err text-sm mt-1'
                data-testid='error-pagina_web'
              >
                {errores.pagina_web}
              </p>
            )}
          </div>
          <div>
            <label className='block text-sm'>
              Servicios: {candado(tipoPlan === 'gratis')}
            </label>
            <textarea
              data-testid='servicios-textarea'
              value={comercioEditable.servicios || ''}
              onInput={handleUppercase('servicios')}
              className='w-full p-2 rounded bg-inf2 text-black focus:bg-white'
              rows='5'
              disabled={campoSoloPago}
            />
            {errores.servicios && (
              <p
                className='text-inf_err text-sm mt-1'
                data-testid='error-servicios'
              >
                {errores.servicios}
              </p>
            )}
          </div>
        </>
      )}
      {substep === 3 && (
        <>
          <h3 className='text-xl font-semibold mb-2'>Ubicación Geográfica</h3>
          <p className='text-sm text-gray-600 mb-4'>
            Pinche en el mapa para fijar la posición exacta de su comercio.
          </p>

          <MapaUbicacion
            latitud={comercioEditable.latitud}
            longitud={comercioEditable.longitud}
            preservarVista
            onChangeLatLng={({ latitud, longitud }) => {
              setComercioEditable((prev) => ({
                ...prev,
                latitud,
                longitud
              }))
            }}
            alto='18rem'
          />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
            <div>
              <label className='block text-sm'>Latitud:</label>
              <input
                data-testid='latitud-input'
                value={comercioEditable.latitud || ''}
                onChange={(e) =>
                  setComercioEditable((prev) => ({
                    ...prev,
                    latitud: e.target.value
                  }))
                }
                className='w-full p-2 rounded bg-inf2 text-black focus:bg-white'
                placeholder='-16.500000'
              />
            </div>
            <div>
              <label className='block text-sm'>Longitud:</label>
              <input
                data-testid='longitud-input'
                value={comercioEditable.longitud || ''}
                onChange={(e) =>
                  setComercioEditable((prev) => ({
                    ...prev,
                    longitud: e.target.value
                  }))
                }
                className='w-full p-2 rounded bg-inf2 text-black focus:bg-white'
                placeholder='-68.150000'
              />
            </div>
          </div>
        </>
      )}
      <div className='flex justify-between mt-4'>
        <button
          data-testid='atras-button'
          onClick={handleAtras}
          disabled={bloquearAtras}
          className={`px-6 py-2 rounded-md font-medium bg-inf3 text-black ${
            bloquearAtras ? 'opacity-50 cursor-not-allowed' : 'hover:bg-inf5'
          }`}
        >
          Atrás
        </button>
        <button
          data-testid='siguiente-button'
          onClick={handleSiguiente}
          className='bg-inf3 text-black px-6 py-2 rounded-md font-medium hover:bg-inf5'
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}

export default PasoInformacionComercio
