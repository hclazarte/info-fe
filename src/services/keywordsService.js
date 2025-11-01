// src/utils/keywordsService.js
import axios from 'axios'
import { apiRequest } from './request'

/**
 * Solicita sugerencias de palabras clave y ofertas al backend.
 *
 * @param {Object} payload - Datos del comercio y las listas del wizard.
 * @returns {Promise<Object>} - Respuesta con { palabras_clave, ofertas }.
 */
export const sugerirKeywords = async (payload) => {
  return apiRequest(() =>
    axios.post(
      `${window.infoConfig.apiUrl}/keywords/sugerir`,
      { ...payload }
    )
  )
}
