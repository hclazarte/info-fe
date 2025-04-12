import AyudaNIT from './AyudaNIT'
import AyudaCI from './AyudaCI'

const PasoValidacionIdentidad = ({
  comercio,
  nitCargado,
  ciCargado,
  handleFileUpload,
  handleValidar,
  handleSiguiente,
  errorNegocio
}) => {
  return (
    <div className='space-y-4'>
      <h2 className='text-2xl font-bold text-center mb-4'>
        Validación de Identidad
      </h2>
      <p className='text-sm text-inf1 text-justify'>
        Antes de permitirle modificar los datos de su comercio, es necesario
        validar su identidad mediante los documentos requeridos. Esta
        verificación garantiza que usted es una persona autorizada y protege su
        información de accesos no deseados. De este modo, usted podrá actualizar
        sus datos con total seguridad y confianza.
      </p>
      <div>
        <label className='block text-sm'>Empresa:</label>
        <p className='bg-inf2 text-black p-2 rounded'>{comercio.empresa}</p>
      </div>
      <div>
        <label className='block text-sm'>Imagen del NIT:</label>
        <input
          type='file'
          accept='image/jpeg, image/png, image/jpg, application/pdf'
          className='w-full bg-inf1 p-2 rounded text-black'
          onChange={(e) => handleFileUpload('nit', e.target.files[0])}
        />
      </div>
      <AyudaNIT />
      <div>
        <label className='block text-sm'>Imagen del CI:</label>
        <input
          type='file'
          accept='image/jpeg, image/png, image/jpg, application/pdf'
          className='w-full bg-inf1 p-2 rounded text-black'
          onChange={(e) => handleFileUpload('ci', e.target.files[0])}
        />
        <AyudaCI />
      </div>
      <div className='flex justify-between mt-4'>
        <button
          onClick={handleValidar}
          disabled={
            comercio?.documentos_validados === 1 || !(nitCargado && ciCargado)
          }
          className={`px-6 py-2 rounded-md text-lg font-medium ${
            comercio?.documentos_validados === 1 || !(nitCargado && ciCargado)
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-inf3 text-black hover:bg-inf5'
          }`}
        >
          Validar
        </button>
        <button
          onClick={handleSiguiente}
          disabled={!(comercio?.documentos_validados === 1)}
          className={`px-6 py-2 rounded-md text-lg font-medium ${
            comercio?.documentos_validados === 1
              ? 'bg-inf3 text-black hover:bg-inf5'
              : 'bg-gray-400 text-white cursor-not-allowed'
          }`}
        >
          Siguiente
        </button>
      </div>
      {comercio?.documentos_validados === 1 && (
        <p className='text-green-200 font-semibold text-center'>
          Registro Validado
        </p>
      )}{' '}
      {comercio?.documentos_validados !== 1 && (
        <p className='text-red-400 font-semibold text-center'>{errorNegocio}</p>
      )}
    </div>
  )
}

export default PasoValidacionIdentidad
