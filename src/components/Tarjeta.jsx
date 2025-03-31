import React from 'react';

const truncarTexto = (texto, longitudMaxima = 80) => {
  if (!texto) return '';
  if (texto.length <= longitudMaxima) return texto;
  return texto.slice(0, longitudMaxima) + '...';
};

const Tarjeta = ({ comercio }) => {truncarTexto
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
      <div className="px-6 py-4">
        {/* Nombre de la Empresa */}
        <div className="font-bold text-xl mb-2">{comercio.empresa}</div>
        
        {/* Descripción de Servicios */}
        <p className="text-gray-700 text-base">
          {truncarTexto(comercio.servicios)}
        </p>

        {/* Dirección */}
        <p className="text-gray-600 text-sm mt-2">
          {comercio.calle_numero}, {comercio.zona_nombre}
        </p>

        {/* Teléfonos */}
        <p className="text-gray-600 text-sm">
          {comercio.telefono1}
          {comercio.telefono2 ? `, ${comercio.telefono2}` : ''}
          {comercio.telefono3 ? `, ${comercio.telefono3}` : ''}
        </p>
      </div>
    </div>
  );
};

export default Tarjeta;
