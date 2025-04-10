import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Busquedas from './components/Busquedas'
import ValidacionPropietario from './admin/ValidacionPropietario'
import SpinnerCom from './components/common/SpinnerCom'

function App() {
  const [configLoaded, setConfigLoaded] = useState(false)
  
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('/config.json')
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const config = await response.json()
        window.infoConfig = config
        setConfigLoaded(true)
      } catch (error) {
        console.error('Failed to load config:', error)
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
      <Route path='/*' element={<Busquedas />} />
    </Routes>
  )
}

export default App
