import { useState } from 'react'
import '../css/output.css'
import Spinner from './common/SpinnerCom.jsx'
import AcceptDialog from './common/AcceptDialog.jsx'
import { registrarComercioNoSeprec } from '../services/comerciosService.js'

export default function AltaNoSeprec({ onClose }) {
  const [formData, setFormData] = useState({
    empresa: '',
    email: '',
    calle_numero: '',
    ciudad_id: '',
    nit: ''
  })
  const [showDialog, setShowDialog] = useState(false)
  const [showSpinner, setShowSpinner] = useState(false)
  const [dialogMsg, setDialogMsg] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleCloseDialog = () => {
    setShowDialog(false)
    if (success && onClose) onClose()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { empresa, email, calle_numero, ciudad_id } = formData
    if (!empresa || !email || !calle_numero || !ciudad_id) {
      setDialogMsg('Por favor, complete todos los campos obligatorios.')
      setShowDialog(true)
      return
    }

    try {
      setShowSpinner(true)
      const { ok, error } = await registrarComercioNoSeprec(formData)

      if (!ok) {
        setDialogMsg(error || 'Ya existe un comercio con ese nombre.')
        setShowDialog(true)
      } else {
        setSuccess(true)
        setDialogMsg('Registro exitoso. Verifique su correo.')
        setShowDialog(true)
        setFormData({
          empresa: '',
          email: '',
          calle_numero: '',
          ciudad_id: '',
          nit: ''
        })
      }
    } catch (err) {
      setDialogMsg('Error de conexión. Intente nuevamente más tarde.')
      setShowDialog(true)
    } finally {
      setShowSpinner(false)
    }
  }

  return (
    <div className='fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center'>
      <div className='bg-inf4 text-white rounded-xl shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto'>
        <h2 className='text-2xl font-bold mb-6 text-center'>
          Registro de Comercio (No SEPREC)
        </h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block mb-1'>Nombre de Empresa:</label>
            <input
              type='text'
              name='empresa'
              value={formData.empresa}
              onChange={handleChange}
              className='w-full p-2 rounded-md text-black bg-inf2 text-lg focus:bg-white'
              required
            />
          </div>
          <div>
            <label className='block mb-1'>Correo Electrónico:</label>
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              className='w-full p-2 rounded-md text-black bg-inf2 text-lg focus:bg-white'
              required
            />
          </div>
          <div>
            <label className='block mb-1'>Calle y Número:</label>
            <input
              type='text'
              name='calle_numero'
              value={formData.calle_numero}
              onChange={handleChange}
              className='w-full p-2 rounded-md text-black bg-inf2 text-lg focus:bg-white'
              required
            />
          </div>
          <div>
            <label className='block mb-1'>Ciudad:</label>
            <select
              name='ciudad_id'
              value={formData.ciudad_id}
              onChange={handleChange}
              className='w-full p-2 rounded-md text-black bg-inf2 text-lg focus:bg-white'
              required
            >
              <option value=''>Seleccione una ciudad</option>
              <option value='1'>La Paz</option>
              <option value='2'>El Alto</option>
              <option value='3'>Cochabamba</option>
              {/* Agregar más según catálogo */}
            </select>
          </div>
          <div>
            <label className='block mb-1'>NIT (opcional):</label>
            <input
              type='text'
              name='nit'
              value={formData.nit}
              onChange={handleChange}
              className='w-full p-2 rounded-md text-black bg-inf2 text-lg focus:bg-white'
            />
          </div>
          <div className='flex justify-end gap-4 mt-6'>
            <button
              type='button'
              onClick={onClose}
              className='px-6 py-2 bg-inf3 text-black rounded-md text-lg font-medium hover:bg-blue-600'
            >
              Cancelar
            </button>
            <button
              type='submit'
              className='px-6 py-2 bg-inf3 text-black rounded-md text-lg font-medium hover:bg-blue-600'
            >
              Registrar
            </button>
          </div>
        </form>
        {showDialog && (
          <AcceptDialog mensaje={dialogMsg} onClose={handleCloseDialog} />
        )}
        {showSpinner && <Spinner />}
      </div>
    </div>
  )
}
