import axios from 'axios'
import { apiRequest } from './request'

// GET /inicio/objetos?path=...
export const obtenerObjetosInicio = async (path) => {
  const params = new URLSearchParams({ path })

  return apiRequest(() =>
    axios.get(`${window.infoConfig.apiUrl}/inicio/objetos?${params.toString()}`)
  )
}
