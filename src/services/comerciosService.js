import axios from 'axios'
import { apiRequest } from './request'

// PATCH /comercios/:id?token=...
export const actualizarComercio = async (id, comercio, payloadObj, token) => {
  let wizardPayloadStr = '{}'
  try {
    wizardPayloadStr = JSON.stringify(payloadObj)
  } catch (e) {
    console.error('Error al serializar payloadRef.current', e)
  }

  const comercioBody = {
    ...comercio,
    wizard_payload: wizardPayloadStr
  }
  delete comercioBody.WIZARD_PAYLOAD

  const url = `${window.infoConfig.apiUrl}/comercios/${id}${token ? `?token=${encodeURIComponent(token)}` : ''}`

  return apiRequest(() =>
    axios.patch(
      url,
      { comercio: comercioBody },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    )
  )
}

// GET /comercios/lista?ciudad_id=...&zona_id=...&text=...&page=1&per_page=100
export const obtenerListaComercios = async (
  { ciudad_id, zona_id = '', text = '', page = 1, per_page = 100 },
  signal = null
) => {
  const params = new URLSearchParams({
    ciudad_id,
    zona_id,
    text,
    page,
    per_page
  })

  return apiRequest(() =>
    axios.get(
      `${window.infoConfig.apiUrl}/comercios/lista?${params.toString()}`,
      { signal }
    )
  )
}

// POST /comercios/no_seprec?recaptcha_token=...
export const registrarComercioNoSeprec = async (data, recaptchaToken) => {
  const params = new URLSearchParams({ recaptcha_token: recaptchaToken })

  return apiRequest(() =>
    axios.post(
      `${window.infoConfig.apiUrl}/comercios/no_seprec?${params.toString()}`,
      data
    )
  )
}

// GET /comercios/por_email?email=...
export const obtenerComercioPorEmail = async (email) => {
  const params = new URLSearchParams({ email })

  return apiRequest(() =>
    axios.get(
      `${window.infoConfig.apiUrl}/comercios/por_email?${params.toString()}`
    )
  )
}
