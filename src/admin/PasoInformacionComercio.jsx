// Este componente espera props: step, substep, tipoPlan, setTipoPlan, comercio, solicitud,
// ciudades, zonas, handleAtras, handleSiguiente

const PasoInformacionComercio = ({
  substep,
  tipoPlan,
  setTipoPlan,
  comercio,
  solicitud,
  ciudades,
  zonas,
  handleAtras,
  handleSiguiente
}) => {
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
          <p className='font-semibold mb-1'>
            Con el plan <span className='capitalize'>{tipoPlan}</span> puede modificar:
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
              ¡Una inversión de solo Bs. 50 al año que le permite destacar y facilitar que nuevos clientes le encuentren en línea!
            </p>
          )}
        </div>
      </div>
      {substep === 1 && (
        <>
          <div>
            <label className='block text-sm'>Empresa:</label>
            <input
              disabled
              value={comercio.empresa}
              className='w-full p-2 rounded bg-inf2 text-black'
            />
          </div>
          <div>
            <label className='block text-sm'>Correo electrónico:</label>
            <input
              disabled
              value={solicitud.email}
              className='w-full p-2 rounded bg-inf2 text-black'
            />
          </div>
          <div>
            <label className='block text-sm'>NIT:</label>
            <input
              disabled
              value={comercio.nit}
              className='w-full p-2 rounded bg-inf2 text-black'
              onInput={(e) => {
                e.target.value = e.target.value.replace(/\D/g, '')
              }}
            />
          </div>
          <div>
            <label className='block text-sm'>Ciudad:</label>
            <select
              defaultValue={comercio.ciudad_id}
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
              defaultValue={comercio.zona_id}
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
              defaultValue={comercio.zona_nombre}
              onInput={(e) =>
                (e.target.value = e.target.value.toUpperCase())
              }
              className='w-full p-2 rounded bg-inf2 text-black focus:bg-white'
            />
          </div>
          <div>
            <label className='block text-sm'>
              Dirección (Calle y número):
            </label>
            <input
              defaultValue={comercio.calle_numero}
              className='w-full p-2 rounded bg-inf2 text-black focus:bg-white'
            />
          </div>
          <div>
            <label className='block text-sm'>Planta:</label>
            <input
              defaultValue={comercio.planta || ''}
              className='w-full p-2 rounded bg-inf2 text-black focus:bg-white'
            />
          </div>
          <div>
            <label className='block text-sm'>Número de local:</label>
            <input
              defaultValue={comercio.numero_local || ''}
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
              defaultValue={comercio.telefono1}
              inputMode='numeric'
              pattern='[0-9]*'
              className='w-full p-2 rounded bg-inf2 text-black focus:bg-white'
              onInput={(e) => {
                e.target.value = e.target.value.replace(/\D/g, '') // elimina todo lo que no sea dígito
              }}
              disabled={false}
            />
          </div>
          <div>
            <label className='block text-sm'>Palabras clave:</label>
            <textarea
              defaultValue={comercio.palabras_clave || ''}
              onInput={(e) =>
                (e.target.value = e.target.value.toUpperCase())
              }
              className='w-full p-2 rounded bg-inf2 text-black focus:bg-white'
              disabled={false}
              rows='5'
            />
          </div>
          <div>
            <label className='block text-sm'>
              Teléfono 2:'
              {tipoPlan !== 'pago' && (
                <span
                  title='Disponible solo con el plan de pago'
                  className='ml-1 cursor-help'
                >
                  ℹ️
                </span>
              )}
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
              {tipoPlan !== 'pago' && (
                <span
                  title='Disponible solo con el plan de pago'
                  className='ml-1 cursor-help'
                >
                  ℹ️
                </span>
              )}
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
              {tipoPlan !== 'pago' && (
                <span
                  title='Disponible solo con el plan de pago'
                  className='ml-1 cursor-help'
                >
                  ℹ️
                </span>
              )}
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
              {tipoPlan !== 'pago' && (
                <span
                  title='Disponible solo con el plan de pago'
                  className='ml-1 cursor-help'
                >
                  ℹ️
                </span>
              )}
            </label>
            <textarea
              defaultValue={comercio.servicios || ''}
              onInput={(e) =>
                (e.target.value = e.target.value.toUpperCase())
              }
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
  )
}

export default PasoInformacionComercio
