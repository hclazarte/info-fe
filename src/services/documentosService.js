import axios from 'axios'
import { apiRequest } from './request'

// Validar NIT
export const validarDocumentoNIT = async (archivo, solicitudId) => {
  const formData = new FormData()
  formData.append('archivo', archivo)
  formData.append('solicitud_id', solicitudId)

  return apiRequest(() =>
    axios.post(`${window.infoConfig.apiUrl}/documentos/nit`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  )
}

// Validar CI
export const validarDocumentoCI = async (archivo, solicitudId) => {
  const formData = new FormData()
  formData.append('archivo', archivo)
  formData.append('solicitud_id', solicitudId)

  return apiRequest(() =>
    axios.post(`${window.infoConfig.apiUrl}/documentos/ci`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  )
}

// Validar Comprobante de Pago
export const validarComprobantePago = async (archivo, solicitudId) => {
  const formData = new FormData()
  formData.append('archivo', archivo)
  formData.append('solicitud_id', solicitudId)

  return apiRequest(() =>
    axios.post(`${window.infoConfig.apiUrl}/documentos/comprobante`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  )
}
