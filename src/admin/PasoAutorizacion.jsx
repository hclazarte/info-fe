// Este componente espera props: autorizado, setAutorizado, handleAtras, handleSiguiente

const PasoAutorizacion = ({ autorizado, setAutorizado, handleAtras, handleSiguiente }) => {
  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-bold text-center mb-2'>
        Autorización
      </h2>
      <p className='text-center'>
        ¿Autoriza la publicación de esta información en Internet?
      </p>
      <div className='flex justify-center'>
        <label className='flex items-center gap-2'>
          <input
            type='checkbox'
            checked={autorizado}
            onChange={(e) => setAutorizado(e.target.checked)}
          />
          Sí, autorizo
        </label>
      </div>
      <div className='flex justify-between mt-4'>
        <button
          onClick={handleAtras}
          className='bg-inf3 text-black px-6 py-2 rounded-md font-medium hover:bg-inf5'
        >
          Atrás
        </button>
        <button
          disabled={!autorizado}
          className={`px-6 py-2 rounded-md font-medium ${
            autorizado
              ? 'bg-inf3 text-black hover:bg-inf5'
              : 'bg-gray-400 text-white cursor-not-allowed'
          }`}
          onClick={handleSiguiente}
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}

export default PasoAutorizacion
