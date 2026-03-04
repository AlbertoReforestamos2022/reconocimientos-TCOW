# Reconocimientos TCW

Plataforma web para la generación y descarga de reconocimientos digitales de **Ciudad Árbol del Mundo (TCW)** — Reforestamos México.

Permite a usuarios registrados diseñar reconocimientos personalizados en un editor visual, guardar sus proyectos en la nube y exportarlos como imagen.

---

## Stack tecnológico

| Capa       | Tecnología                                      |
|------------|-------------------------------------------------|
| Frontend   | React 19, Vite, Zustand, Axios, React Router v7 |
| Backend    | Node.js, Express 5                              |
| Base de datos | MySQL 8 (mysql2)                             |
| Auth       | JWT + bcryptjs                                  |
| Export     | html2canvas                                     |

---

## Estructura del proyecto

```
reconocimientos-tcw/
├── client/                  # Frontend (React + Vite)
│   └── src/
│       ├── components/      # ControlPanel, Preview, shared
│       ├── hooks/           # useExport
│       ├── pages/           # Login, Register, Editor, admin/
│       ├── services/        # api.js, auth.js, projects.js, locations.js
│       └── store/           # authStore, editorStore (Zustand)
│
└── server/                  # Backend (Express)
    ├── db/
    │   ├── connection.js    # Pool MySQL
    │   └── seed.js          # Migraciones + datos iniciales
    ├── middleware/
    │   ├── auth.js          # Verificación JWT
    │   └── isAdmin.js       # Verificación de rol admin
    ├── routes/
    │   ├── auth.js          # /api/auth
    │   ├── projects.js      # /api/projects
    │   ├── location.js      # /api/states, /api/cities
    │   └── admin/           # /api/admin/...
    └── index.js             # Entry point
```

---

## Requisitos previos

- Node.js >= 18
- MySQL >= 8 corriendo localmente
- npm

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/reconocimientos-tcw.git
cd reconocimientos-tcw
```

### 2. Configurar variables de entorno del servidor

Crea el archivo `server/.env` (o edita el existente):

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=tu_password
DB_NAME=branding_editor
JWT_SECRET=cambia_esto_en_produccion
JWT_EXPIRES_IN=7d
PORT=3000
```

> **Importante:** Cambia `JWT_SECRET` por una cadena larga y aleatoria antes de subir a producción.

### 3. Instalar dependencias

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 4. Inicializar la base de datos

Desde la carpeta `server/`:

```bash
npm run seed
```

Esto crea las tablas y un usuario administrador por defecto:

| Campo    | Valor                        |
|----------|------------------------------|
| Email    | `admin@brandingeditor.com`   |
| Password | `Admin1234!`                 |

> Cambia la contraseña del admin después del primer login.

---

## Levantar el proyecto en desarrollo

Abre dos terminales:

```bash
# Terminal 1 — Backend (puerto 3000)
cd server
npm run dev

# Terminal 2 — Frontend (puerto 5173)
cd client
npm run dev
```

Accede en: [http://localhost:5173](http://localhost:5173)

El frontend hace proxy de `/api` hacia `http://localhost:3000` (configurado en `vite.config.js`).

---

## API — Endpoints principales

### Auth

| Método | Ruta                  | Descripción                    | Auth |
|--------|-----------------------|--------------------------------|------|
| POST   | `/api/auth/register`  | Registrar nuevo usuario        | No   |
| POST   | `/api/auth/login`     | Iniciar sesión, devuelve JWT   | No   |
| GET    | `/api/auth/me`        | Datos del usuario autenticado  | Sí   |

**Body login:**
```json
{ "email": "usuario@ejemplo.com", "password": "contraseña" }
```

**Body register:**
```json
{
  "username": "nombre",
  "email": "usuario@ejemplo.com",
  "password": "min8chars",
  "city_id": 1
}
```

### Proyectos (requieren JWT)

| Método | Ruta                  | Descripción                   |
|--------|-----------------------|-------------------------------|
| GET    | `/api/projects`       | Listar proyectos del usuario  |
| GET    | `/api/projects/:id`   | Obtener proyecto por ID       |
| POST   | `/api/projects`       | Crear nuevo proyecto          |
| PUT    | `/api/projects/:id`   | Actualizar proyecto           |
| DELETE | `/api/projects/:id`   | Eliminar proyecto             |

**Body crear/actualizar:**
```json
{ "name": "Mi reconocimiento", "canvas_json": { ... } }
```

### Ubicaciones

| Método | Ruta                        | Descripción                      |
|--------|-----------------------------|----------------------------------|
| GET    | `/api/states`               | Listar estados de México         |
| GET    | `/api/cities?state_id=1`    | Ciudades por estado              |

### Admin (requieren rol `admin`)

| Método | Ruta                  | Descripción               |
|--------|-----------------------|---------------------------|
| GET    | `/api/admin/users`    | Listar usuarios           |
| GET    | `/api/admin/states`   | Gestionar estados         |
| GET    | `/api/admin/cities`   | Gestionar ciudades        |

---

## Autenticación

El JWT se envía en el header `Authorization: Bearer <token>`.
El cliente lo inyecta automáticamente en cada request via `axios` interceptors (`client/src/services/api.js`).

Si el servidor devuelve `401`, el cliente limpia la sesión y redirige a `/login`.

---

## Scripts disponibles

### Backend (`/server`)

| Comando        | Descripción                              |
|----------------|------------------------------------------|
| `npm run dev`  | Servidor con hot-reload (nodemon)        |
| `npm start`    | Servidor en producción                   |
| `npm run seed` | Crear tablas y datos iniciales en la DB  |

### Frontend (`/client`)

| Comando          | Descripción                        |
|------------------|------------------------------------|
| `npm run dev`    | Servidor de desarrollo (Vite)      |
| `npm run build`  | Build de producción en `dist/`     |
| `npm run lint`   | Análisis estático con ESLint       |
| `npm run preview`| Preview del build de producción    |

---

## Variables de entorno requeridas

| Variable         | Descripción                            | Default          |
|------------------|----------------------------------------|------------------|
| `DB_HOST`        | Host de MySQL                          | `localhost`      |
| `DB_PORT`        | Puerto de MySQL                        | `3306`           |
| `DB_USER`        | Usuario de MySQL                       | `root`           |
| `DB_PASS`        | Contraseña de MySQL                    | ` `              |
| `DB_NAME`        | Nombre de la base de datos             | `branding_editor`|
| `JWT_SECRET`     | Secreto para firmar tokens JWT         | —                |
| `JWT_EXPIRES_IN` | Duración del token                     | `7d`             |
| `PORT`           | Puerto del servidor Express            | `3000`           |

---

## .gitignore recomendado

Asegúrate de que tu `.gitignore` en la raíz incluya:

```
# Dependencias
node_modules/
client/node_modules/
server/node_modules/

# Variables de entorno (NUNCA subir al repo)
server/.env
.env

# Build del cliente
client/dist/

# Logs
*.log
npm-debug.log*
```

---

## Autor

**Reforestamos México** — Ciudad Árbol del Mundo (TCW)
