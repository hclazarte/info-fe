// src/pages/Unsubscribe.jsx
import React, { useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { cancelarSuscripcion } from '../services/unsubscribe'

export default function Unsubscribe() {
  const token = new URLSearchParams(window.location.search).get('token')

  const [email, setEmail] = useState('')
  const [motivo, setMotivo] = useState('')
  const [msg, setMsg] = useState(null)
  const [err, setErr] = useState(false)

  useEffect(() => {
    try {
      setEmail(jwtDecode(token).email)
    } catch {
      setMsg('Enlace inválido o expirado')
    }
  }, [token])

  const submit = async (e) => {
    e.preventDefault()
    if (!motivo.trim()) {
      setErr(true)
      return
    }

    try {
      await cancelarSuscripcion(token, motivo)
      setMsg('Su correo fue dado de baja correctamente')
    } catch {
      setMsg('No se pudo procesar la baja')
    }
  }

  if (!token)
    return <p className='text-inf_err text-center mt-12'>Falta el token.</p>
  if (msg)
    return <p className='text-inf8 text-center mt-12 font-semibold'>{msg}</p>

  return (
    <div className='flex justify-center mt-12 px-4'>
      <form
        onSubmit={submit}
        className='max-w-md w-full bg-inf4 rounded-xl shadow-lg p-10 space-y-6'
      >
        <h2 className='text-2xl font-bold text-center text-inf1'>
          Cancelar suscripción
        </h2>

        <p className='text-inf1'>
          Correo: <strong>{email}</strong>
        </p>

        <label className='block text-inf1'>
          Motivo
          <textarea
            value={motivo}
            onChange={(e) => {
              setMotivo(e.target.value)
              setErr(false)
            }}
            className={`text-inf8 w-full h-32 p-3 mt-1 rounded-lg border focus:outline-none focus:ring-2 focus:ring-inf4 ${err ? 'border-inf_err' : 'border-inf4'}`}
          />
        </label>
        {err && (
          <p className='text-sm text-inf_err'>Por favor escribe un motivo.</p>
        )}

        <button
          className='w-full py-3 rounded-lg bg-inf8 hover:bg-inf7 text-white font-semibold disabled:opacity-50'
          disabled={!!msg}
        >
          Confirmar baja
        </button>
      </form>
    </div>
  )
}
