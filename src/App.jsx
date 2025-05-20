import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Busquedas from './components/Busquedas'
import ValidacionPropietario from './admin/ValidacionPropietario'
import Unsubscribe from './admin/Unsubscribe'
import SpinnerCom from './components/common/SpinnerCom'

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

  if (!configLoaded) {
    return <SpinnerCom />
  }

  return (
    <Routes>
      <Route
        path='/app/registro-comercio'
        element={<ValidacionPropietario />}
      />
      <Route path='/app/cancelar-suscripcion' element={<Unsubscribe />} />
      <Route path='/*' element={<Busquedas />} />
    </Routes>
  )
}

export default App
