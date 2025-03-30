import Tarjeta from "./Tarjeta";

export default function Tarjetas({ comercios }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 m-0 p-0">
      {comercios.map((comercio, i) => (
        <Tarjeta key={i} comercio={comercio} />
      ))}
    </div>
  );
}
