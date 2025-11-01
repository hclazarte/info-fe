// admin/WizardSugeridor.jsx
import { useState } from 'react'
import { sugerirKeywords } from '../services/keywordsService' // <- no cambiar

const WizardSugeridor = ({ comercioEditable, setComercioEditable }) => {
  const [tipo, setTipo] = useState('Bienes')
  const [topServicios, setTopServicios] = useState('')
  const [promocionarAhora, setPromocionarAhora] = useState('')
  const [marcas, setMarcas] = useState('')
  const [ubicacion, setUbicacion] = useState('')
  const [diferenciadores, setDiferenciadores] = useState('')
  const [publicoObjetivo, setPublicoObjetivo] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [colapsado, setColapsado] = useState(false)
  const [sugerenciasGeneradas, setSugerenciasGeneradas] = useState(false)

  const aLista = (texto) =>
    texto
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)

  const onGenerar = async () => {
    setError(null)
    setLoading(true)
    try {
      const payload = {
        negocio: comercioEditable?.empresa || '',
        tipo,
        rubro: comercioEditable?.servicios || '',
        top_servicios: aLista(topServicios),
        promocionar_ahora: aLista(promocionarAhora),
        marcas: aLista(marcas),
        ubicacion: aLista(ubicacion),
        diferenciadores: aLista(diferenciadores),
        publico_objetivo: aLista(publicoObjetivo)
      }

      const resp = await sugerirKeywords(payload)
      const raw = resp?.data ?? resp
      const body = raw?.data ?? raw?.result ?? raw // soporta {data:{...}} o {result:{...}} o plano

      const palabras = String(
        body?.palabras_clave ?? body?.keywords ?? ''
      ).toUpperCase()

      const ofertas = String(
        body?.ofertas ?? body?.offers ?? ''
      )

      setComercioEditable((prev) => ({
        ...prev,
        palabras_clave: palabras,
        ofertas: ofertas
      }))
      setSugerenciasGeneradas(true)

    } catch (e) {
      setError(e?.message || 'Error al generar sugerencias')
    } finally {
      setLoading(false)
    }
  }

  const handleUppercase = (field) => (e) => {
    const value = (e.target.value || '').toUpperCase()
    setComercioEditable((prev) => ({ ...prev, [field]: value }))
  }

  const handleChange = (field) => (e) => {
    const value = e.target.value
    setComercioEditable((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className='w-full space-y-3'>
      {/* Header + toggle amarillo inf_adv */}
      <div className='w-full rounded-md border border-inf3 bg-inf2 p-3 text-black'>
        <div className='flex items-center justify-between mb-2'>
          <h4 className='font-semibold'>Asistente IA para palabras clave</h4>
          <button
            type='button'
            onClick={() => setColapsado((v) => !v)}
            className='text-sm font-medium text-inf_adv underline'
          >
            {colapsado ? 'Expandir' : 'Colapsar'}
          </button>
        </div>

        {!colapsado && (
          <>
            {/* Modo expandido: campos a TODO EL ANCHO */}
            <div className='mb-3'>
              <label className='block text-sm font-medium mb-1'>Tipo</label>
              <div className='flex gap-6'>
                {['Bienes', 'Servicios', 'Ambos'].map((op) => (
                  <label key={op} className='flex items-center gap-2'>
                    <input
                      type='radio'
                      name='tipo'
                      value={op}
                      checked={tipo === op}
                      onChange={(e) => setTipo(e.target.value)}
                    />
                    {op}
                  </label>
                ))}
              </div>
            </div>

            {/* Listas: un ítem por línea (todas full width) */}
            <div className='space-y-3'>
              <div>
                <label className='block text-sm mb-1'>Top servicios (uno por línea)</label>
                <textarea
                  rows={4}
                  value={topServicios}
                  onChange={(e) => setTopServicios(e.target.value)}
                  className='w-full p-2 rounded bg-white text-black'
                />
              </div>
              <div>
                <label className='block text-sm mb-1'>Promocionar ahora (uno por línea)</label>
                <textarea
                  rows={4}
                  value={promocionarAhora}
                  onChange={(e) => setPromocionarAhora(e.target.value)}
                  className='w-full p-2 rounded bg-white text-black'
                />
              </div>
              <div>
                <label className='block text-sm mb-1'>Marcas (uno por línea)</label>
                <textarea
                  rows={4}
                  value={marcas}
                  onChange={(e) => setMarcas(e.target.value)}
                  className='w-full p-2 rounded bg-white text-black'
                />
              </div>
              <div>
                <label className='block text-sm mb-1'>Ubicación (uno por línea)</label>
                <textarea
                  rows={4}
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                  className='w-full p-2 rounded bg-white text-black'
                />
              </div>
              <div>
                <label className='block text-sm mb-1'>Diferenciadores (uno por línea)</label>
                <textarea
                  rows={4}
                  value={diferenciadores}
                  onChange={(e) => setDiferenciadores(e.target.value)}
                  className='w-full p-2 rounded bg-white text-black'
                />
              </div>
              <div>
                <label className='block text-sm mb-1'>Público objetivo (uno por línea)</label>
                <textarea
                  rows={4}
                  value={publicoObjetivo}
                  onChange={(e) => setPublicoObjetivo(e.target.value)}
                  className='w-full p-2 rounded bg-white text-black'
                />
              </div>
            </div>

            {error && (
              <p className='mt-2 text-sm text-inf_err font-medium'>
                {error}
              </p>
            )}

            <div className='mt-3 flex justify-end'>
              <button
                type='button'
                onClick={onGenerar}
                disabled={loading}
                className={`px-6 py-2 rounded-md font-medium ${
                  loading ? 'bg-inf3 opacity-60' : 'bg-inf3 hover:bg-inf5'
                } text-black`}
              >
                {loading ? 'Generando…' : 'Generar sugerencias'}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Las cajas de texto SIEMPRE visibles */}
      {sugerenciasGeneradas && (
        <div className='text-sm font-medium text-inf_exi'>
          Sugerencias generadas
        </div>
      )}

      <div>
        <label className='block text-sm mb-1'>Palabras clave:</label>
        <textarea
          rows={5}
          value={comercioEditable?.palabras_clave || ''}
          onInput={handleUppercase('palabras_clave')}
          className='w-full p-2 rounded bg-inf2 text-black focus:bg-white'
          data-testid='claves-textarea'
        />
      </div>

      <div>
        <label className='block text-sm mb-1'>Ofertas:</label>
        <textarea
          rows={5}
          value={comercioEditable?.ofertas || ''}
          onChange={handleChange('ofertas')}
          className='w-full p-2 rounded bg-inf2 text-black focus:bg-white'
          data-testid='ofertas-textarea'
        />
      </div>
    </div>
  )
}

export default WizardSugeridor
