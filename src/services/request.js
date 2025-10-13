// src/utils/request.js
import axios from 'axios'

export const apiRequest = async (axiosCall) => {
  try {
    const response = await axiosCall()
    return { ok: true, data: response.data, status: response.status }
  } catch (err) {
    const status = err.response?.status
    const data = err.response?.data
    // Normalización estricta al formato acordado
    const errors = Array.isArray(data?.errors)
      ? data.errors
      : [data?.error || data?.message || err.message || 'Error desconocido']

    return {
      ok: false,
      errors, // siempre array de strings
      error: errors.join(', '), // útil para toasts/dialogs
      status
    }
  }
}
