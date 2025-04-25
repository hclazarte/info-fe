import adminIcon from '../img/admin-icon.png'

export default function BotonAltaComercio({ onClick }) {
  return (
    <button
      onClick={onClick}
      className='w-20 aspect-square flex flex-col items-center justify-center bg-inf8 text-white rounded-md hover:bg-inf3'
    >
      <img src={adminIcon} alt='Administrar' className='w-8 h-8' />
      <span className='text-xs leading-none mt-1'>Administrar</span>
    </button>
  )
}
