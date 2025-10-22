import { useState, useEffect, useRef } from 'react'
import AcceptDialog from './common/AcceptDialog'
import SpinnerCom from '../components/common/SpinnerCom'
import { FaWhatsapp, FaCheckCircle } from 'react-icons/fa'
import IconoCorreo from '../assets/CorreoUsuario.svg?react'
import IconoMapa from '../assets/Mapa.svg?react'
import IconoWhatsApp from '../assets/WhatsApp.svg?react'
import FormularioCorreo from './FormularioCorreo'
import FormularioMapa from './FormularioMapa'
import FormularioWhatsapp from './FormularioWhatsapp'
import ReclamarComercio from './ReclamarComercio'

export default function DetalleModal({ comercio, onClose }) {
  const [mensaje, setMensaje] = useState('')
  const [mostrarDialogo, setMostrarDialogo] = useState(false)
  const [spinner, setSpinner] = useState(false)
  const [formularioActivo, setFormularioActivo] = useState(null)
  const mapaRef = useRef(null)
  const correoRef = useRef(null)
  const whatsappRef = useRef(null)

  useEffect(() => {
    const scrollOptions = { behavior: 'smooth' }

    if (formularioActivo === 'mapa' && mapaRef.current) {
      setTimeout(() => {
        mapaRef.current.scrollIntoView(scrollOptions)
      }, 300)
    }

    if (formularioActivo === 'correo' && correoRef.current) {
      setTimeout(() => {
        correoRef.current.scrollIntoView(scrollOptions)
      }, 300)
    }

    if (formularioActivo === 'whatsapp' && whatsappRef.current) {
      setTimeout(() => {
        whatsappRef.current.scrollIntoView(scrollOptions)
      }, 300)
    }
  }, [formularioActivo])

  if (!comercio) return null

  const {
    empresa,
    zona_nombre,
    calle_numero,
    servicios,
    telefono1,
    telefono2,
    telefono_whatsapp,
    whatsapp_verificado,
    id,
    autorizado,
    email_verificado,
    latitud,
    longitud
  } = comercio

  const telefonos = [telefono1, telefono2].filter(Boolean)

  const toggleFormulario = (tipo) => {
    setFormularioActivo((actual) => (actual === tipo ? null : tipo))
  }

  return (
    <>
      {spinner && <SpinnerCom />}
      <div className='fixed inset-0 bg-black bg-opacity-50 z-20 flex items-center justify-center'>
        <div className='relative' data-testid='detalle-modal'>
          <button
            className='absolute top-1 right-6 text-3xl text-gray-500 hover:text-gray-800 z-30'
            onClick={onClose}
          >
            ✕
          </button>
          <div
            className='relative bg-white rounded-xl shadow-lg max-w-md p-6'
            style={{ maxHeight: '90vh', overflowY: 'auto' }}
          >
            <h2 className='pt-4 text-2xl font-bold mb-2 text-inf7'>
              {empresa}
            </h2>

            <div className='flex items-center gap-4 mb-4'>
              {autorizado === 1 && (
                <div className='flex items-center gap-1 text-blue-600 text-sm'>
                  <FaCheckCircle />
                  <span>Comercio validado</span>
                </div>
              )}
            </div>

            <p className='text-gray-700 mb-1'>
              <strong>Zona:</strong> {zona_nombre}
            </p>
            <p className='text-gray-700 mb-4'>
              <strong>Dirección:</strong> {calle_numero}
            </p>
            <p className='text-gray-800 mb-4'>
              <strong>Servicios:</strong> {servicios || 'No especificado'}
              {telefono_whatsapp && (
                <span data-testid='telefono_whatsapp'>
                  <br />
                  <strong>WhatsApp:</strong> {telefono_whatsapp}
                </span>
              )}
            </p>
            {telefonos.length > 0 && (
              <div className='mb-4'>
                <strong className='text-gray-800'>Teléfonos:</strong>
                <ul
                  className='list-disc list-inside text-gray-700'
                  data-testid='telefonos'
                >
                  {telefonos.map((tel, idx) => (
                    <li key={idx} data-testid='telefono-item'>
                      {tel}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className='flex justify-center gap-6 mt-6  w-11/12'>
              {email_verificado && (
                <div
                  onClick={() => toggleFormulario('correo')}
                  className={`${
                    formularioActivo === 'correo' ? 'bg-inf3' : 'bg-inf4'
                  } text-white rounded-xl p-4 w-[100px] h-[100px] flex flex-col items-center justify-center cursor-pointer text-center shadow-lg`}
                >
                  <img src={IconoCorreo} alt='Correo' className='w-16 h-16' />
                  <span className='mt-3 text-xs font-medium'>
                    Enviar Correo
                  </span>
                </div>
              )}

              {latitud && longitud && (
                <div
                  onClick={() => toggleFormulario('mapa')}
                  className={`${
                    formularioActivo === 'mapa' ? 'bg-inf3' : 'bg-inf4'
                  } text-white rounded-xl p-4 w-[100px] h-[100px] flex flex-col items-center justify-center cursor-pointer text-center shadow-lg`}
                >
                  <img src={IconoMapa} alt='Mapa' className='w-16 h-16' />
                  <span className='mt-3 text-xs font-medium'>Ver Mapa</span>
                </div>
              )}

              {telefono_whatsapp && (
                <div
                  onClick={() => toggleFormulario('whatsapp')}
                  className={`${
                    formularioActivo === 'whatsapp' ? 'bg-inf3' : 'bg-inf4'
                  } text-white rounded-xl p-4 w-[100px] h-[100px] flex flex-col items-center justify-center cursor-pointer text-center shadow-lg`}
                >
                  <img
                    src={IconoWhatsApp}
                    alt='WhatsApp'
                    className='w-12 h-12'
                  />
                  <span className='mt-3 text-xs font-medium'>WhatsApp</span>
                </div>
              )}
            </div>

            {formularioActivo === 'correo' && (
              <div ref={correoRef}>
                <FormularioCorreo
                  comercioId={id}
                  nombreComercio={empresa}
                  onEnviado={() => setFormularioActivo(null)}
                />
              </div>
            )}

            {formularioActivo === 'mapa' && (
              <div ref={mapaRef}>
                <FormularioMapa latitud={latitud} longitud={longitud} />
              </div>
            )}

            {formularioActivo === 'whatsapp' && (
              <div ref={whatsappRef}>
                <FormularioWhatsapp
                  comercioId={id}
                  nombreComercio={empresa}
                  onEnviado={() => setFormularioActivo(null)}
                />
              </div>
            )}
            {!autorizado && <ReclamarComercio comercioId={id} />}
          </div>
        </div>
      </div>
      {mostrarDialogo && (
        <AcceptDialog
          mensaje={mensaje}
          onClose={() => setMostrarDialogo(false)}
        />
      )}
    </>
  )
}
