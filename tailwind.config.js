/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  // safelist: [{ pattern: /.*/ }], // Incluir TODAS las clases en modo desarrollo
  theme: {
    extend: {
      colors: {
        inf1: '#fbfbfb',
        inf2: '#c3cce9',
        inf3: '#b4c9ec',
        inf4: '#527dd6',
        inf5: '#457ad3',
        inf6: '#4776d3',
        inf7: '#3a6dd3',
        inf8: '#2b52a1',
        inf_err: '#dc2626', // rojo
        inf_exi: '#16a34a', // verde
        inf_adv: '#f59e0b', // amarillo
        inf_inf: '#2563eb' // azul
      }
    }
  },
  plugins: []
}
