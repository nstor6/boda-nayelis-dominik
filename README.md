# Nayelis & Dominik — invitación de boda

Invitación en español, adaptable a móvil, sin dependencias ni proceso de compilación. Abre `dist/index.html` o sirve la carpeta `dist` con `python3 -m http.server 8000 --directory dist`.

## Incluye

- Sobre animado accesible con teclado y respeto de movimiento reducido.
- Portada, monograma provisional y decoración floral en acuarela generada para el proyecto.
- Cuenta atrás al 9 de julio de 2027, 17:30 (Oviedo, UTC+02:00). Hora provisional.
- Ventanas nativas para historia, ceremonia, recepción, vestimenta, regalos, asistencia y contacto.
- Mapas y enlaces a WhatsApp y teléfono.
- Formulario que prepara un mensaje de WhatsApp para Nayelis o Dominik. El invitado debe enviarlo: no existe base de datos ni se da por confirmada una respuesta al pulsar el botón.

## Datos pendientes

Edita `dist/config.js`: `photo`, `music`, `iban` y, si se prefiere un formulario externo, `formUrl`. Añade los archivos en `dist/assets/` y usa rutas relativas. La música comienza tras tocar el sobre y tiene botón de silencio; si no hay archivo configurado, se oculta. La foto ausente se sustituye por el monograma; nunca por una pareja inventada.

Los teléfonos suministrados están en el código y serán visibles al publicar. Mantén el repositorio privado mientras preparas los detalles. No incluyas respuestas de invitados en Git.

## Subir a GitHub

Crea un repositorio dedicado (nombre sugerido: `boda-nayelis-dominik`) y sube esta carpeta conservando su estructura. No requiere claves ni servicios externos de compilación. El contenido publicable está en `dist/`. Este paquete no publica automáticamente la web.

## Comprobaciones

`node --check dist/app.js` y `node --check dist/config.js` verifican la sintaxis. Antes de compartir la invitación, completa foto/canción/cuenta, confirma la hora de ceremonia y prueba WhatsApp y el audio en los móviles que usarán los invitados.
