// src/components/MapaUbicacion.jsx
import { useEffect, useRef } from 'react'

const loadGoogleMaps = (apiKey) => {
  if (window.google && window.google.maps) return Promise.resolve()
  if (document.getElementById('gmaps-script')) {
    return new Promise((resolve) => {
      const check = () => {
        if (window.google && window.google.maps) resolve()
        else setTimeout(check, 100)
      }
      check()
    })
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.id = 'gmaps-script'
    // Puedes dejar libraries=marker; si no está, igual hacemos fallback.
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker`
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('No se pudo cargar Google Maps'))
    document.head.appendChild(script)
  })
}

export default function MapaUbicacion({
  latitud,
  longitud,
  onChangeLatLng,
  alto = '16rem',
  preservarVista = false
}) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const isAdvancedRef = useRef(false) // true si usamos AdvancedMarkerElement
  const lastUpdateFromMapRef = useRef(false)

  useEffect(() => {
    let isMounted = true

    const init = async () => {
      await loadGoogleMaps(apiKey)
      if (!isMounted) return

      const hasCoords = !!latitud && !!longitud
      const center = hasCoords
        ? { lat: parseFloat(latitud), lng: parseFloat(longitud) }
        : { lat: -16.5, lng: -68.15 }

      const map = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: hasCoords ? 16 : 12,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        gestureHandling: 'greedy'
      })
      mapInstanceRef.current = map

      // Detectar disponibilidad de AdvancedMarkerElement y setear fallback
      const AdvancedMarkerElement =
        window.google?.maps?.marker?.AdvancedMarkerElement
      isAdvancedRef.current = !!AdvancedMarkerElement

      // Si ya hay coordenadas, crear marcador inicial
      if (hasCoords) {
        if (isAdvancedRef.current) {
          markerRef.current = new AdvancedMarkerElement({
            map,
            position: center
          })
        } else {
          markerRef.current = new window.google.maps.Marker({
            map,
            position: center
          })
        }
      }

      // Click para fijar coordenadas (funciona tanto con pan como con clic)
      map.addListener('click', (e) => {
        const currentCenter = map.getCenter()
        const currentZoom = map.getZoom()

        const lat = e.latLng.lat()
        const lng = e.latLng.lng()

        if (markerRef.current) {
          if (isAdvancedRef.current) {
            markerRef.current.position = { lat, lng }
          } else {
            markerRef.current.setPosition({ lat, lng })
          }
        } else {
          if (isAdvancedRef.current) {
            markerRef.current = new AdvancedMarkerElement({
              map,
              position: { lat, lng }
            })
          } else {
            markerRef.current = new window.google.maps.Marker({
              map,
              position: { lat, lng }
            })
          }
        }

        // Marcar que el cambio proviene del mapa para no recentrar en el efecto
        lastUpdateFromMapRef.current = true
        onChangeLatLng?.({ latitud: lat.toFixed(6), longitud: lng.toFixed(6) })

        // Restaurar vista si se requiere preservar zoom/centro
        if (preservarVista) {
          map.setZoom(currentZoom)
          map.setCenter(currentCenter)
        }
      })
    }

    init()
    return () => {
      isMounted = false
    }
  }, [apiKey, onChangeLatLng])

  // Si cambian las coords desde fuera (inputs), centra/actualiza marcador
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || !latitud || !longitud) return

    const pos = { lat: parseFloat(latitud), lng: parseFloat(longitud) }
    map.setCenter(pos)
    map.setZoom(16)

    if (markerRef.current) {
      if (isAdvancedRef.current) {
        markerRef.current.position = pos
      } else {
        markerRef.current.setPosition(pos)
      }
    } else {
      if (isAdvancedRef.current) {
        const AdvancedMarkerElement =
          window.google?.maps?.marker?.AdvancedMarkerElement
        markerRef.current = new AdvancedMarkerElement({ map, position: pos })
      } else {
        markerRef.current = new window.google.maps.Marker({
          map,
          position: pos
        })
      }
    }
  }, [latitud, longitud])

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: alto }}
      data-testid='google-map'
      className='rounded'
    />
  )
}
