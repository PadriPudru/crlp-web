# Plantilla Web Club de Rugby — Guía para Agente Claude

Este documento explica el proyecto completo para que puedas replicarlo en otro club de rugby sin partir de cero. El proyecto original es el Club de Rugby Las Palmas (CRLP).

---

## Qué es este proyecto

Web pública de un club de rugby + panel de administración para editar contenidos sin tocar código. Desplegado gratis en Render (hosting) + Turso (base de datos SQLite en la nube).

**URL de ejemplo:** la que Render asigne al servicio `crlp-rugby`
**Panel admin:** `<dominio>/admin`

---

## Stack técnico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19 + Vite 8 (plain JS, sin TypeScript) |
| Routing | React Router DOM v7 |
| Backend | Node.js 22 + Express 4 |
| Base de datos (local dev) | `@libsql/client` apuntando a fichero `.db` local |
| Base de datos (producción) | Turso (LibSQL hosted, plan gratuito) |
| Hosting | Render (plan gratuito, Node runtime) |
| Fuentes | Google Fonts: Saira Condensed (títulos) + Archivo (cuerpo) |
| CSS | Vanilla CSS con custom properties, sin framework |

---

## Estructura de ficheros

```
crlp-react/
├── public/
│   ├── favicon.svg
│   ├── icons.svg
│   └── logo_crlp.png          ← Logo del club (PNG, puede tener fondo blanco)
├── src/
│   ├── index.css               ← TODO el CSS de la web pública
│   ├── App.jsx                 ← Enrutado principal (Site + Admin)
│   ├── main.jsx
│   ├── hooks/
│   │   └── useReveal.js        ← IntersectionObserver para animaciones scroll
│   ├── data/
│   │   └── eventos.js          ← Datos de fallback estáticos (no se usan en prod)
│   ├── components/
│   │   ├── Nav.jsx             ← Barra de navegación fija
│   │   ├── Hero.jsx            ← Sección portada (fetch /api/config)
│   │   ├── Events.jsx          ← Agenda con filtros (fetch /api/eventos)
│   │   ├── Values.jsx          ← Valores del club (fetch /api/valores)
│   │   ├── Teams.jsx           ← Tarjetas de equipos (fetch /api/equipos)
│   │   ├── JoinSection.jsx     ← Sección "únete" (fetch /api/config)
│   │   └── Footer.jsx          ← Pie con redes sociales
│   └── admin/
│       ├── admin.css           ← CSS del panel de admin
│       ├── Admin.jsx           ← Shell del admin con tabs
│       ├── AdminEventos.jsx    ← CRUD de agenda
│       ├── AdminEquipos.jsx    ← Edición de equipos
│       ├── AdminValores.jsx    ← Edición de valores
│       ├── AdminTextos.jsx     ← Edición de textos hero + únete
│       └── useToast.jsx        ← Hook de notificaciones (IMPORTANTE: extensión .jsx)
├── server/
│   ├── package.json            ← "type": "commonjs", deps: express, cors, @libsql/client
│   ├── index.js                ← API Express + sirve el dist en producción
│   └── db.js                   ← Conexión DB + init (crea tablas + seed inicial)
├── index.html                  ← lang="es", Google Fonts, título del club
├── vite.config.js              ← Proxy /api → localhost:3001 en desarrollo
├── package.json                ← Scripts + TODAS las deps (root + server) para Render
├── render.yaml                 ← Configuración de despliegue en Render
└── .gitignore                  ← Excluye node_modules, dist, *.db, .env
```

---

## Base de datos — Esquema y seed

El fichero `server/db.js` crea las tablas y las rellena con datos de ejemplo si están vacías.

### Tabla `eventos`
```sql
CREATE TABLE eventos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,        -- 'partido' | 'playa' | 'social'
  day TEXT NOT NULL,         -- '31'
  month TEXT NOT NULL,       -- 'May'
  title TEXT NOT NULL,
  place TEXT NOT NULL,
  note TEXT NOT NULL,
  time TEXT NOT NULL,        -- '12:00'
  sort_order INTEGER DEFAULT 0
)
```

### Tabla `equipos`
```sql
CREATE TABLE equipos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,   -- 'masculino' | 'femenino'  ← controla el estilo visual
  name TEXT NOT NULL,
  place TEXT NOT NULL,
  training TEXT NOT NULL,
  extra TEXT NOT NULL
)
```
El slug `masculino` usa fondo azul marino y el slug `femenino` usa azul más vivo. Si añades un tercer equipo con slug diferente, cae al estilo `masculino` por defecto (ver `TEAM_STYLE` en `Teams.jsx`).

### Tabla `valores`
```sql
CREATE TABLE valores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,   -- 'companerismo' | 'energia' | 'cantera'
  title TEXT NOT NULL,
  description TEXT NOT NULL
)
```
Cada slug tiene un icono SVG hardcodeado en `Values.jsx` (`ICONS[slug]`). Si añades un valor nuevo con slug diferente, no mostrará icono (queda sin icono, no rompe).

### Tabla `config`
Pares `key/value` para textos editables. Claves actuales:
```
hero_eyebrow        — "Club de Rugby Las Palmas · Desde 1987"
hero_title1         — "Inspirar y unir"
hero_title2         — "a través del rugby"
hero_subtitle       — Texto descriptivo del hero
join_title_pre      — "¿Te atreves con el"
join_title_highlight — "oval"
join_title_post     — "?"
join_description    — Texto de la sección únete
join_instagram      — URL de Instagram
```

---

## API REST (server/index.js)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/eventos` | Lista todos los eventos ordenados |
| POST | `/api/eventos` | Crea evento nuevo |
| PUT | `/api/eventos/:id` | Edita evento |
| DELETE | `/api/eventos/:id` | Borra evento |
| GET | `/api/equipos` | Lista equipos |
| PUT | `/api/equipos/:id` | Edita equipo |
| GET | `/api/valores` | Lista valores |
| PUT | `/api/valores/:id` | Edita valor |
| GET | `/api/config` | Devuelve `{key: value, ...}` |
| PUT | `/api/config` | Actualiza uno o varios keys |

En producción el servidor también sirve el `dist/` de React y tiene un catch-all para React Router.

---

## Sistema de diseño CSS

### Custom properties (variables)
```css
--navy:  #0a1a33   /* fondo principal oscuro */
--navy2: #0f244a   /* fondo secundario */
--navy3: #143f94   /* azul medio */
--blue:  #1f5fd6   /* azul brillante */
--yellow: #ffd60a  /* amarillo acento */
--paper: #eef1f5   /* casi blanco, fondo secciones claras */
--grey:  #9aa6b5   /* texto secundario */
--line:  rgba(238,241,245,.14) /* bordes sutiles */
```

### Fuentes
- **Saira Condensed 700/900** — títulos, nav, botones (clase `.display`, `.kicker`)
- **Archivo** — cuerpo de texto

### Animaciones de scroll
Clase `.reveal` = invisible. Clase `.reveal.in` = visible con transición.
- Contenido estático: `useReveal([])` en `App.jsx` lo activa al montar.
- Contenido cargado vía API (Events, Values, Teams): cada componente llama a `observe()` dentro del `.then()` del fetch, con `setTimeout(observe, 50)` para esperar al render de React.
- **Regla crítica**: si un componente carga datos async y tiene `.reveal`, DEBE tener su propio `observe()` local después del `setState`.

### Logo del club en fondos oscuros
El logo PNG tiene fondo blanco. Para usarlo como decoración en fondos oscuros (hero, tarjetas de equipo) se usa:
```css
filter: invert(1) grayscale(1);
mix-blend-mode: screen;
opacity: 0.18-0.20;
```
Para fondos claros (sección únete, papel):
```css
mix-blend-mode: multiply;
opacity: 0.12;
```

---

## Cómo adaptar para otro club

### 1. Textos e identidad

Busca y reemplaza globalmente:
- `CRLP` / `Club de Rugby Las Palmas` → nombre del nuevo club
- `Las Palmas de Gran Canaria` → ciudad
- `Desde 1987` → año de fundación
- URLs de Instagram/Facebook en `Footer.jsx` y seed de `config`

### 2. Colores

En `src/index.css` cambia las custom properties de `:root`. El color `--navy` es el fondo dominante, `--yellow` es el acento. Ajusta también los fondos de las tarjetas de equipo en `Teams.jsx` (`background: '#11294f'` y `'#143f94'`).

### 3. Logo

Pon el logo del club en `public/logo_crlp.png` (o cambia el nombre y actualiza todas las referencias `src="/logo_crlp.png"`). Si el logo tiene fondo transparente, puedes eliminar los filtros CSS del apartado anterior y usar simplemente `opacity`.

### 4. Equipos

Edita el seed en `server/db.js`. Los slugs `masculino` y `femenino` tienen estilo predefinido en `Teams.jsx`. Para añadir un tercero (p.ej. `juvenil`) hay que añadir una entrada en `TEAM_STYLE` en ese mismo fichero.

### 5. Valores

Edita título, descripción e iconos. Los iconos SVG están hardcodeados en `Values.jsx` en el objeto `ICONS`. Cada clave es el slug del valor. Puedes añadir/quitar libremente.

### 6. Ilustración del hero

En `Hero.jsx` hay un SVG grande con fondo degradado, líneas decorativas y una figura de jugador. Para otro club puedes:
- Dejarlo como está (es genérico)
- Reemplazar toda la etiqueta `<svg className="hero-svg">` por una imagen propia
- Cambiar solo los colores del degradado (actualmente azul marino → navy)

---

## Configuración de desarrollo local

```bash
# 1. Instalar dependencias
npm install
cd server && npm install && cd ..

# 2. Terminal 1: backend (crea crlp.db automáticamente con seed)
node server/index.js

# 3. Terminal 2: frontend (proxy /api → localhost:3001 via vite.config.js)
npm run dev
```

Accede a `http://localhost:5173` (web) y `http://localhost:5173/admin` (admin).

---

## Despliegue en Render + Turso (gratuito)

### Turso (base de datos)

1. Crear cuenta en turso.tech (sin tarjeta de crédito)
2. Crear una base de datos: `turso db create nombre-del-club`
3. Obtener URL: `turso db show nombre-del-club --url` → `libsql://...`
4. Obtener token: `turso db tokens create nombre-del-club` → string largo

### Render (hosting)

1. Crear cuenta en render.com
2. New → Web Service → conectar repositorio GitHub
3. El fichero `render.yaml` configura todo automáticamente:
   - **Build:** `npm install && npm run build && npm install --prefix server`
   - **Start:** `node server/index.js`
   - **Runtime:** Node, plan free
4. En **Environment Variables** añadir:
   - `TURSO_URL` = la URL de Turso
   - `TURSO_TOKEN` = el token de Turso
   - `NODE_ENV` = `production` (ya está en render.yaml)
5. Manual Deploy → Deploy latest commit

### Aviso plan gratuito de Render
El servicio se "duerme" tras 15 minutos sin visitas y tarda ~20 segundos en arrancar la primera petición. Para un club pequeño es suficiente.

---

## Gotchas importantes (errores que ya ocurrieron)

### `Cannot find module 'express'` en Render
Render corre su propio `npm install` ignorando buildCommand para las deps. Solución: las dependencias del servidor (`express`, `cors`, `@libsql/client`) deben estar en el `package.json` RAÍZ, no solo en `server/package.json`.

### Secciones invisibles tras deploy (opacity:0)
Si un componente carga datos async, el IntersectionObserver de `useReveal([])` ya ha ejecutado antes de que los elementos `.reveal` existan en el DOM. Solución: cada componente async debe llamar a su propia función `observe()` en el `.then()` del fetch.

### JSX en ficheros `.js`
Vite no procesa JSX en ficheros con extensión `.js`. Cualquier fichero que use JSX (aunque sea mínimamente, como un hook que devuelve un elemento) debe tener extensión `.jsx`. El fichero `useToast.jsx` es el ejemplo de este proyecto.

### Logo PNG con fondo blanco en fondos oscuros
No usar `filter: brightness(0) invert(1)` — convierte todo a blanco uniforme y el logo desaparece. Usar `filter: invert(1) grayscale(1)` + `mix-blend-mode: screen` para fondos oscuros.

### Node.js version
El servidor usa `@libsql/client` que requiere Node 18+. El proyecto especifica `>=22.5.0` en `engines`. Render usa la versión de `.nvmrc` (fichero con contenido `22`).

---

## Panel de administración

Accesible en `/admin`. Sin autenticación (añadir si el club lo necesita).

| Tab | Qué permite |
|-----|-------------|
| **Agenda** | Crear, editar y borrar eventos. Campos: tipo, día, mes, título, lugar, nota, hora |
| **Equipos** | Editar nombre, lugar de entreno, horario y texto extra de cada equipo |
| **Valores** | Editar título y descripción de cada valor |
| **Textos** | Editar todos los textos del hero y la sección "únete" con previsualización en vivo |

El admin usa `useToast.jsx` para feedback visual (éxito/error) tras cada guardado.
