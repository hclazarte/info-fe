import axios from 'axios'
import { apiRequest } from './request'

// Obtener todas las ciudades
export const obtenerCiudades = async () => {
  return apiRequest(() => axios.get(`${window.infoConfig.apiUrl}/ciudades`))
}

// Obtener una ciudad por ID
export const obtenerCiudad = async (id) => {
  return apiRequest(() =>
    axios.get(`${window.infoConfig.apiUrl}/ciudades/${id}`)
  )
}

// Obtener ciudad por IP del cliente
export const obtenerCiudadPorIP = async () => {
  return apiRequest(() =>
    axios.get(`${window.infoConfig.apiUrl}/ciudades/by_client_ip`)
  )
}

// Buscar ciudades por filtro (por ejemplo, ciudad y país)
export const buscarCiudades = async ({ ciudad, pais }) => {
  const params = new URLSearchParams()
  if (ciudad) params.append('ciudad', ciudad)
  if (pais) params.append('pais', pais)

  return apiRequest(() =>
    axios.get(`${window.infoConfig.apiUrl}/ciudades?${params.toString()}`)
  )
}

// Obtener zonas de una ciudad por ID
export const obtenerZonasDeCiudad = async (ciudadId) => {
  return apiRequest(() =>
    axios.get(`${window.infoConfig.apiUrl}/ciudades/${ciudadId}/zonas`)
  )
}

// Buscar zonas por ciudad y descripción
export const buscarZonasDeCiudad = async (ciudadId, descripcion) => {
  return apiRequest(() =>
    axios.get(
      `${window.infoConfig.apiUrl}/ciudades/${ciudadId}/zonas?descripcion=${encodeURIComponent(descripcion)}`
    )
  )
}
