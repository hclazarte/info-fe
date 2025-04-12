import { useState } from 'react'

function AyudaNIT() {
  const [mostrarAyuda, setMostrarAyuda] = useState(false)

  return (
    <div className='mt-2 text-sm text-inf1'>
      <button
        type='button'
        onClick={() => setMostrarAyuda(!mostrarAyuda)}
        className='underline text-yellow-400 hover:text-yellow-200 focus:outline-none'
      >
        {mostrarAyuda ? 'Ocultar ayuda' : '¿Dónde obtener el NIT digitalizado?'}
      </button>
      {mostrarAyuda && (
        <div className='mt-2 bg-inf2 text-black p-3 rounded shadow'>
          <p>
            Usted puede obtener su NIT en formato digital ingresando al sistema
            de <strong>Impuestos Nacionales</strong>, dentro del módulo{' '}
            <strong>Padrón Biométrico Digital</strong>.
          </p>
          <p className='mt-1'>
            Debe escoger el trámite{' '}
            <strong>Reposición de Documento de Exhibición</strong>, que es
            gratuito y le permite imprimir su NIT en línea.
          </p>
          <p className='mt-1 font-medium'>
            El archivo debe estar en formato PDF o imagen y no debe superar los
            20 MB.
          </p>
        </div>
      )}
    </div>
  )
}

export default AyudaNIT
