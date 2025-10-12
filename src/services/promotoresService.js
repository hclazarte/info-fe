// src/utils/promotoresService.js
import axios from 'axios'
import { apiRequest } from './request'

export const crearPromotor = async (promotor, recaptchaToken) => {
  return apiRequest(() =>
    axios.post(
      `${window.infoConfig.apiUrl}/promotores?recaptcha_token=${recaptchaToken}`,
      { promotor, recaptcha_token: recaptchaToken }
    )
  )
}
