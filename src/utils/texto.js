// Capitaliza cada palabra en una cadena
export const capitalizarTexto = (texto) => {
  if (typeof texto !== 'string') return texto
  return texto
    .toLowerCase()
    .split(' ')
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(' ')
}

// Convierte cadenas del tipo "la-paz" o "zona-sur" en "La Paz", "Zona Sur"
export const normalizarDesdePath = (texto) => {
  return capitalizarTexto(texto.replace(/-/g, ' '))
}

// Convierte "La Paz" o "Zona Sur" en "la-paz", "zona-sur" (para la URL)
export const convertirAPath = (texto) => {
  return texto.toLowerCase().replace(/\s+/g, '-')
}

// Remueve tildes de un texto
export const quitarTildes = (texto) => {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

// Genera un identificador tipo slug para usar en la URL de un comercio
export const generarSlug = (texto) => {
  if (typeof texto !== 'string' || !texto.trim()) return ''
  return quitarTildes(texto)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // elimina símbolos y caracteres especiales
    .trim()
    .replace(/\s+/g, '-') // reemplaza espacios por guiones
}
