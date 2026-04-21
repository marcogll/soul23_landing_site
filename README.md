# soul:23 — Arquitectura de Eficiencia

Sistema de operación para negocios que buscan eliminar el caos operativo mediante tecnología autónoma.

## Identidad

- **Nombre:** soul:23 (soul, por el alma; 23, por el año de fundación)
- **Holding:** Grupo AlMa™
- **Subtítulo:** Arquitectura de Eficiencia & Ingeniería de Procesos
- **Mantra:** "Si puede ser más simple, debe ser automático."

## Qué hacemos

Diseño de sistemas operativos que:
- Organizan citas, ventas, personal y comunicación
- Eliminan procesos manuales repetitivos
- Generan reportes automáticos
- Ejecutan 24/7 sin intervención constante

No somos una agencia de marketing. Somos ingeniería aplicada para resolver problemas operativos reales.

## Páginas

- `index.html` — Homepage con servicios principales
- `acerca.html` — Acerca de soul:23, metodología y protocolos
- `servicios.html` — Todos los servicios detallados
- `paquetes.html` — Planes STARTUP, SCALE, ENTERPRISE

## Estructura técnica

```
/
├── index.html          # Homepage
├── acerca.html       # Acerca de
├── servicios.html    # Todos los servicios
├── paquetes.html    # Planes y precios
├── assets/
│   ├── css/
│   │   └── styles.css    # Estilos + tema Catppuccin
│   ├── js/
│   │   └── main.js      # Interacciones + formulario
│   └── img/
│       └── logos_soul23/  # Logos y favicon
```

## Funcionalidades

- **Navegación:** Burger menu fullscreen con overlay
- **Temas:** Dark (Mocha) / Light (Latte) con toggle
- **Formulario:** Envía a webhook configurado
- **Filtros:** MixItUp para proyectos (work)
- **Modales:** Detalles de servicios

## Paleta de colores (Catppuccin Mocha)

| Elemento | Color |
|---------|-------|
| Primary | `#89b4fa` (blue) |
| Accent 1 | `#a6e3a1` (green/sage) |
| Accent 2 | `#94e2d5` (teal) |
| Accent 3 | `#cba6f7` (mauve) |
| Accent 4 | `#f5a97f` (peach) |
| Background | `#1e1e2e` |
| Surface | `#313244` |

## Formulario

El formulario envía JSON al webhook configurado en `data-webhook-url`:

```text
https://flows.soul23.cloud/webhook/OvJ8A25svipYxC8OQ60tT1
```

## Desarrollo local

```bash
python3 -m http.server 8080
# http://127.0.0.1:8080
```

## Deploy

 hosting estático compatible:

- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages
- Firebase Hosting

## Contacto

- **Email:** hola@soul23.mx
- **WhatsApp:** +52 844 102 6472
- **Calendly:** https://calendly.com/alma_dev/30min

---

© 2026 · soul:23 · by Grupo AlMa™