// src/components/DialogMensaje.jsx

export default function AcceptDialog({ mensaje, onClose }) {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-inf1 p-6 rounded-lg shadow-lg text-center'>
        <p className='mb-4 text-lg text-inf6 font-semibold whitespace-pre-line'>{mensaje}</p>
        <button
          onClick={onClose}
          className='px-6 py-3 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600'
        >
          Aceptar
        </button>
      </div>
    </div>
  )
}
