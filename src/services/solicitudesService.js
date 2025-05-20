import axios from 'axios'
import { apiRequest } from './request'

export const obtenerSolicitudToken = async (otp_token) => {
  return apiRequest(() =>
    axios.get(
      `${window.infoConfig.apiUrl}/solicitudes/buscar_por_token?token=${otp_token}`
    )
  )
}

export const enviarSolicitud = async ({
  email,
  comercio_id,
  recaptcha_token
}) => {
  return apiRequest(() =>
    axios.post(
      `${window.infoConfig.apiUrl}/solicitudes?recaptcha_token=${recaptcha_token}`,
      { email, comercio_id }
    )
  )
}
