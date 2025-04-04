// src/App.jsx
import { Routes, Route } from "react-router-dom"
import Busquedas from "./components/Busquedas"
import ValidacionPropietario from "./admin/ValidacionPropietario"

function App() {
  return (
    <Routes>
      <Route path="/app/registro-comercio" element={<ValidacionPropietario />} />
      <Route path="/*" element={<Busquedas />} />
    </Routes>
  )
}

export default App
