import IconoAlta from '../assets/AgregarComercio.svg?react'

export default function BotonAltaComercio({ onClick }) {
  return (
    <button
      onClick={onClick}
      className='w-20 aspect-square flex flex-col items-center justify-center bg-inf8 text-white rounded-md hover:bg-inf3'
    >
      <img src={IconoAlta} alt='Correo' width={40} height={40} />
      <span className='text-xs leading-none mt-1'>Registrar Comercio</span>
    </button>
  )
}
