## Tecnologías utilizadas en Infomóvil

Infomóvil es una plataforma desarrollada íntegramente por una sola persona en un período de seis meses. Combina un backend en Ruby on Rails con un frontend moderno en React, y se ha desplegado en producción siguiendo buenas prácticas de arquitectura, integración continua, testing automatizado y seguridad.

A continuación se detallan las tecnologías y herramientas utilizadas en su construcción, agrupadas por componente y función:

### Backend: Ruby on Rails

El backend fue construido en **Ruby on Rails 7.0.8.4**, usando **Ruby 3.2.3**. Entre los aspectos técnicos más relevantes:

- **Base de datos Oracle**: mediante `activerecord-oracle_enhanced-adapter` y `ruby-oci8`, se realiza la conexión con una base de datos heredada. En desarrollo también se utilizó SQLite.
- **Job Processing**: se emplea `Sidekiq` para el procesamiento asincrónico de tareas como el envío de correos y validación de documentos.
- **Generación de PDF**: los formularios de inscripción se generan automáticamente con `Prawn`, `Prawn-table` y `CombinePDF`.
- **OCR y procesamiento de imágenes**: se utilizan `RTesseract` y `MiniMagick` para extraer datos de imágenes escaneadas del NIT, CI y comprobantes.
- **Seguridad y autenticación**:
  - Implementación de autenticación basada en `JWT`, con tokens personalizados.
  - Configuración de CORS mediante `rack-cors`.
  - Protección de rutas y tokens temporales de inscripción.
- **API REST**: se utilizan `Faraday` y `RestClient` para consumir y exponer endpoints externos.
- **Control de errores y trazabilidad**: integración con Jenkins para registrar errores en flujos de seguimiento.
- **Envío de WhatsApps**: conexión directa con la Cloud API de Meta para enviar y recibir mensajes desde la plataforma.
- **Correo electrónico**: uso de `ActionMailer` con Sidekiq para el envío de confirmaciones, formularios y notificaciones automatizadas.
- **Zonificación geográfica**: cálculo y almacenamiento de geometría SDO en Oracle, con endpoints que permiten consultar comercios por ciudad, zona o coordenadas.
- **Crawlers y migraciones**: integración con SEPREC para importar datos oficiales mediante procesos periódicos en segundo plano.
- **Protección contra bots**: integración condicional de reCAPTCHA desde backend mediante variable de entorno.

### Frontend: React + Vite

El frontend fue desarrollado con **React 19** y **Vite 6**, con un diseño modular y orientado a componentes reutilizables. Entre sus características destacan:

- **Routing**: implementación completa de navegación mediante `react-router-dom`.
- **Estilos**: uso de `Tailwind CSS` con reglas personalizadas, ordenadas automáticamente con `prettier-plugin-tailwindcss`.
- **Pruebas end-to-end**: se emplea `Playwright` con scripts de testing que validan los flujos completos en entorno local, de desarrollo y producción.
- **Interacción con mapas**: integración con Google Maps mediante `@react-google-maps/api`.
- **Animaciones e íconos**: uso de `framer-motion`, `lucide-react` y `react-icons` para lograr una experiencia fluida y moderna.
- **Validación y feedback**:
  - Implementación de formularios multistep con validaciones estrictas de campos, imágenes y documentos.
  - Integración con reCAPTCHA visible solo cuando es necesario.
- **Comunicación con la API**: se utiliza `axios` para la interacción con el backend, incluyendo carga y validación de documentos, envío de sugerencias, reclamos y mensajes.

### Infraestructura y despliegue

- **Contenedores Docker**: backend y servicios auxiliares (como Sidekiq y la base de datos) corren en contenedores Docker.
- **Despliegue con Jenkins**: se ha automatizado el despliegue mediante scripts ejecutables por SSH desde un job de Jenkins.
- **Servidor web**: uso de Nginx como proxy inverso, con dominios configurados para cada entorno (`dev.infomovil.com.bo`, `infomovil.com.bo`).
- **Certificados SSL**: manejo de HTTPS mediante Certbot, con renovación automatizada.
- **Separación de entornos**: existen configuraciones específicas para desarrollo, staging y producción.

### Funcionalidades clave desarrolladas

La plataforma Infomóvil cuenta con las siguientes funcionalidades implementadas desde cero:

- Validación automática de documentos (NIT, CI, comprobante) mediante OCR.
- Verificación de coincidencia de datos extraídos con registros oficiales.
- Procesamiento de campañas de vales y correos masivos.
- Seguimiento de clics en comercios y generación de métricas.
- Conversaciones bidireccionales vía WhatsApp con registro interno.
- Formulario de inscripción personalizado con carga de documentos y validaciones progresivas.
- Buzón de sugerencias, contacto a comercios y reclamos.
- Endpoint unificado `/inicio/objetos` con carga optimizada y datos cacheados.

---

Este proyecto demuestra un dominio avanzado de Ruby on Rails, arquitectura de servicios, pruebas automatizadas, integración con sistemas externos y despliegue en producción. Todos los aspectos han sido diseñados y ejecutados por una única persona [Héctor Lazarte Prada](https://www.linkedin.com/in/hector-lazarte-prada/), abarcando desde el modelado de datos hasta la experiencia de usuario final.
