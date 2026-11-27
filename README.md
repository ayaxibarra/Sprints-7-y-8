# Mueblería Hermanos Jota — E-Commerce MERN

E-commerce académico desarrollado con el stack **MERN** (MongoDB, Express, React, Node.js) para la tienda de muebles artesanales y de diseño **Hermanos Jota**.

Este repositorio unifica e integra las funcionalidades de catálogo, autenticación y seguridad, gestión de pedidos, carrito con cálculo reactivo y persistencia local, panel de administración con control de stock y preparación para despliegue en la nube.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:**
  - [React 19](https://react.dev/) + [Vite](https://vite.dev/)
  - [React Router DOM v7](https://reactrouter.com/) (Enrutamiento del lado del cliente)
  - CSS modular y diseño responsivo (*Mobile-first*)
  - Context API para estado global (`AuthContext` y `CartContext` con persistencia en `localStorage`)

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
│   │   │   └── CartContext.jsx    # Proveedor de carrito de compras (persistente)
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

- [Node.js](https://nodejs.org/) 20.19.0 o superior instalado.
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
2. **Usuario Registrado:** Puede crear su cuenta, iniciar sesión y mantenerla mediante `localStorage`. Agrega items al carrito, modifica cantidades (con persistencia ante recargas de página F5), finaliza la compra verificando que el stock disminuye en tiempo real y consulta su historial en `/mis-pedidos`.
3. **Administrador:** Visualiza el acceso exclusivo a `/admin` en la barra de navegación. En el panel administrativo puede gestionar el estado de todos los pedidos y realizar el CRUD completo de productos (crear, editar, eliminar y buscar) con validaciones visuales.

---

## 📮 Verificación del Backend con Postman (Guía de Pruebas Manuales)

Esta guía detalla los 26 casos de prueba del checklist para verificar exhaustivamente la API mediante Postman.

### 1. Preparación

Antes de ejecutar las pruebas:
- Iniciar el backend con `npm run dev` en el puerto `3000`.
- Confirmar que la conexión con MongoDB Atlas esté activa.
- Utilizar como URL base: `http://localhost:3000`.
- Disponer de dos cuentas de prueba:
  - **Usuario normal:** `usuario.postman@gmail.com` (rol `user`), registrado mediante `POST /api/auth/register`.
  - **Administrador:** cuenta con rol `admin` (creada en la base de datos o mediante el script `node scripts/createAdmin.js`).

#### Configuración de Autorización en Postman:
- **Para rutas protegidas:** En la pestaña **Authorization**, seleccionar el tipo **Bearer Token** e ingresar el JWT devuelto en el login.
- **Para rutas públicas o pruebas sin autenticación:** Seleccionar **Authorization → No Auth**.
- **Cuerpos de las solicitudes:** Enviar en formato **Body → raw → JSON**.

---

### 2. Productos públicos

| Método | Endpoint | Resultado esperado | Descripción |
|---|---|---|---|
| GET | `/api/productos` | `200 OK` | Devuelve la lista completa de productos del catálogo. |
| GET | `/api/productos/:id` | `200 OK` | Devuelve el detalle del producto solicitado. |
| GET | `/api/productos/6ae797d811cd1c090f91bd99` | `404 Not Found` | Identifica correctamente cuando el ID tiene formato válido pero no existe en la base. |

*Verifica que el catálogo y el detalle sean accesibles para visitantes y que el backend maneje limpiamente los recursos no encontrados.*

---

### 3. Autenticación y Seguridad

| Método | Endpoint | Resultado esperado | Descripción |
|---|---|---|---|
| POST | `/api/auth/register` | `201 Created` | Registra un usuario y retorna su token JWT y perfil. |
| POST | `/api/auth/login` | `200 OK` | Autentica las credenciales y devuelve el token JWT. |
| GET | `/api/auth/me` | `200 OK` | Retorna los datos del usuario logueado usando su Bearer Token. |
| POST | `/api/auth/login` | `401 Unauthorized` | Rechaza el acceso ante contraseñas incorrectas o email no registrado. |
| GET | `/api/auth/me` | `401 Unauthorized` | Rechaza la solicitud si no se envía la cabecera `Authorization: Bearer <token>`. |

---

### 4. Permisos de Usuario Normal

*Para estas pruebas, utilizar en Postman el Bearer Token del usuario con rol `user`.*

| Método | Endpoint | Resultado esperado | Descripción |
|---|---|---|---|
| GET | `/api/orders/mine` | `200 OK` | El usuario puede consultar su propio historial de pedidos. |
| GET | `/api/orders` | `403 Forbidden` | Bloquea la consulta del listado general de pedidos de todos los usuarios. |
| POST | `/api/productos` | `403 Forbidden` | Impide que un usuario normal cree productos en el catálogo. |
| PUT | `/api/productos/:id` | `403 Forbidden` | Impide que un usuario normal modifique productos. |
| DELETE | `/api/productos/:id` | `403 Forbidden` | Impide que un usuario normal elimine productos del catálogo. |

---

### 5. Carrito y Creación de Pedidos

*Utilizar el Bearer Token del usuario normal autenticado.*

#### A. Crear un pedido exitoso
- **Método:** `POST`
- **Endpoint:** `/api/orders`
- **Cuerpo JSON:**
  ```json
  {
    "items": [
      {
        "product": "ID_DE_PRODUCTO_CON_STOCK",
        "cantidad": 1
      }
    ],
    "direccionEnvio": "Av. San Juan 2847, CABA",
    "notas": "Pedido de prueba mediante Postman."
  }
  ```
- **Resultado esperado:** `201 Created`.
- **Comprobación de inventario:** El stock del producto en MongoDB disminuye de manera atómica (por ejemplo, de 10 a 9 unidades).

#### B. Rechazo por stock insuficiente
- **Método:** `POST`
- **Endpoint:** `/api/orders`
- **Cuerpo JSON:** Enviar una cantidad superior al stock disponible (por ejemplo, `999`).
- **Resultado esperado:** `409 Conflict` con mensaje `"Stock insuficiente para..."`. El inventario permanece sin cambios.

#### C. Consultar pedidos propios
- **Método:** `GET`
- **Endpoint:** `/api/orders/mine`
- **Resultado esperado:** `200 OK` con el listado de los pedidos pertenecientes exclusivamente al usuario logueado.

#### D. Consultar detalle de un pedido específico
- **Método:** `GET`
- **Endpoint:** `/api/orders/:id`
- **Resultado esperado:** 
  - Si el pedido pertenece al usuario autenticado: `200 OK` con los detalles.
  - Si el pedido pertenece a otro usuario y no se es administrador: `403 Forbidden` (protegiendo la privacidad de los clientes).

#### E. Intentar comprar sin autenticación
- **Método:** `POST`
- **Endpoint:** `/api/orders` (con **Authorization → No Auth**)
- **Resultado esperado:** `401 Unauthorized`.

---

### 6. Administración de Pedidos

*Para estas pruebas, utilizar el Bearer Token de un usuario con rol `admin`.*

| Método | Endpoint | Resultado esperado | Descripción |
|---|---|---|---|
| GET | `/api/orders` | `200 OK` | Devuelve todos los pedidos de la plataforma (soporta paginación y filtro `?estado=`). |
| GET | `/api/orders/:id` | `200 OK` | El administrador puede inspeccionar cualquier pedido del sistema. |
| PUT | `/api/orders/:id` | `200 OK` | Actualiza el estado (`pendiente`, `pagado`, `enviado`, `entregado`, `cancelado`). |
| PUT | `/api/orders/:id` (ya cancelado) | `409 Conflict` | Impide reactivar o modificar un pedido que ya fue cancelado. |

#### Verificación de restitución de stock:
Al enviar `PUT /api/orders/:id` con `{ "estado": "cancelado" }`, el backend automáticamente devuelve las cantidades de los productos al inventario (por ejemplo, el stock se restaura de 9 a 10 unidades).

---

### 7. Administración del Catálogo de Productos

*Utilizar el Bearer Token del administrador.*

| Método | Endpoint | Resultado esperado | Descripción |
|---|---|---|---|
| POST | `/api/productos` | `201 Created` | Da de alta un nuevo mueble en el catálogo. |
| PUT | `/api/productos/:id` | `200 OK` | Modifica datos del producto (precio, stock, descripción, etc.). |
| DELETE | `/api/productos/:id` | `200 OK` | Da de baja el producto de la base de datos. |
| POST | `/api/productos` (datos inválidos) | `400 Bad Request` | Falla con validaciones si el nombre está vacío o los precios/stock son negativos. |
| DELETE | `/api/productos/:id` (ya eliminado) | `404 Not Found` | Responde 404 al intentar operar sobre un ID que ya no existe. |

#### Ejemplo de cuerpo para crear producto:
```json
{
  "nombre": "Mesa Ratona Jota",
  "descripcion": "Madera maciza de petiribí con acabado artesanal en cera de abejas.",
  "precio": 85000,
  "stock": 15,
  "imagenUrl": "/img/Mesa de Centro Araucaria.png"
}
```

---

### 8. Consideraciones Finales de Pruebas

- **Seguridad de Tokens:** Nunca compartir contraseñas ni tokens JWT en repositorios públicos ni capturas de pantalla.
- **Aislamiento de Pruebas:** Para no alterar el inventario real del catálogo, realizar las compras y modificaciones de prueba sobre productos creados específicamente para pruebas.
- **Auditoría Integral:** Además de verificar el código de estado HTTP devuelto, validar siempre que el cuerpo de la respuesta JSON contenga los datos esperados y que las modificaciones de stock y estado se reflejen correctamente en MongoDB Atlas.

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
