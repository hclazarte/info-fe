// src/components/Buscar.jsx
export default function Buscar({ filtrosAbiertos, setFiltrosAbiertos }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <input
        type="text"
        placeholder="Buscar comercios..."
        className="flex-1 mr-2 px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-inf4"
      />
      <button
        onClick={() => setFiltrosAbiertos(!filtrosAbiertos)}
        className="px-3 py-2 bg-inf4 text-white rounded-xl md:hidden"
      >
        {filtrosAbiertos ? "▲" : "☰"}
      </button>
    </div>
  );
}
