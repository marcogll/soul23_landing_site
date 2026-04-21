# soul:23 Static Site

Sitio web estático para soul:23. No requiere backend, Node.js, variables de entorno ni servidor propio.

## Estructura

- `index.html`: página principal.
- `assets/css/styles.css`: estilos, tipografías y tema visual.
- `assets/js/main.js`: interacciones de UI, filtros, modales, tema y formulario estático.
- `assets/img/`: imágenes y logos.

## Uso local

Abre `index.html` directamente en el navegador.

Si prefieres servirlo localmente para probar rutas relativas:

```bash
python3 -m http.server 8080
```

Luego abre:

```text
http://127.0.0.1:8080
```

## Formulario

El formulario valida los campos en cliente y envía la solicitud como JSON al webhook configurado en el atributo `data-webhook-url` del formulario de `index.html`. El payload incluye datos de contacto, tipo de negocio, sistema requerido, objetivo y nombre del emprendimiento.

Webhook actual:

```text
https://flows.soul23.cloud/webhook/OvJ8A25svipYxC8OQ60tT1
```

## Deploy

Puedes publicar la raíz del proyecto tal cual en cualquier hosting estático:

- GitHub Pages
- Netlify
- Vercel static output
- Cloudflare Pages
- Cualquier bucket/CDN que sirva archivos HTML, CSS, JS e imágenes
