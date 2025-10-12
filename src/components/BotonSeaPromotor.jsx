import IconoModificar from '../assets/SeaPromotor.svg?react'

export default function BotonSeaPromotor({ onClick }) {
  return (
    <button
      onClick={onClick}
      className='w-20 aspect-square flex flex-col items-center justify-center bg-inf8 text-white rounded-md hover:bg-inf3'
    >
      <img src={IconoModificar} alt='Sea Promotor' width={40} height={40} />
      <span className='text-xs leading-none mt-1'>
        Sea
        <br />
        Promotor
      </span>
    </button>
  )
}
