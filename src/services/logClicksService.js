import axios from 'axios'
import { apiRequest } from './request'

/**
 * Registra un clic de usuario sobre un comercio.
 * Fire-and-forget: todos los errores se ignoran.
 *
 * @param {number|string} comercioId
 * @param {'escritorio'|'movil'} plataforma
 * @param {string} recaptchaToken - Token generado por reCAPTCHA v3
 */
export const registrarClickComercio = (
  comercioId,
  plataforma,
  recaptchaToken
) => {
  apiRequest(() =>
    axios.post(`${window.infoConfig.apiUrl}/log_clics`, {
      comercio_id: comercioId,
      plataforma,
      recaptcha_token: recaptchaToken
    })
  ).catch(() => {
    // ignorar errores de red, 404, 500, etc.
  })
}
