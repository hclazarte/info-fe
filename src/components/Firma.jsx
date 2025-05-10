import FirmaSvg from '../assets/Firma.svg?react'
export default function Firma() {
  return (
    <div className='mb-4'>
      <img
        src={FirmaSvg}
        alt='Correo'
        style={{
          width: '80%',
          maxWidth: '400px', // opcional, limita el tamaño si deseas
          display: 'block',
          margin: '0 auto',
          height: 'auto' // asegura que no se deforme
        }}
      />
    </div>
  )
}
