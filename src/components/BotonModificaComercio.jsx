import IconoModificar from '../assets/EditarComercio.svg?react';

export default function BotonModificaComercio({ onClick }) {
  return (
    <button
      onClick={onClick}
      className='w-20 aspect-square flex flex-col items-center justify-center bg-inf8 text-white rounded-md hover:bg-inf3'
    >
      <img src={IconoModificar} alt="Correo" width={40} height={40} />
      <span className='text-xs leading-none mt-1'>Modificar Comercio</span>
    </button>
  )
}
