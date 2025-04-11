import axios from 'axios'
import { apiRequest } from './request'

// PATCH /comercios/:id?token=...
export const actualizarComercio = async (comercioId, data, otp_token) => {
  return apiRequest(() =>
    axios.patch(
      `${window.infoConfig.apiUrl}/comercios/${comercioId}?token=${otp_token}`,
      { comercio: data }
    )
  )
}

// GET /comercios/lista?ciudad_id=...&zona_id=...&text=...&page=1&per_page=100
export const obtenerListaComercios = async ({
  ciudad_id,
  zona_id = '',
  text = '',
  page = 1,
  per_page = 100
}) => {
  const params = new URLSearchParams({
    ciudad_id,
    zona_id,
    text,
    page,
    per_page
  })

  return apiRequest(() =>
    axios.get(
      `${window.infoConfig.apiUrl}/comercios/lista?${params.toString()}`
    )
  )
}

// GET /comercios/contar?ciudad_id=...&zona_id=...&text=...
export const contarComercios = async ({ ciudad_id, zona_id, text = '' }) => {
  const params = new URLSearchParams({
    ciudad_id,
    zona_id,
    text
  })

  return apiRequest(() =>
    axios.get(
      `${window.infoConfig.apiUrl}/comercios/contar?${params.toString()}`
    )
  )
}
