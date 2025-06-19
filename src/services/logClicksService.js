// src/utils/logClicksService.js
import axios from 'axios'
import { apiRequest } from './request'

/**
 * Registra un clic de usuario sobre un comercio.
 *
 * @param {number|string} comercioId - ID del comercio clickeado.
 * @param {'escritorio'|'movil'} plataforma - Plataforma desde la que se accede.
 * @returns {Promise} Promise resuelta cuando se haya enviado la petición.
 */
export const registrarClickComercio = async (comercioId, plataforma) => {
  return apiRequest(() =>
    axios.post(`${window.infoConfig.apiUrl}/log_clics`, {
      comercio_id: comercioId,
      plataforma: plataforma
    })
  )
}
