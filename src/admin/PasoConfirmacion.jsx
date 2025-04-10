// Este componente no necesita props, solo muestra mensaje de cierre

const PasoConfirmacion = () => {
  return (
    <div className='space-y-6 text-center'>
      <h2 className='text-2xl font-bold mb-2'>
        ¡Gracias por registrarse!
      </h2>

      <p className='text-inf1'>
        La solicitud fue recibida correctamente. La información será revisada y actualizada en un plazo de{' '}
        <strong>24 a 48 horas hábiles</strong>.
      </p>

      <div className='text-4xl mt-4'>🎉🎉🎉</div>

      <p className='text-lg font-semibold text-inf2 mt-2'>
        ¡Le agradecemos la confianza depositada en Infomóvil!
      </p>

      <div className='text-sm text-inf1'>
        Se le notificará cuando su información esté publicada en línea.
      </div>

      <div className='mt-6'>
        <button
          className='bg-inf3 text-black px-6 py-2 rounded-md font-medium hover:bg-inf5'
          onClick={() => window.location.reload()}
        >
          Finalizar
        </button>
      </div>
    </div>
  )
}

export default PasoConfirmacion
