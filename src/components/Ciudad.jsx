export default function Ciudad({
  ciudad,
  setCiudad,
  mostrarCiudades,
  setMostrarCiudades,
  ciudades,
}) {
  return (
    <div className="w-full">
      <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 bg-white">
        <input
          type="text"
          value={ciudad?.ciudad || ""}
          onChange={(e) =>
            setCiudad((prev) => ({ ...prev, ciudad: e.target.value }))
          }
          placeholder="Ciudad"
          className="flex-1 focus:outline-none"
        />
        <button
          onClick={() => setMostrarCiudades(!mostrarCiudades)}
          className="text-inf4 ml-2"
        >
          {mostrarCiudades ? "▲" : "▼"}
        </button>
      </div>
      {mostrarCiudades && ciudades?.length > 0 && (
        <ul className="bg-white border border-gray-300 mt-1 w-full shadow max-h-60 overflow-y-auto">
          {ciudades
            .filter((c) =>
              !ciudad?.ciudad ||
              c.ciudad.toLowerCase().includes(ciudad.ciudad.toLowerCase())
            )
            .map((c) => (
              <li
                key={c.id}
                className="px-3 py-2 hover:bg-inf2 cursor-pointer"
                onClick={() => {
                  setCiudad(c);
                  setMostrarCiudades(false);
                }}
              >
                {c.ciudad}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
