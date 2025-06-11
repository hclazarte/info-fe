import axios from 'axios'
import { apiRequest } from './request'

export const enviarMensajeWhatsapp = async (
  mensajeWhatsapp,
  recaptchaToken
) => {
  return apiRequest(() =>
    axios.post(
      `${window.infoConfig.apiUrl}/whatsapp/mensajes?recaptcha_token=${recaptchaToken}`,
      { ...mensajeWhatsapp }
    )
  )
}
