// Este componente espera props: step, substep, tipoPlan, setTipoPlan, comercio, solicitud,
// ciudades, zonas, handleAtras, handleSiguiente, comercioEditable, setComercioEditable

import { useEffect } from 'react'
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
  setComercioEditable
}) => {
  useEffect(() => {
    if (comercio && solicitud) {
      setComercioEditable((prev) => ({
        ...prev,
        ...comercio,
        email: solicitud.email
      }))
    }
  }, [comercio, solicitud])

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
      <h2 className='text-2xl font-bold text-center mb-4'>
        Información del Comercio
      </h2>
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
              disabled={planBloqueado}
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
              disabled={planBloqueado}
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
              disabled
              value={comercioEditable.empresa || ''}
              className='w-full p-2 rounded bg-inf2 text-black'
            />
          </div>
          <div>
            <label className='block text-sm'>Email: {candado()}</label>
            <input
              disabled
              value={comercioEditable.email || ''}
              className='w-full p-2 rounded bg-inf2 text-black'
            />
          </div>
          <div>
            <label className='block text-sm'>NIT: {candado()}</label>
            <input
              disabled
              value={comercioEditable.nit || ''}
              className='w-full p-2 rounded bg-inf2 text-black'
            />
          </div>
          <div>
            <label className='block text-sm'>Ciudad:</label>
            <select
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
              value={comercioEditable.zona_nombre || ''}
              onInput={handleUppercase('zona_nombre')}
              className='w-full p-2 rounded bg-inf2 text-black focus:bg-white'
            />
          </div>
          <div>
            <label className='block text-sm'>Dirección (Calle y número):</label>
            <input
              value={comercioEditable.calle_numero || ''}
              onChange={handleChange('calle_numero')}
              className='w-full p-2 rounded bg-inf2 text-black focus:bg-white'
            />
          </div>
          <div>
            <label className='block text-sm'>Planta:</label>
            <input
              value={comercioEditable.planta || ''}
              onChange={handleChange('planta')}
              className='w-full p-2 rounded bg-inf2 text-black focus:bg-white'
            />
          </div>
          <div>
            <label className='block text-sm'>Número de local:</label>
            <input
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
              value={comercioEditable.telefono1 || ''}
              onInput={handleNumeric('telefono1')}
              className='w-full p-2 rounded bg-inf2 text-black focus:bg-white'
            />
          </div>
          <div>
            <label className='block text-sm'>Palabras clave:</label>
            <textarea
              value={comercioEditable.palabras_clave || ''}
              onInput={handleUppercase('palabras_clave')}
              className='w-full p-2 rounded bg-inf2 text-black focus:bg-white'
              rows='5'
            />
          </div>
          <div>
            <label className='block text-sm'>Teléfono 2:</label>
            <input
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
              value={comercioEditable.telefono_whatsapp || ''}
              onInput={handleNumeric('telefono_whatsapp')}
              className='w-full p-2 rounded bg-inf2 text-black focus:bg-white'
              disabled={campoSoloPago}
            />
          </div>
          <div>
            <label className='block text-sm'>
              Página web: {candado(tipoPlan === 'gratis')}
            </label>
            <input
              type='url'
              value={comercioEditable.pagina_web || ''}
              onChange={handleChange('pagina_web')}
              className='w-full p-2 rounded bg-inf2 text-black focus:bg-white'
              disabled={campoSoloPago}
            />
          </div>
          <div>
            <label className='block text-sm'>
              Servicios: {candado(tipoPlan === 'gratis')}
            </label>
            <textarea
              value={comercioEditable.servicios || ''}
              onInput={handleUppercase('servicios')}
              className='w-full p-2 rounded bg-inf2 text-black focus:bg-white'
              rows='5'
              disabled={campoSoloPago}
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
  )
}

export default PasoInformacionComercio
