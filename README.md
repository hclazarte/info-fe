# Infomóvil Frontend

**Infomóvil** es una guía de comercios basada en un mapa que permite localizar bienes o servicios en la ciudad de manera rápida y eficiente. Proporciona información sobre zonas comerciales, categorías, teléfonos y enlaces a los comercios más relevantes.

📍 **Sitio web en producción:** [infomovil.com.bo](https://infomovil.com.bo/)\
📍 **Sitio de prueba:** [dev.infomovil.com.bo](https://dev.infomovil.com.bo/)

---

## 🔄 Despliegue

Para hacer deploy, primero conéctate al servidor:

```sh
ssh <nombre_de_usuario>@linx.infomovil.com.bo
```

Luego ejecuta el siguiente comando según el entorno:

- **Development:**
  ```sh
  /dev/info-dev/deployFE.sh <rama a instalar por defecto master>
  ```
- **Producción:**
  ```sh
  /dev/info-prod/deployFE.sh <rama a instalar por defecto master>
  ```

Si el dominio ya está configurado, la aplicación estará accesible en `https://infomovil.com.bo/`.

---

## 🛠️ Mantenimiento y troubleshooting

- **Si hay problemas con la API:**

  - Revisar la configuración en `/infomovil_fe/public/config.json` y `.env.production`.

---

## 🖥️ Backend

El backend de Infomóvil está desarrollado en **Ruby on Rails**. Puedes encontrar el código fuente e instrucciones de instalación en el siguiente repositorio:

🔗 [Repositorio del backend](https://github.com/hclazarte/info_be)

---

## 📞 Contacto y soporte

Si tienes preguntas o problemas con la aplicación, puedes contactarnos en: 📧 [**soporte@infomovil.com.bo**](mailto\:soporte@infomovil.com.bo)\

---
