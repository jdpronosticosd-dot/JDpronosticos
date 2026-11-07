# Pick Diario

Landing page responsive para promocionar picks deportivos gratuitos. Está hecha con **HTML5, Tailwind CSS y JavaScript vanilla**. No necesita frameworks ni CDN: los estilos y las fuentes se cargan localmente.

Tipografías: **Barlow Condensed** para títulos y **Manrope** para texto.

> Paleta actual: uva eléctrica `#0F0917` + verde neón `#8AFF3C` + violeta `#C084FC`. Puedes comparar las 10 propuestas en `paletas.html`.

## Estructura de la carpeta

- `index.html`: página principal.
- `assets/`: CSS compilado, fuentes y favicon.
- `js/`: configuración, picks y lógica.
- `logo/`: carpeta para el logo. Incluye una propuesta provisional y una guía de nombres.
- `paletas.html`: visor de las 10 propuestas de color.
- `src/` y `tailwind.config.js`: fuente de Tailwind para editar estilos.

## Qué incluye

- Pick del día dinámico: muestra el pick cuya fecha coincide con hoy. Si no hay uno nuevo, indica que es la última publicación.
- Mercado, cuota, análisis, condiciones, stake sugerido y ficha del partido.
- Cuenta regresiva diaria y botones para copiar y compartir el pick.
- Enlaces a Telegram, Instagram y TikTok, más una galería visual de deportes y balones.
- Menú móvil, acordeón de preguntas frecuentes, navegación por secciones y animaciones suaves.
- Avisos de juego responsable, +18 y enlace a Coljuegos.
- Diseño responsive con puntos de control en 320, 390, 768, 1024 y 1440 px.

## Abrir la página

Abre `index.html` con el navegador. No hace falta servidor para visualizarla.

## Personalización rápida

### 1. Marca y redes sociales

Edita `js/config.js`:

```js
window.SITE_CONFIG = {
  brand: "Pick Diario",
  handle: "@pickdiario",
  email: "hola@pickdiario.com",
  socials: {
    telegram: {
      label: "Telegram",
      handle: "@pickdiario",
      url: "https://t.me/pickdiario",
    },
    // ...
  },
};
```

Cambia las URL y los handles por los reales. Los enlaces se actualizan en toda la página automáticamente.

### 2. Publicar el pick de cada día

Edita `js/picks.js`. Cada objeto es un pick. El más importante es el que tiene la fecha de hoy:

```js
{
  id: "PD-1105-NAL",
  date: "2026-11-05",                 // AAAA-MM-DD
  sport: "Fútbol",
  competition: "Liga BetPlay Dimayor",
  kickoff: "20:10",
  timezone: "COT",
  venue: "Atanasio Girardot, Medellín",
  home: { name: "Atlético Nacional", short: "NAL", color: "#2f7d32", textColor: "#f4f1e6" },
  away: { name: "Millonarios", short: "MIL", color: "#1e3a8a", textColor: "#f4f1e6" },
  selection: "Atlético Nacional",
  market: "Gana en el tiempo reglamentario",
  typeShort: "Combinada",
  typeLong: "Combinada de 4",
  odds: "3.10",
  stake: "1% – 2% de tu banca",
  risk: "Medio",
  analysis: "Texto del análisis...",
  keys: [
    { icon: "target", title: "Localía", text: "..." }
  ],
  conditions: [
    { icon: "flag", label: "Resultado", value: "Nacional gana en los 90 minutos" },
    { icon: "corner", label: "Córners", value: "Más de 8.5 en el partido" }
  ]
}
```

Los `icon` disponibles son: `flag`, `corner`, `clock`, `ball`, `target`, `chart`, `wallet`, `shield`, `alert` y `spark`.

> **Importante:** los picks incluidos son datos de muestra con fechas del 5 al 11 de noviembre de 2026. Reemplázalos por partidos y cuotas reales antes de publicar. Una página estática no publica sola: cada día debes agregar el nuevo pick y subir el cambio a tu hosting.

### 3. Colores, tipografía y estilos

- `tailwind.config.js`: colores, fuentes, sombras y animaciones.
- `src/input.css`: estilos base y componentes reutilizables.

Si modificas esos archivos, reconstruye el CSS:

```bash
npm install
npm run build:css
```

Para desarrollo:

```bash
npm run watch:css
```

## Publicar en internet

Puedes subir la carpeta a **Netlify Drop, Vercel, GitHub Pages o cualquier hosting estático**. Los archivos necesarios para producción son:

- `index.html`
- `assets/` (CSS, fuentes y favicon)
- `js/` (configuración, picks y lógica)

`src/`, `tailwind.config.js`, `package.json` y `node_modules/` solo son necesarios si vas a editar y recompilar los estilos.

## Antes de lanzar

- Reemplaza todos los datos de muestra y verifica partidos, horarios y cuotas.
- Cambia la marca, el correo y los enlaces sociales en `js/config.js`.
- Revisa la normativa local sobre publicidad de apuestas y afiliación. En Colombia, consulta los requisitos de Coljuegos.
- Mantén visible el aviso de +18 y no prometas ganancias garantizadas.
- Si añades enlaces de afiliado, identifícalos de forma clara.
- Publica términos, privacidad y un canal de contacto real.

## Accesibilidad

La página incluye navegación por teclado, textos alternativos para iconos, foco visible, `aria-expanded` en el menú, enlace para saltar al contenido y soporte para `prefers-reduced-motion`. Los colores actuales mantienen contraste AA en los textos principales; si cambias la paleta, vuelve a comprobar el contraste y los estados de foco.

---

**Aviso:** este proyecto es una plantilla informativa. Las apuestas conllevan riesgo y pueden causar adicción. Solo para mayores de 18 años.
