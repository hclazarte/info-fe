import { useState } from "react";

export default function Buscar({ filtrosAbiertos, setFiltrosAbiertos }) {
  const [busqueda, setBusqueda] = useState("");

  const handleBorrar = () => {
    setBusqueda("");
  };

  return (
    <div className="flex items-center gap-2 mb-4">
      <input
        type="text"
        placeholder="Buscar comercios..."
        className="flex-1 px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-100"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {busqueda && (
        <button
          onClick={handleBorrar}
          className="px-4 py-2 bg-inf8 hover:bg-inf3 text-white rounded-xl text-2xl"
        >
          x
        </button>
      )}

      <button
        onClick={() => setFiltrosAbiertos(!filtrosAbiertos)}
        className="px-3 py-2 bg-inf8 hover:bg-inf3 text-white rounded-xl text-3xl md:hidden"
      >
        {filtrosAbiertos ? "▲" : "☰"}
      </button>
    </div>
  );
}
