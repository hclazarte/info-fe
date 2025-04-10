// src/utils/request.js
import axios from 'axios'

export const apiRequest = async (axiosCall) => {
  try {
    const response = await axiosCall()
    return { ok: true, data: response.data }
  } catch (error) {
    const mensaje =
      error.response?.data?.error || error.message || 'Error desconocido'
    return { ok: false, error: mensaje }
  }
}
