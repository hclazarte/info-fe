import { useState, useEffect, useRef } from 'react'
import { sugerirKeywords } from '../services/keywordsService'

const WizardSugeridor = (
  { comercioEditable, setComercioEditable, payloadRef, setSpinner },
  ref
) => {
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

  const LIST_FIELDS = new Set([
    'top_servicios',
    'promocionar_ahora',
    'marcas',
    'ubicacion',
    'diferenciadores',
    'publico_objetivo'
  ])
  const toArray = (v) =>
    Array.isArray(v)
      ? v
      : String(v ?? '')
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean)
  const aLista = (texto = '') =>
    texto
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)

  useEffect(() => {
    if (!comercioEditable?.id) return

    let p = comercioEditable.WIZARD_PAYLOAD ?? comercioEditable.wizard_payload
    if (!p) return
    if (typeof p === 'string') {
      try {
        p = JSON.parse(p)
      } catch {
        return
      }
    }

    setTipo(p.tipo || 'Bienes')
    setTopServicios(
      Array.isArray(p.top_servicios)
        ? p.top_servicios.join('\n')
        : p.top_servicios || ''
    )
    setPromocionarAhora(
      Array.isArray(p.promocionar_ahora)
        ? p.promocionar_ahora.join('\n')
        : p.promocionar_ahora || ''
    )
    setMarcas(Array.isArray(p.marcas) ? p.marcas.join('\n') : p.marcas || '')
    setUbicacion(
      Array.isArray(p.ubicacion) ? p.ubicacion.join('\n') : p.ubicacion || ''
    )
    setDiferenciadores(
      Array.isArray(p.diferenciadores)
        ? p.diferenciadores.join('\n')
        : p.diferenciadores || ''
    )
    setPublicoObjetivo(
      Array.isArray(p.publico_objetivo)
        ? p.publico_objetivo.join('\n')
        : p.publico_objetivo || ''
    )
  }, [comercioEditable?.id])

  const debounceRef = useRef(null)
  const isSame = (a, b) => JSON.stringify(a) === JSON.stringify(b)
  const tryParse = (v) =>
    typeof v === 'string'
      ? (() => {
          try {
            return JSON.parse(v)
          } catch {
            return v
          }
        })()
      : v

  useEffect(() => {
    // construir borrador actual
    const draft = {
      empresa: comercioEditable?.empresa || '',
      tipo: typeof tipo === 'string' ? tipo : String(tipo || ''),
      servicios: comercioEditable?.servicios || '',
      top_servicios: aLista(topServicios),
      promocionar_ahora: aLista(promocionarAhora),
      marcas: aLista(marcas),
      ubicacion: aLista(ubicacion),
      diferenciadores: aLista(diferenciadores),
      publico_objetivo: aLista(publicoObjetivo)
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setComercioEditable((prev) => {
        const prevWP = tryParse(prev?.WIZARD_PAYLOAD) || {}
        if (isSame(prevWP, draft)) return prev // no cambió → no setea → no loop
        return { ...prev, WIZARD_PAYLOAD: draft }
      })
    }, 250)

    return () => clearTimeout(debounceRef.current)
  }, [
    tipo,
    topServicios,
    promocionarAhora,
    marcas,
    ubicacion,
    diferenciadores,
    publicoObjetivo,
    setComercioEditable,
    comercioEditable?.empresa,
    comercioEditable?.servicios
  ])

  const onGenerar = async () => {
    setSpinner(true)
    setError(null)
    setLoading(true)
    try {
      const payload = {
        empresa: comercioEditable?.empresa || '',
        tipo: typeof tipo === 'string' ? tipo : String(tipo || ''),
        servicios: comercioEditable?.servicios || '',
        top_servicios: aLista(topServicios),
        promocionar_ahora: aLista(promocionarAhora),
        marcas: aLista(marcas),
        ubicacion: aLista(ubicacion),
        diferenciadores: aLista(diferenciadores),
        publico_objetivo: aLista(publicoObjetivo)
      }

      const resp = await sugerirKeywords(payload) // sin recaptcha
      const raw = resp?.data ?? resp
      const body = raw?.data ?? raw?.result ?? raw

      const palabras = String(
        body?.palabras_clave ?? body?.keywords ?? ''
      ).toUpperCase()
      const ofertas = String(body?.ofertas ?? body?.offers ?? '')

      setComercioEditable((prev) => ({
        ...prev,
        palabras_clave: palabras,
        ofertas
      }))
      setSugerenciasGeneradas(true)
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        'Error al generar sugerencias'
      setError(msg)
    } finally {
      setLoading(false)
      setSpinner(false)
    }
  }

  const handleUppercase = (field) => (e) => {
    const value = (e.target.value || '').toUpperCase()
    setComercioEditable((prev) => ({ ...prev, [field]: value }))
  }

  const handleChange = (field, value) => {
    // clona y aplica cambio solo en la ref (fuente de verdad)
    const next = { ...(payloadRef.current || {}) }
    next[field] = LIST_FIELDS.has(field) ? toArray(value) : value

    payloadRef.current = next
  }

  return (
    <div className='w-full space-y-3'>
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
                      onChange={(e) => {
                        setTipo(e.target.value)
                        handleChange('tipo', e.target.value)
                      }}
                    />
                    {op}
                  </label>
                ))}
              </div>
            </div>

            <div className='space-y-3'>
              <div>
                <label className='block text-sm mb-1'>
                  Top servicios (uno por línea)
                </label>
                <textarea
                  rows={4}
                  value={topServicios}
                  onChange={(e) => {
                    setTopServicios(e.target.value)
                    handleChange('top_servicios', e.target.value)
                  }}
                  className='w-full p-2 rounded bg-white text-black'
                />
              </div>
              <div>
                <label className='block text-sm mb-1'>
                  Promocionar ahora (uno por línea)
                </label>
                <textarea
                  rows={4}
                  value={promocionarAhora}
                  onChange={(e) => {
                    setPromocionarAhora(e.target.value)
                    handleChange('promocionar_ahora', e.target.value)
                  }}
                  className='w-full p-2 rounded bg-white text-black'
                />
              </div>
              <div>
                <label className='block text-sm mb-1'>
                  Marcas (uno por línea)
                </label>
                <textarea
                  rows={4}
                  value={marcas}
                  onChange={(e) => {
                    setMarcas(e.target.value)
                    handleChange('marcas', e.target.value)
                  }}
                  className='w-full p-2 rounded bg-white text-black'
                />
              </div>
              <div>
                <label className='block text-sm mb-1'>
                  Ubicación (uno por línea)
                </label>
                <textarea
                  rows={4}
                  value={ubicacion}
                  onChange={(e) => {
                    setUbicacion(e.target.value)
                    handleChange('ubicacion', e.target.value)
                  }}
                  className='w-full p-2 rounded bg-white text-black'
                />
              </div>
              <div>
                <label className='block text-sm mb-1'>
                  Diferenciadores (uno por línea)
                </label>
                <textarea
                  rows={4}
                  value={diferenciadores}
                  onChange={(e) => {
                    setDiferenciadores(e.target.value)
                    handleChange('diferenciadores', e.target.value)
                  }}
                  className='w-full p-2 rounded bg-white text-black'
                />
              </div>
              <div>
                <label className='block text-sm mb-1'>
                  Público objetivo (uno por línea)
                </label>
                <textarea
                  rows={4}
                  value={publicoObjetivo}
                  onChange={(e) => {
                    setPublicoObjetivo(e.target.value)
                    handleChange('publico_objetivo', e.target.value)
                  }}
                  className='w-full p-2 rounded bg-white text-black'
                />
              </div>
            </div>

            {error && (
              <p className='mt-2 text-sm text-inf_err font-medium'>{error}</p>
            )}

            <div className='mt-3 flex justify-end'>
              <button
                type='button'
                onClick={onGenerar}
                disabled={loading}
                className={`px-6 py-2 rounded-md font-medium ${loading ? 'bg-inf3 opacity-60' : 'bg-inf3 hover:bg-inf5'} text-black`}
              >
                {loading ? 'Generando…' : 'Generar sugerencias'}
              </button>
            </div>
          </>
        )}
      </div>

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
          onChange={(e) =>
            setComercioEditable((prev) => ({
              ...prev,
              ofertas: e.target.value
            }))
          }
          className='w-full p-2 rounded bg-inf2 text-black focus:bg-white'
          data-testid='ofertas-textarea'
        />
      </div>
    </div>
  )
}

export default WizardSugeridor
