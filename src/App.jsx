import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Busquedas from './components/Busquedas'
import RegistroComercioWizard from './admin/RegistroComercioWizard'
import Unsubscribe from './admin/Unsubscribe'
import SpinnerCom from './components/common/SpinnerCom'
import { LoadScript } from '@react-google-maps/api'

function App() {
  const [configLoaded, setConfigLoaded] = useState(false)

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('/config.json')
        if (!response.ok) {
          throw new Error('Mala respuesta de la red')
        }
        const config = await response.json()
        window.infoConfig = config
        setConfigLoaded(true)
      } catch (error) {
        console.error('No se pudo cargar la configuración:', error)
      }
    }

    loadConfig()
  }, [])

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  if (!configLoaded) {
    return <SpinnerCom />
  }

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <Routes>
        <Route
          path='/app/registro-comercio'
          element={<RegistroComercioWizard />}
        />
        <Route path='/app/cancelar-suscripcion' element={<Unsubscribe />} />
        <Route path='/*' element={<Busquedas />} />
      </Routes>
    </LoadScript>
  )
}

export default App
