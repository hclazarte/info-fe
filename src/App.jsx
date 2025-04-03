// src/App.jsx
import { Routes, Route } from "react-router-dom"
import Busquedas from "./components/Busquedas"
import RegistroComercio from "./admin/RegistroComercio"

function App() {
  return (
    <Routes>
      <Route path="/app/registro-comercio" element={<RegistroComercio />} />
      <Route path="/*" element={<Busquedas />} />
    </Routes>
  )
}

export default App
