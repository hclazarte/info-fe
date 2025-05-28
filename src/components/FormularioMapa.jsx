import React, { useCallback } from 'react'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'

const containerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '1rem',
  minHeight: '300px' // Asegura altura visible
}

const FormularioMapa = ({ latitud, longitud }) => {
  const lat = parseFloat(latitud)
  const lng = parseFloat(longitud)
  console.log(lat)
  console.log(lng)

  if (isNaN(lat) || isNaN(lng)) {
    return <p>Coordenadas inválidas</p>
  }

  const center = { lat, lng }

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  })

  const onLoad = useCallback(
    (map) => {
      google.maps.event.trigger(map, 'resize')
      map.panTo(center)
    },
    [center]
  )

  if (loadError) return <p>Error al cargar Google Maps</p>
  if (!isLoaded) return <p>Cargando mapa...</p>

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={16}
      onLoad={onLoad}
    >
      <Marker position={center} />
    </GoogleMap>
  )
}

export default FormularioMapa
