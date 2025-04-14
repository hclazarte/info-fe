// src/utils/correosService.js
import axios from 'axios'
import { apiRequest } from './request'

export const enviarCorreo = async (correo, recaptchaToken) => {
  return apiRequest(() =>
    axios.post(
      `${window.infoConfig.apiUrl}/correos?recaptcha_token=${recaptchaToken}`,
      { correo, recaptcha_token: recaptchaToken }
    )
  )
}
