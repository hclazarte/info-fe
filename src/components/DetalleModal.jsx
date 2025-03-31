import React from "react";

export default function DetalleModal({ comercio, onClose }) {
  if (!comercio) return null;

  const {
    empresa,
    zona_nombre,
    calle_numero,
    servicios,
    telefono1,
    telefono2,
    telefono3,
  } = comercio;

  const telefonos = [telefono1, telefono2, telefono3].filter(Boolean);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg w-11/12 max-w-md p-6 relative">
        {/* Cerrar */}
        <button
          className="absolute top-2 right-3 text-2xl text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Título */}
        <h2 className="text-2xl font-bold mb-2 text-inf7">{empresa}</h2>

        {/* Dirección */}
        <p className="text-gray-700 mb-1">
          <strong>Zona:</strong> {zona_nombre}
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Dirección:</strong> {calle_numero}
        </p>

        {/* Servicios */}
        <p className="text-gray-800 mb-4">
          <strong>Servicios:</strong> {servicios || "No especificado"}
        </p>

        {/* Teléfonos */}
        {telefonos.length > 0 && (
          <div className="mb-2">
            <strong className="text-gray-800">Teléfonos:</strong>
            <ul className="list-disc list-inside text-gray-700">
              {telefonos.map((tel, idx) => (
                <li key={idx}>{tel}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
