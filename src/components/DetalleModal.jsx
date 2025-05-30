import { useState } from 'react'
import AcceptDialog from './common/AcceptDialog'
import SpinnerCom from '../components/common/SpinnerCom'
import { FaWhatsapp, FaCheckCircle } from 'react-icons/fa'
import IconoCorreo from '../assets/CorreoUsuario.svg?react'
import FormularioCorreo from './FormularioCorreo'
import ReclamarComercio from './ReclamarComercio'

export default function DetalleModal({ comercio, onClose }) {
  const [mensaje, setMensaje] = useState('')
  const [mostrarDialogo, setMostrarDialogo] = useState(false)
  const [spinner, setSpinner] = useState(false)
  const [mostrarFormularioCorreo, setMostrarFormularioCorreo] = useState(false)

  if (!comercio) return null

  const {
    empresa,
    zona_nombre,
    calle_numero,
    servicios,
    telefono1,
    telefono2,
    telefono_whatsapp,
    id,
    autorizado,
    email_verificado
  } = comercio

  const telefonos = [telefono1, telefono2].filter(Boolean)

  return (
    <>
      {spinner && <SpinnerCom />}
      <div className='fixed inset-0 bg-black bg-opacity-50 z-20 flex items-center justify-center'>
        <div
          className='bg-white rounded-xl shadow-lg w-11/12 max-w-md p-6 relative'
          style={{ maxHeight: '90vh', overflowY: 'auto' }}
        >
          {/* Cerrar */}
          <button
            className='absolute top-2 right-3 text-3xl text-gray-500 hover:text-gray-800'
            onClick={onClose}
          >
            ✕
          </button>

          {/* Título */}
          <h2 className='pt-4 text-2xl font-bold mb-2 text-inf7'>{empresa}</h2>

          {/* Estado del comercio: validado, ubicación, etc. */}
          <div className='flex items-center gap-4 mb-4'>
            {autorizado === 1 && (
              <div className='flex items-center gap-1 text-blue-600 text-sm'>
                <FaCheckCircle />
                <span>Comercio validado</span>
              </div>
            )}

            {/* Aquí se podrán añadir más íconos en el futuro, por ejemplo: */}
            {/* 
              {latitud && longitud && (
                  <div className='flex items-center gap-1 text-gray-600 text-sm'>
                    <FaMapMarkerAlt />
                    <span>Ubicación disponible</span>
                  </div>
                )} 
                */}
          </div>

          {/* Dirección */}
          <p className='text-gray-700 mb-1'>
            <strong>Zona:</strong> {zona_nombre}
          </p>
          <p className='text-gray-700 mb-4'>
            <strong>Dirección:</strong> {calle_numero}
          </p>

          {/* Servicios */}
          <p className='text-gray-800 mb-4'>
            <strong>Servicios:</strong> {servicios || 'No especificado'}
          </p>

          {/* Teléfonos */}
          {telefonos.length > 0 && (
            <div className='mb-4'>
              <strong className='text-gray-800'>Teléfonos:</strong>
              <ul className='list-disc list-inside text-gray-700'>
                {telefonos.map((tel, idx) => (
                  <li key={idx}>{tel}</li>
                ))}
              </ul>
            </div>
          )}
          {/* WhatsApp si autorizado */}
          {autorizado === 1 && telefono_whatsapp && (
            <div className='mb-4 flex items-center gap-2'>
              <FaWhatsapp className='text-green-500 text-2xl' />
              <a
                href={`https://wa.me/${telefono_whatsapp}`}
                target='_blank'
                rel='noopener noreferrer'
                className='text-inf_exi underline font-medium'
              >
                Enviar mensaje por WhatsApp
              </a>
            </div>
          )}
          {email_verificado && (
            <div
              style={{
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                fontSize: '0.7rem',
                lineHeight: 1,
                gap: '1px',
                cursor: 'pointer'
              }}
              onClick={() => setMostrarFormularioCorreo((prev) => !prev)}
            >
              <img src={IconoCorreo} alt='Correo' width={80} height={80} />
              <strong style={{ marginTop: '1px' }}>Enviar correo</strong>
            </div>
          )}
          {mostrarFormularioCorreo && (
            <FormularioCorreo
              comercioId={id}
              nombreComercio={empresa}
              onEnviado={() => setMostrarFormularioCorreo(false)}
            />
          )}
          {/* Reclamar comercio solo si NO está autorizado */}
          {!autorizado && <ReclamarComercio comercioId={id} />}
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
