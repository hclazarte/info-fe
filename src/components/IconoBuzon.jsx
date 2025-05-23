import IconoCorreo from '../assets/Correo.svg?react'

export default function IconoBuzon({ onClick }) {
  return (
    <button
      onClick={onClick}
      className='w-20 aspect-square flex flex-col items-center justify-center bg-inf8 text-white rounded-md hover:bg-inf3'
    >
      <img src={IconoCorreo} alt='Correo' width={40} height={40} />
      <span className='text-xs leading-none mt-1'>Contactar Infomóvil</span>
    </button>
  )
}
