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
