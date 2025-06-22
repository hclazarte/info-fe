import { useState, useEffect, useRef } from 'react'
import backgroundImage from '../img/background-image.jpg'
import Buscar from './Buscar'
import Ciudad from './Ciudad'
import Zona from './Zona'
import IconoBuzon from './IconoBuzon'
import BotonAltaComercio from './BotonAltaComercio'
import BotonModificaComercio from './BotonModificaComercio'
import GloboSugerencia from './GloboSugerencia'
import Tarjeta from './Tarjeta'
import Firma from './Firma'
import DetalleModal from './DetalleModal'
import BuzonSugerencias from './BuzonSugerencias'
import AltaNoSeprec from './AltaNoSeprec'
import { obtenerObjetosInicio } from '../services/iniciosService'
import {
  obtenerCiudades,
  obtenerZonasDeCiudad
} from '../services/ciudadesService'
import { obtenerListaComercios } from '../services/comerciosService'
import { registrarClickComercio } from '../services/logClicksService'
import {
  capitalizarTexto,
  normalizarDesdePath,
  convertirAPath
} from '../utils/texto'
import waitImg from '../img/waiting5.gif'

export default function Busquedas() {
  // Utilizados por la vista
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false)
  const [ciudad, setCiudad] = useState({ id: '' })
  const [zona, setZona] = useState({ id: '' })
  const [mostrarCiudades, setMostrarCiudades] = useState(false)
  const [mostrarZonas, setMostrarZonas] = useState(false)
  const [ciudades, setCiudades] = useState([])
  const [zonas, setZonas] = useState([])
  const [comercios, setComercios] = useState({ results: [] })
  const [modalAbierto, setModalAbierto] = useState(false)
  const [comercioSeleccionado, setComercioSeleccionado] = useState(null)
  const [mostrarBuzon, setMostrarBuzon] = useState(false)
  const [mostrarAlta, setMostrarAlta] = useState(false)
  const touchStartY = useRef(null)
  const touchEndY = useRef(null)
  const touchStartYRef = useRef(null)
  const touchStartTargetRef = useRef(null)
  // Utilizados por el negocio
  const [path, setPath] = useState(decodeURI(window.location.pathname))
  const [texto, setTexto] = useState('')
  const [loading, setLoading] = useState(true)
  const grupoRef = useRef(0)
  const gr_tamRef = useRef(15)
  const loadingRef = useRef(false)
  const initLoadinRef = useRef(false)
  const contadorRef = useRef(1)
  const foreceUpdateRef = useRef(false)
  const pathRef = useRef('')
  const lastPathRef = useRef(null)
  const abortControllerRef = useRef(null)
  const desktopRef = useRef(null)
  const mobileRef = useRef(null)
  // Constantes
  const render_offset = 250

  // Agrega una nueva entrada al historial
  const updateURL = (newPath) => {
    if (window.location.pathname !== newPath) {
      window.history.pushState({}, '', newPath)
    }
  }

  // Al cargar el formulario
  useEffect(() => {
    loadInit() // Ejecuta al cargar el componente
  }, [])

  // Al cargar cambiar de tamaño
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // La historia
  useEffect(() => {
    const handlePopState = () => {
      loadInit(window.location.pathname)
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  // Intervalo de tiempo
  useEffect(() => {
    const interval = setInterval(async () => {
      if (contadorRef.current === 0) {
        let build_path = linkBuilder()
        if (build_path !== null && !loadingRef.current) {
          loadingRef.current = true
          setLoading(true)
          await loadSearch(0).then(() => {
            loadingRef.current = false
            setLoading(false)
          })
          updateURL(build_path)
          pathRef.current = build_path
        }
      }
      if (!loadingRef.current) contadorRef.current++
    }, 50)

    return () => clearInterval(interval)
  }, [ciudad, zona, texto])

  const loadInit = async (m_path = path) => {
    if (initLoadinRef.current) return

    try {
      initLoadinRef.current = true
      setLoading(true)

      const { ok, data, error } = await obtenerObjetosInicio(m_path)
      if (!ok) throw new Error(error || 'Error al obtener datos de inicio')

      const { ciudades_ini, ciudad_ini, zonas_ini, zona_ini, text_ini } = data

      const build_path = linkBuilder(text_ini, ciudad_ini, zona_ini)
      window.history.replaceState({}, '', build_path)

      setPath(build_path)
      setCiudades(ciudades_ini)
      setCiudad(ciudad_ini)
      setZonas(zonas_ini)
      setZona(zona_ini)
      setTexto(text_ini)
      contadorRef.current = -1
    } catch (err) {
      console.error('Error en loadInit:', err.message)
    } finally {
      setLoading(false)
      initLoadinRef.current = false
    }
  }

  const loadSearch = async (
    n_grupo = null,
    n_text = texto,
    n_ciudad_id = ciudad.id,
    n_zona_id = zona.id
  ) => {
    // Cancelar solicitud anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Crear nuevo controlador para esta solicitud
    const controller = new AbortController()
    abortControllerRef.current = controller
    const signal = controller.signal

    foreceUpdateRef.current = false
    let gr_aux = grupoRef.current

    const text = n_text.replace(/[/\-]/g, ' ').trim()
    const n_path = linkBuilder(text)

    if (lastPathRef.current === n_path && n_grupo !== null) return

    try {
      gr_aux = n_grupo !== null ? n_grupo + 1 : gr_aux + 1
      const { data: obj } = await obtenerListaComercios(
        {
          ciudad_id: n_ciudad_id,
          zona_id: n_zona_id,
          text,
          page: gr_aux,
          per_page: gr_tamRef.current
        },
        signal
      )

      lastPathRef.current = n_path

      if (gr_aux === 1) {
        // 1) Reemplazamos la lista
        setComercios(obj)

        // 2) Creamos un array con los dos refs y hacemos scrollTop=0
        ;[desktopRef.current, mobileRef.current].forEach((el) => {
          if (el) el.scrollTop = 0
        })
      } else {
        setComercios((prevState) => ({
          ...prevState,
          results: [...(prevState.results || []), ...obj.results]
        }))
      }

      grupoRef.current = gr_aux
    } catch (err) {
      console.error('Error al recuperar comercios:', err.message)
    }
  }

  const linkBuilder = (texto_m = texto, ciudad_m = ciudad, zona_m = zona) => {
    let aux = '/bolivia'

    if (ciudad_m && ciudad_m.ciudad) {
      aux += `/${ciudad_m.ciudad.split(' ').join('-')}`
    }

    if (zona_m && zona_m.id !== 0 && zona_m.descripcion) {
      aux += `/${zona_m.descripcion.split(' ').join('-')}`
    }

    if (texto_m && texto_m.trim() !== '') {
      aux += `/${texto_m.split(' ').join('-')}`
    }

    return aux.toLowerCase()
  }

  const onScroll = async (e) => {
    let element = e.target

    if (
      element.scrollHeight - element.scrollTop - element.clientHeight <=
      render_offset
    ) {
      let still_loading = comercios.count > comercios.results.length
      if (!loadingRef.current && still_loading) {
        loadingRef.current = true
        setLoading(true)
        await loadSearch().then(() => {
          loadingRef.current = false
          setLoading(false)
        })
      }
    }
  }

  const onCiudadChanged = async (seleccionada) => {
    try {
      if (seleccionada?.id === '') {
        setZonas([])
        setZona({ id: '' })
        return
      }
      setLoading(true)

      // Cargar zonas
      let { data: zonas } = await obtenerZonasDeCiudad(seleccionada.id)
      zonas = zonas.map((z) => ({
        ...z,
        descripcion: capitalizarTexto(z.descripcion)
      }))
      setZonas(zonas)
      setZona({ id: '' })
    } catch (err) {
      console.error('Error al cargar la ciudad:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const filtrosChanged = async (
    texto_m = texto,
    ciudad_m = ciudad,
    zona_m = zona
  ) => {
    let newPath = linkBuilder(texto_m, ciudad_m, zona_m)
    if (pathRef.current !== newPath) {
      contadorRef.current = -1
    }
  }

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY

    touchStartYRef.current = e.touches[0].clientY
    touchStartTargetRef.current = e.target
  }

  const handleTouchEnd = (e) => {
    const target = touchStartTargetRef.current
    const estaEnLista = target.closest('ul')?.classList.contains('area-lista')

    touchEndY.current = e.changedTouches[0].clientY
    if (
      filtrosAbiertos &&
      touchStartY.current - touchEndY.current > 50 && // Umbral para considerar swipe hacia arriba
      !estaEnLista
    ) {
      setFiltrosAbiertos(false)
      filtrosChanged()
    }
  }

  const handleClickConRecaptcha = async (
    comercio,
    isMobile,
    setComercioSeleccionado,
    setModalAbierto
  ) => {
    const plataforma = isMobile ? 'movil' : 'escritorio'

    const token = await grecaptcha.enterprise.execute(
      '6LfLImkrAAAAAKzEHAVXOiv1EIx9bn1eAu0Ay4MK',
      { action: 'log_clics' }
    )

    try {
      registrarClickComercio(comercio.id, plataforma, token)
    } catch {
      registrarClickComercio(comercio.id, plataforma, null)
    } finally {
      setComercioSeleccionado(comercio)
      setModalAbierto(true)
    }
  }

  const hayCiudad = ciudad?.id && ciudad.id !== ''
  const hayZona = zona?.id && zona.id !== ''

  return (
    <div className='min-h-screen'>
      <div
        className='min-h-screen'
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundRepeat: 'repeat'
        }}
      >
        {isMobile ? (
          <div className='opacity-90 grid grid-cols-1'>
            <div className='controlesMobile bg-inf4'>
              {!filtrosAbiertos && (
                <div
                  className='absolute top-[72px] left-6 text-white text-xs'
                  data-testid='etiqueta-busqueda'
                >
                  {hayCiudad
                    ? hayZona
                      ? `${ciudad.ciudad} - ${zona.descripcion}`
                      : ciudad.ciudad
                    : 'Bolivia'}
                  ({comercios?.count ?? 0})
                </div>
              )}
              {/* Controles */}
              <div
                className='w-full bg-inf4 rounded-xl p-4'
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <Buscar
                  filtrosAbiertos={filtrosAbiertos}
                  setFiltrosAbiertos={setFiltrosAbiertos}
                  texto={texto}
                  setTexto={setTexto}
                  filtrosChanged={filtrosChanged}
                />
                <div
                  className={`flex-col gap-y-4 w-full transition-all ${filtrosAbiertos ? 'flex' : 'hidden'}`}
                >
                  <Ciudad
                    ciudad={ciudad}
                    setCiudad={setCiudad}
                    mostrarCiudades={mostrarCiudades}
                    setMostrarCiudades={setMostrarCiudades}
                    ciudades={ciudades}
                    onCiudadChanged={onCiudadChanged}
                    isMobile={isMobile}
                    filtrosChanged={filtrosChanged}
                  />
                  {zonas?.length > 1 && (
                    <Zona
                      zona={zona}
                      setZona={setZona}
                      mostrarZonas={mostrarZonas}
                      setMostrarZonas={setMostrarZonas}
                      zonas={zonas}
                      isMobile={isMobile}
                      filtrosChanged={filtrosChanged}
                    />
                  )}
                  <Firma />
                  <div className='flex flex-row items-center gap-x-4 mt-4'>
                    <IconoBuzon onClick={() => setMostrarBuzon(true)} />
                    <BotonAltaComercio onClick={() => setMostrarAlta(true)} />
                    <BotonModificaComercio
                      onClick={() => setMostrarAlta(true)}
                    />
                    <GloboSugerencia />
                  </div>
                </div>
              </div>
            </div>
            <div
              className='resultadosMobile'
              onScroll={onScroll}
              ref={mobileRef}
            >
              {/* Resultados */}
              <div className='pt-4 pb-28 px-4 grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {comercios.results.map((comercio, i) => (
                  <Tarjeta
                    key={i}
                    comercio={comercio}
                    onClick={() =>
                      handleClickConRecaptcha(
                        comercio,
                        isMobile,
                        setComercioSeleccionado,
                        setModalAbierto
                      )
                    }
                  />
                ))}
                {!loading && comercios.results.length === 0 && (
                  <div className='col-span-full text-center py-10 text-inf7 text-lg'>
                    <p className='mb-2 font-semibold'>
                      No se encontraron comercios
                    </p>
                    <p className='text-sm text-gray-600'>
                      Intente cambiar los filtros o revise si escribió
                      correctamente.
                    </p>
                  </div>
                )}
                {loading && (
                  <div className='col-span-full flex justify-center items-center bg-inf3 p-4'>
                    <img
                      src={waitImg}
                      alt='Cargando...'
                      className='w-12 h-12'
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className='flex h-screen'>
            {/* Controles Desktop */} //TODO
            <div className='w-[326px] bg-inf4 p-4 overflow-y-auto controlesDesktop'>
              <div
                className='absolute top-[72px] left-6 text-white text-xs'
                data-testid='etiqueta-busqueda'
              >
                {hayCiudad
                  ? hayZona
                    ? `${ciudad.ciudad} - ${zona.descripcion}`
                    : ciudad.ciudad
                  : 'Bolivia'}
                ({comercios?.count ?? 0})
              </div>
              <Buscar
                filtrosAbiertos={filtrosAbiertos}
                setFiltrosAbiertos={setFiltrosAbiertos}
                texto={texto}
                setTexto={setTexto}
                filtrosChanged={filtrosChanged}
              />
              <div className='flex flex-col gap-y-4 w-full transition-all'>
                <Firma />
                <Ciudad
                  ciudad={ciudad}
                  setCiudad={setCiudad}
                  mostrarCiudades={mostrarCiudades}
                  setMostrarCiudades={setMostrarCiudades}
                  ciudades={ciudades}
                  onCiudadChanged={onCiudadChanged}
                  isMobile={isMobile}
                  filtrosChanged={filtrosChanged}
                />
                {zonas?.length > 1 && (
                  <Zona
                    zona={zona}
                    setZona={setZona}
                    mostrarZonas={mostrarZonas}
                    setMostrarZonas={setMostrarZonas}
                    zonas={zonas}
                    isMobile={isMobile}
                    filtrosChanged={filtrosChanged}
                  />
                )}
                <div className='flex flex-row items-center gap-x-4 mt-4'>
                  <IconoBuzon onClick={() => setMostrarBuzon(true)} />
                  <BotonAltaComercio onClick={() => setMostrarAlta(true)} />
                  <BotonModificaComercio onClick={() => setMostrarAlta(true)} />
                  <GloboSugerencia />
                </div>
              </div>
            </div>
            {/* Resultados Desktop */}
            <div
              className='flex-1 bg-inf3 p-4 overflow-y-auto resultadosDesktop'
              onScroll={onScroll}
              data-testid='resultados-div'
              ref={desktopRef}
            >
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                {comercios.results.map((comercio, i) => (
                  <Tarjeta
                    key={i}
                    comercio={comercio}
                    onClick={() =>
                      handleClickConRecaptcha(
                        comercio,
                        isMobile,
                        setComercioSeleccionado,
                        setModalAbierto
                      )
                    }
                  />
                ))}
              </div>
              {!loading && comercios.results.length === 0 && (
                <div className='col-span-full text-center py-10 text-inf7 text-lg'>
                  <p className='mb-2 font-semibold'>
                    No se encontraron comercios
                  </p>
                  <p className='text-sm text-gray-600'>
                    Intente cambiar los filtros o revise si escribió
                    correctamente.
                  </p>
                </div>
              )}
              {loading && (
                <div className='col-span-full flex justify-center items-center bg-inf3 p-4'>
                  <img src={waitImg} alt='Cargando...' className='w-12 h-12' />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {modalAbierto && (
        <DetalleModal
          comercio={comercioSeleccionado}
          onClose={() => setModalAbierto(false)}
        />
      )}
      {mostrarBuzon && (
        <BuzonSugerencias
          pathRef={{ current: '' }}
          lastPathRef={{ current: '' }}
          onClose={() => setMostrarBuzon(false)}
        />
      )}
      {mostrarAlta && <AltaNoSeprec onClose={() => setMostrarAlta(false)} />}
    </div>
  )
}
