import { useState, useEffect, useRef } from "react";
import backgroundImage from "./img/background-image.jpg";
import Buscar from "./components/Buscar";
import Ciudad from "./components/Ciudad";
import Zona from "./components/Zona";
import EnviarMensaje from "./components/EnviarMensaje";
import Tarjeta from "./components/Tarjeta";
import Firma from "./components/Firma";

export default function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);
  const [ciudad, setCiudad] = useState("");
  const [zona, setZona] = useState("");
  const [mostrarCiudades, setMostrarCiudades] = useState(false);
  const [mostrarZonas, setMostrarZonas] = useState(false);
  const [ciudades, setCiudades] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [comercios, setComercios] = useState([]);
  
  useEffect(() => {
    fetch("/data/ciudades.json")
      .then((res) => res.json())
      .then((data) => setCiudades(data))
      .catch((err) => console.error("Error al cargar ciudades:", err));
  }, []);

  useEffect(() => {
    fetch("/data/zonas.json")
      .then((res) => res.json())
      .then((data) => setZonas(data))
      .catch((err) => console.error("Error al cargar zonas:", err));
  }, []);

  useEffect(() => {
    fetch("/data/comercios.json")
      .then((res) => res.json())
      .then((data) => setComercios(data.results))
      .catch((err) => console.error("Error al cargar comercios:", err));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen">
      <div
        className="min-h-screen"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundRepeat: "repeat",
        }}
      >
        {isMobile ? (
          <div className="opacity-90 grid grid-cols-1">
            <div className="controlesMobile">
              {/* Controles */}
              <div className="bg-inf4 p-4 col-span-1 h-full">
                <Buscar filtrosAbiertos={filtrosAbiertos} setFiltrosAbiertos={setFiltrosAbiertos} />
                <div className={`flex-col gap-y-4 w-full transition-all ${filtrosAbiertos ? "flex" : "hidden"}`}>
                  <Ciudad
                    ciudad={ciudad}
                    setCiudad={setCiudad}
                    mostrarCiudades={mostrarCiudades}
                    setMostrarCiudades={setMostrarCiudades}
                    ciudades={ciudades}
                  />
                  <Zona
                    zona={zona}
                    setZona={setZona}
                    mostrarZonas={mostrarZonas}
                    setMostrarZonas={setMostrarZonas}
                    zonas={zonas}
                  />
                  <Firma/>
                  <EnviarMensaje />
                </div>
              </div>
            </div>
            <div className="resultadosMobile">
              {/* Resultados */}
              <div className="bg-inf3 p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 col-span-1 h-full">
                {comercios.map((comercio, i) => (
                  <Tarjeta key={i} comercio={comercio} />
                ))}
              </div>
            </div>
          </div>
        ) : 
        (
          <div className="flex h-screen">
            {/* Controles Desktop */} //TODO
            <div className="w-[326px] bg-inf4 p-4 overflow-y-auto controlesDesktop">
              <Buscar filtrosAbiertos={filtrosAbiertos} setFiltrosAbiertos={setFiltrosAbiertos} />
              <div className="flex flex-col gap-y-4 w-full transition-all">
                <Firma />
                <Ciudad
                  ciudad={ciudad}
                  setCiudad={setCiudad}
                  mostrarCiudades={mostrarCiudades}
                  setMostrarCiudades={setMostrarCiudades}
                  ciudades={ciudades}
                />
                <Zona
                  zona={zona}
                  setZona={setZona}
                  mostrarZonas={mostrarZonas}
                  setMostrarZonas={setMostrarZonas}
                  zonas={zonas}
                />
                <EnviarMensaje />
              </div>
            </div>
        
            {/* Resultados Desktop */}
            <div className="flex-1 bg-inf3 p-4 overflow-y-auto resultadosDesktop">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {comercios.map((comercio, i) => (
                  <Tarjeta key={i} comercio={comercio} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
