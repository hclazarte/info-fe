// src/pages/admin/RegistroComercio.jsx
import { useSearchParams } from 'react-router-dom'

const RegistroComercio = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Registro de Comercio</h1>

        {token ? (
          <div>
            <p className="text-sm text-gray-600 mb-4">Token recibido:</p>
            <div className="bg-gray-100 p-2 rounded text-xs font-mono mb-6 break-all">
              {token}
            </div>

            <form className="space-y-4">
              <input
                type="text"
                placeholder="Nombre del comercio"
                className="w-full border border-gray-300 p-2 rounded"
              />
              <input
                type="email"
                placeholder="Correo electrónico"
                className="w-full border border-gray-300 p-2 rounded"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Registrar
              </button>
            </form>
          </div>
        ) : (
          <p className="text-red-500">Token no válido o ausente.</p>
        )}
      </div>
    </div>
  )
}

export default RegistroComercio
