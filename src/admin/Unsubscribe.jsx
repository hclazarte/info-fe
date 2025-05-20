// src/pages/Unsubscribe.jsx
import React, { useState, useEffect } from 'react'
import jwtDecode from 'jwt-decode'
import axios from 'axios'

export default function Unsubscribe() {
  const token = new URLSearchParams(window.location.search).get('token')
  const [email, setEmail]   = useState('')
  const [motivo, setMotivo] = useState('')
  const [msg, setMsg]       = useState(null)

  useEffect(() => {
    try   { setEmail(jwtDecode(token).email) }
    catch { setMsg('Enlace inválido / expirado') }
  }, [token])

  const submit = async e => {
    e.preventDefault()
    try {
      await axios.post(`${process.env.REACT_APP_API}/app/cancelar-suscripcion`, { token, motivo })
      setMsg('Su correo fue dado de baja correctamente ✅')
    } catch {
      setMsg('No se pudo procesar la baja ❌')
    }
  }

  if (!token)      return <p>Falta el token.</p>
  if (msg)         return <p>{msg}</p>

  return (
    <form onSubmit={submit} className="max-w-md mx-auto mt-10 flex flex-col gap-4">
      <h2 className="text-xl font-bold">Cancelar suscripción</h2>
      <p>Correo: <strong>{email}</strong></p>

      <textarea
        placeholder="Motivo (opcional)"
        value={motivo}
        onChange={e => setMotivo(e.target.value)}
        className="border p-2 rounded"
      />

      <button className="bg-red-600 text-white py-2 rounded">Confirmar baja</button>
    </form>
  )
}
