// src/components/MapaUbicacion.jsx
import { useEffect, useRef } from 'react'

const loadGoogleMaps = (apiKey) => {
  // Evita cargar dos veces
  if (window.google && window.google.maps) return Promise.resolve()

  if (document.getElementById('gmaps-script')) {
    // ya se está cargando
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
  alto = '16rem'
}) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const mapInstanceRef = useRef(null)

  useEffect(() => {
    let isMounted = true

    const init = async () => {
      await loadGoogleMaps(apiKey)
      if (!isMounted) return

      // Centro por defecto: La Paz, BO (si no hay coordenadas)
      const hasCoords = !!latitud && !!longitud
      const center = hasCoords
        ? { lat: parseFloat(latitud), lng: parseFloat(longitud) }
        : { lat: -16.5, lng: -68.15 }

      const map = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: hasCoords ? 16 : 12,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true
      })
      mapInstanceRef.current = map

      // Si ya hay coordenadas, planto el marcador
      if (hasCoords) {
        markerRef.current = new window.google.maps.marker.AdvancedMarkerElement(
          {
            map,
            position: center
          }
        )
      }

      // Click para fijar coordenadas
      map.addListener('click', (e) => {
        const lat = e.latLng.lat()
        const lng = e.latLng.lng()

        if (markerRef.current) {
          markerRef.current.position = { lat, lng }
        } else {
          markerRef.current =
            new window.google.maps.marker.AdvancedMarkerElement({
              map,
              position: { lat, lng }
            })
        }
        onChangeLatLng({ latitud: lat.toFixed(6), longitud: lng.toFixed(6) })
      })
    }

    init()
    return () => {
      isMounted = false
    }
  }, [apiKey])

  // Si cambian las coords desde afuera, actualizamos mapa/marcador
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return
    if (!latitud || !longitud) return

    const pos = { lat: parseFloat(latitud), lng: parseFloat(longitud) }
    map.setCenter(pos)
    map.setZoom(16)

    if (markerRef.current) {
      markerRef.current.position = pos
    } else {
      markerRef.current = new window.google.maps.marker.AdvancedMarkerElement({
        map,
        position: pos
      })
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
