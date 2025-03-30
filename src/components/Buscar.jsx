import { useState } from "react";

export default function Buscar({ filtrosAbiertos, setFiltrosAbiertos }) {
  const [busqueda, setBusqueda] = useState("");

  const handleBorrar = () => {
    setBusqueda("");
  };
  
  return (
    <div className="flex items-center justify-between mb-4">
      <input
        type="text"
        placeholder="Buscar comercios..."
        className="flex-1 mr-2 px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-100"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      {busqueda && (
        <button
          onClick={handleBorrar}
          className="pb-2 px-4 mr-4 bg-inf8 hover:bg-inf3 text-white rounded-xl md:hidden text-4xl text-center"
        >
          x
        </button>
      )}
      <button
        onClick={() => setFiltrosAbiertos(!filtrosAbiertos)}
        className="pb-2 px-2 bg-inf8 hover:bg-inf3 text-white rounded-xl md:hidden text-4xl"
      >
        {filtrosAbiertos ? "▲" : "☰"}
      </button>
    </div>
  );
}
