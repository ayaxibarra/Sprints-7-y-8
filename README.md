# Mueblería Hermanos Jota — E-Commerce MERN

E-commerce académico desarrollado con el stack **MERN** (MongoDB, Express, React, Node.js) para la tienda de muebles artesanales y de diseño **Hermanos Jota**.

Este repositorio unifica e integra las funcionalidades de catálogo, autenticación y seguridad, gestión de pedidos, carrito con cálculo reactivo, panel de administración con control de stock y preparación para despliegue en la nube.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:**
  - [React 19](https://react.dev/) + [Vite](https://vite.dev/)
  - [React Router DOM v7](https://reactrouter.com/) (Enrutamiento del lado del cliente)
  - CSS modular y diseño responsivo (*Mobile-first*)
  - Context API para estado global (`AuthContext`, `CartContext`)

- **Backend:**
  - [Node.js](https://nodejs.org/) (Entorno de ejecución CommonJS)
  - [Express 5](https://expressjs.com/) (Framework web y API REST)
  - [Mongoose 9](https://mongoosejs.com/) (ODM para modelado de datos)
  - [MongoDB Atlas](https://www.mongodb.com/atlas) (Base de datos NoSQL distribuida)
  - [bcrypt](https://www.npmjs.com/package/bcrypt) (Hasheo seguro de contraseñas)
  - [jsonwebtoken](https://jwt.io/) (Autenticación basada en tokens JWT)
  - [Helmet](https://helmetjs.github.io/) & [CORS](https://expressjs.com/en/resources/middleware/cors.html) (Seguridad HTTP)
  - [express-rate-limit](https://express-rate-limit.mintlify.app/) (Protección contra ataques de fuerza bruta)

---

## 📁 Estructura del Proyecto

```text
Sprints-7-y-8/
├── backend/
│   ├── config/
│   │   └── db.js                  # Conexión a MongoDB Atlas
│   ├── controllers/
│   │   ├── auth.controller.js     # Registro, inicio de sesión y perfil
│   │   ├── orderController.js     # Creación, consulta y actualización de pedidos
│   │   └── productoController.js  # CRUD de catálogo de productos
│   ├── middlewares/
│   │   ├── adminGuard.js          # Control de acceso exclusivo para rol admin
│   │   ├── authMiddleware.js      # Verificación de JWT en cabecera Authorization
│   │   ├── errorHandler.js        # Manejador centralizado de errores (400 vs 500)
│   │   ├── notFound.js            # Middleware 404 para rutas backend inexistentes
│   │   ├── rateLimiters.js        # Limitador de intentos para login y registro
│   │   └── requestLogger.js       # Logger seguro de solicitudes HTTP
│   ├── models/
│   │   ├── Order.js               # Modelo de órdenes con snapshots e items
│   │   ├── Product.js             # Modelo de productos (nombre, precio, stock, imagen)
│   │   └── User.js                # Modelo de usuarios (user / admin)
│   ├── routes/
│   │   ├── admin.routes.js        # Rutas de verificación administrativa
│   │   ├── auth.routes.js         # Endpoints de autenticación
│   │   ├── orderRoutes.js         # Endpoints de pedidos
│   │   └── productoRoutes.js      # Endpoints de productos
│   ├── scripts/
│   │   └── createAdmin.js         # Script para sembrar usuario administrador
│   ├── .env.example               # Plantilla de variables de entorno del backend
│   ├── index.js                   # Punto de entrada de la aplicación Express
│   └── package.json
│
├── frontend/
│   ├── public/                    # Favicon, SVG y fotografías de productos
│   ├── src/
│   │   ├── assets/                # Recursos estáticos
│   │   ├── components/
│   │   │   ├── Cart.jsx           # Vista de carrito y formulario de checkout
│   │   │   ├── ContactForm.jsx    # Formulario de contacto
│   │   │   ├── Footer.jsx         # Pie de página institucional
│   │   │   ├── Home.jsx           # Portada y productos destacados
│   │   │   ├── Layout.jsx         # Contenedor principal con Navbar y Footer
│   │   │   ├── Navbar.jsx         # Barra de navegación con accesos según rol
│   │   │   ├── ProductCard.jsx    # Tarjeta de producto para listas
│   │   │   ├── ProductDetail.jsx  # Vista detallada de producto y stock
│   │   │   ├── ProductList.jsx    # Catálogo con filtros y ordenamiento
│   │   │   └── ProtectedRoute.jsx # Guardas de rutas privadas y según rol
│   │   ├── context/
│   │   │   ├── AuthContext.jsx    # Proveedor de sesión y autenticación
│   │   │   └── CartContext.jsx    # Proveedor de carrito de compras
│   │   ├── pages/
│   │   │   ├── AdminPage.jsx      # Panel de control: pedidos y CRUD de productos
│   │   │   ├── LoginPage.jsx      # Formulario de inicio de sesión
│   │   │   ├── MyOrdersPage.jsx   # Historial de compras del usuario autenticado
│   │   │   ├── NotFoundPage.jsx   # Página de error 404 para rutas inexistentes
│   │   │   ├── ProfilePage.jsx    # Información del perfil del usuario
│   │   │   └── RegisterPage.jsx   # Formulario de registro de cuenta
│   │   ├── services/
│   │   │   ├── api.js             # Cliente HTTP fetch con inyección de JWT
│   │   │   ├── authService.js     # Métodos de autenticación
│   │   │   ├── orderService.js    # Métodos de órdenes de compra
│   │   │   └── productService.js  # Métodos de consulta y CRUD de productos
│   │   ├── utils/
│   │   │   └── carrito.js         # Funciones puras para operaciones del carrito
│   │   ├── App.jsx                # Enrutador y estructura de rutas
│   │   ├── main.jsx               # Montaje en el DOM
│   │   └── index.css              # Estilos globales y paleta de la marca
│   ├── .env.example               # Plantilla de variables de entorno del frontend
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore                     # Exclusión de node_modules, .env y dist
└── README.md
```

---

## 📋 Requisitos Previos

- [Node.js](https://nodejs.org/) v18 o superior instalado.
- Cuenta o cluster en [MongoDB Atlas](https://www.mongodb.com/atlas) (o MongoDB Community instalado localmente).

---

## ⚙️ Configuración de Variables de Entorno

Nunca subas claves secretas ni cadenas de conexión al repositorio. Crea los archivos `.env` en sus respectivas carpetas basándote en los archivos `.env.example`:

### Backend (`backend/.env`)
```env
PORT=3000
MONGODB_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/<nombre_db>?retryWrites=true&w=majority
JWT_SECRET=tu_clave_secreta_super_segura
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:5173

# Opcionales para el script createAdmin.js
ADMIN_NAME=Administrador
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=PasswordSeguro123!
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:3000
```

---

## 🚀 Instalación y Ejecución Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/ayaxibarra/Sprints-7-y-8.git
cd Sprints-7-y-8
```

### 2. Configurar y levantar el Backend
```bash
cd backend
npm install
npm run dev
```
El servidor backend se iniciará en `http://localhost:3000`.

### 3. Configurar y levantar el Frontend (en otra terminal)
```bash
cd frontend
npm install
npm run dev
```
La aplicación web estará disponible en `http://localhost:5173`.

---

## 🛡️ Roles, Permisos y Rutas de la API

La aplicación cuenta con dos roles de usuario: **`user`** (cliente registrado) y **`admin`** (administrador). Los visitantes no autenticados navegan como invitados.

### Tabla de Endpoints del Backend

| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| **POST** | `/api/auth/register` | Público | Registra un nuevo usuario (`role: "user"`). |
| **POST** | `/api/auth/login` | Público | Inicia sesión y retorna token JWT y datos de perfil. |
| **GET** | `/api/auth/me` | Usuario autenticado | Retorna datos del usuario según el token JWT. |
| **GET** | `/api/productos` | Público | Lista los productos disponibles en el catálogo. |
| **GET** | `/api/productos/:id` | Público | Obtiene el detalle de un producto específico. |
| **POST** | `/api/productos` | Solo `admin` | Crea un nuevo producto en el catálogo. |
| **PUT** | `/api/productos/:id` | Solo `admin` | Actualiza los datos de un producto (nombre, precio, stock, etc.). |
| **DELETE** | `/api/productos/:id` | Solo `admin` | Elimina un producto del catálogo. |
| **POST** | `/api/orders` | Usuario autenticado | Crea una orden con descuento atómico de stock. |
| **GET** | `/api/orders/mine` | Usuario autenticado | Retorna el historial de compras del usuario actual. |
| **GET** | `/api/orders` | Solo `admin` | Lista todas las órdenes del sistema con paginación y filtros. |
| **GET** | `/api/orders/:id` | Dueño o `admin` | Detalle de un pedido específico. |
| **PUT** | `/api/orders/:id` | Solo `admin` | Actualiza estado (`pendiente`, `pagado`, `enviado`, `entregado`, `cancelado`). Si se cancela, el stock regresa al inventario. |
| **DELETE** | `/api/orders/:id` | Dueño o `admin` | Elimina o cancela una orden y restituye el stock. |
| **GET** | `/api/admin/test` | Solo `admin` | Endpoint de verificación de privilegios de administrador. |

---

## 🧪 Pruebas del Sistema

### Pruebas de integración del Frontend
```bash
cd frontend
npm test               # Ejecuta las pruebas unitarias del carrito (Node.js Test Runner)
npm run lint           # Comprobación de código con Oxlint
npm run build          # Compilación de producción con Vite
```

### Recorridos Principales Verificados (E2E)
1. **Visitante:** Navega por la portada, catálogo con búsqueda en tiempo real y vista de producto. Al intentar comprar o ingresar a rutas protegidas (`/perfil`, `/mis-pedidos`, `/admin`), es redirigido a `/login`.
2. **Usuario Registrado:** Puede crear su cuenta, iniciar sesión y mantenerla mediante `localStorage`. Agrega items al carrito, modifica cantidades, finaliza la compra verificando que el stock disminuye en tiempo real y consulta su historial en `/mis-pedidos`.
3. **Administrador:** Visualiza el acceso exclusivo a `/admin` en la barra de navegación. En el panel administrativo puede gestionar el estado de todos los pedidos y realizar el CRUD completo de productos (crear, editar, eliminar y buscar) con validaciones visuales.

---

## ☁️ Guía de Despliegue en Producción

### Backend (Render)
1. Crear un **Web Service** en Render conectado al repositorio de GitHub.
2. Root Directory: `backend`.
3. Build Command: `npm install`.
4. Start Command: `npm start`.
5. Variables de entorno en el panel de Render:
   - `PORT`: `3000` (o la asignada por Render)
   - `MONGODB_URI`: Cadena de conexión de MongoDB Atlas.
   - `JWT_SECRET`: Secreto criptográfico seguro.
   - `JWT_EXPIRES_IN`: `1d`.
   - `CLIENT_URL`: URL del frontend desplegado (ej. `https://muebleria-hermanos-jota.vercel.app`).

### Frontend (Vercel o Netlify)
1. Importar el proyecto seleccionando el directorio raíz: `frontend`.
2. Framework Preset: `Vite`.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. Variable de entorno:
   - `VITE_API_URL`: URL pública del backend en Render (ej. `https://muebleria-jota-backend.onrender.com`).
