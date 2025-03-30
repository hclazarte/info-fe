export default function Zona({
  zona,
  setZona,
  mostrarZonas,
  setMostrarZonas,
  zonas,
}) {
  return (
    <div className="w-full">
      <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 bg-white">
        <input
          type="text"
          value={zona?.descripcion || ""}
          onChange={(e) =>
            setZona((prev) => ({ ...prev, descripcion: e.target.value }))
          }
          placeholder="Zona"
          className="flex-1 focus:outline-none"
        />
        <button
          onClick={() => setMostrarZonas(!mostrarZonas)}
          className="text-inf4 ml-2"
        >
          {mostrarZonas ? "▲" : "▼"}
        </button>
      </div>
      {mostrarZonas && zonas?.length > 0 && (
        <ul className="bg-white border border-gray-300 mt-1 w-full shadow max-h-60 overflow-y-auto">
          {zonas
            .filter((z) =>
              !zona?.descripcion ||
              z.descripcion.toLowerCase().includes(zona.descripcion.toLowerCase())
            )
            .map((z) => (
              <li
                key={z.id}
                className="px-3 py-2 hover:bg-inf2 cursor-pointer"
                onClick={() => {
                  setZona(z);
                  setMostrarZonas(false);
                }}
              >
                {z.descripcion}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
