/* global grecaptcha */
import { useEffect, useState, useRef } from 'react'
import '../css/output.css'
import waitImg from '../img/waiting2.gif'

export default function BuzonSugerencias({ onClose }) {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    categoria: "Consulta",
    asunto: "",
    mensaje: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const sendingMsgRef = useRef(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    console.log('Cerrar')
    if (success && onClose) {
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (sendingMsgRef.current) return

    if (!formData.nombre || !formData.email || !formData.asunto || !formData.mensaje) {
      setDialogMessage("Por favor, complete todos los campos obligatorios.");
      setShowDialog(true);
      return;
    }

    // grecaptcha.enterprise.ready(async () => {
    //   const token = await grecaptcha.enterprise.execute('6Ldln-oqAAAAACslpXN9rUqQr2Bn7qXybNqY0o-i', { action: 'enviar_sugerencia' });
    //   setRecaptchaToken(token);

    //   const datosTransformados = {
    //     correo: {
    //       remitente: formData.email,
    //       asunto: "Consulta de usuario",
    //       tipo: formData.categoria.toLowerCase(),
    //       nombre: formData.nombre,
    //       cuerpo: formData.mensaje,
    //     },
    //     recaptcha_token: token,
    //   };
      
    //   try {
    //     setShowSpinner(true)
    //     sendingMsgRef.current = true
    //     const response = await fetch(`${window.infoConfig.apiUrl}/correos`, {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify(datosTransformados),
    //     });

    //     if (response.ok) {
    //       setSuccess("Mensaje enviado con éxito.");
    //       setDialogMessage("Mensaje enviado con éxito.");
    //       setShowDialog(true);
    //       setFormData({ nombre: "", email: "", categoria: "Consulta", asunto: "", mensaje: "" });
    //     } else {
    //       setDialogMessage("Hubo un problema al enviar el mensaje.");
    //       setShowDialog(true);
    //     }
    //   } catch (error) {
    //     setDialogMessage("Error de conexión. Intente nuevamente más tarde.");
    //     setShowSpinner(false)
    //     setShowDialog(true);
    //   } finally 
    //   {
    //     setShowSpinner(false)
    //     sendingMsgRef.current = false
    //   }
    // });
  
    // ✅ Simulación del resultado para maquetado
    setTimeout(() => {
      setSuccess("Mensaje enviado con éxito (simulado).");
      setDialogMessage("Mensaje enviado con éxito (modo maquetado).");
      setShowDialog(true);
      setFormData({ nombre: "", email: "", categoria: "Consulta", asunto: "", mensaje: "" });
    }, 800);
  };

  
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto max-w-md bg-inf4 pt-3 px-4 flex flex-col md:flex-row items-start">
      <div className="w-full md:w-1/2 md:pr-6 text-white">
        <h2 className="text-2xl font-medium mt-4 mb-6 text-center md:text-left">Buzón de Sugerencias</h2>
        <form onSubmit={handleSubmit} className="space-y-6 pb-20">
          <div className="space-y-2">
            <label className="block font-normal">Nombre:</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder='Juan Pérez'
              className="w-full p-2 border rounded-md text-black bg-inf2 text-lg focus:bg-white"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block font-normal">Correo Electrónico:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder='juan.perez@gmail.com'
              className="w-full p-2 border rounded-md text-black bg-inf2 text-lg focus:bg-white"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block font-normal">Categoría:</label>
            <select
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              className="w-full p-2 border rounded-md text-black bg-inf2 text-lg focus:bg-white"
            >
              <option value="Consulta">Consulta</option>
              <option value="Sugerencia">Sugerencia</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block font-normal">Asunto:</label>
            <input
              type="text"
              name="asunto"
              value={formData.asunto}
              onChange={handleChange}
              placeholder='Breve descripción del mensaje'
              className="w-full p-2 border rounded-md text-black bg-inf2 text-lg focus:bg-white"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block font-normal">Mensaje:</label>
            <textarea
              name="mensaje"
              value={formData.mensaje}
              onChange={handleChange}
              className="w-full p-4 border rounded-md text-black bg-inf2 text-lg focus:bg-white"
              rows="5"
              required
            ></textarea>
          </div>
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-inf3 text-black rounded-md text-lg font-medium hover:bg-blue-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-inf3 text-black rounded-md text-lg font-medium hover:bg-blue-600"
            >
              Enviar
            </button>
          </div>
        </form>
        <p className="mt-4 text-sm text-center text-gray-200">
          Este sitio está protegido por reCAPTCHA y se aplican la
          <a href="https://policies.google.com/privacy" className="text-blue-300 hover:underline"> Política de Privacidad </a>
          y los <a href="https://policies.google.com/terms" className="text-blue-300 hover:underline"> Términos de Servicio </a> de Google.
        </p>
      </div>
      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-inf1 p-6 rounded-lg shadow-lg text-center">
            <p className="mb-4 text-lg font-semibold">{dialogMessage}</p>
            <button onClick={handleCloseDialog} className="px-6 py-3 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600">
              Aceptar
            </button>
          </div>
        </div>
      )}
      {showSpinner && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <img className='waitingImg' src={waitImg} alt='Cargando...' />
        </div>
      )}
    </div>
  );



}
