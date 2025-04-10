// Este componente espera props: qrPago, comprobanteCargado, setComprobanteCargado,
// handleAtras, handleSiguiente

const PasoPago = ({
  qrPago,
  comprobanteCargado,
  setComprobanteCargado,
  handleAtras,
  handleSiguiente
}) => {
  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-bold text-center mb-2'>
        Pago del Plan
      </h2>
      <p className='text-center text-sm'>
        Por favor, escanee el siguiente código QR y realice el pago correspondiente de <strong>Bs. 50</strong>. A continuación, cargue una imagen del comprobante.
      </p>

      <div className='flex justify-center'>
        <img
          src={qrPago}
          alt='QR para pago'
          className='w-60 h-60 rounded-lg shadow-md'
        />
      </div>

      <div>
        <label className='block text-sm text-center mt-4'>
          Cargar comprobante de pago:
        </label>
        <input
          type='file'
          accept='image/jpeg, image/png, image/jpg, application/pdf'
          className='w-full bg-inf1 p-2 rounded text-black'
          onChange={(e) => setComprobanteCargado(!!e.target.files.length)}
        />
      </div>

      <div className='flex justify-between mt-4'>
        <button
          onClick={handleAtras}
          className='bg-inf3 text-black px-6 py-2 rounded-md font-medium hover:bg-inf5'
        >
          Atrás
        </button>
        <button
          onClick={handleSiguiente}
          disabled={!comprobanteCargado}
          className={`px-6 py-2 rounded-md font-medium ${
            comprobanteCargado
              ? 'bg-inf3 text-black hover:bg-inf5'
              : 'bg-gray-400 text-white cursor-not-allowed'
          }`}
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}

export default PasoPago
