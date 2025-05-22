import axios from 'axios'
import { apiRequest } from './request'

export const enviarCorreoUsuario = async (correos_usuario, recaptchaToken) => {
  return apiRequest(() =>
    axios.post(
      `${window.infoConfig.apiUrl}/correos_usuarios?recaptcha_token=${recaptchaToken}`,
      { correos_usuario } // solo este objeto, no dupliques recaptcha_token
    )
  )
}
