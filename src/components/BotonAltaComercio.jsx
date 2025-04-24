import { Store, Plus } from 'lucide-react'
export default function BotonAltaComercio({ onClick }) {
  return (
    <button
      onClick={onClick}
      className='w-20 aspect-square flex flex-col items-center justify-center bg-inf8 text-white rounded-md hover:bg-inf3'
    >
      <Store className='w-8 h-8' />
      <span className='text-xs leading-none mt-1'>Administrar</span>
    </button>
  )
}
