// src/services/unsubscribe.js
import axios from 'axios'
import { apiRequest } from './request'

/**
 * Cancelar suscripción para el correo contenido en el JWT.
 * @param {string} token  JWT generado en el enlace del correo
 * @param {string} motivo Texto con el motivo escrito por el usuario
 * @returns {Promise}     Respuesta del backend (200 = éxito)
 */
export const cancelarSuscripcion = async (token, motivo) =>
  apiRequest(() =>
    axios.post(`${window.infoConfig.apiUrl}/app/cancelar-suscripcion`, {
      token,
      motivo
    })
  )
