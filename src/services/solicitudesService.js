import axios from 'axios'
import { apiRequest } from './request'

export const obtenerSolicitudToken = async (otp_token) => {
  return apiRequest(() =>
    axios.get(
      `${window.infoConfig.apiUrl}/solicitudes/buscar_por_token?token=${otp_token}`
    )
  )
}
