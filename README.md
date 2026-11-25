| Método | Ruta | Quién puede acceder | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Cualquier usuario logueado | Crea un nuevo pedido asociado al usuario autenticado. |
| `GET` | `/api/orders/mine` | Usuario logueado | Lista únicamente los pedidos pertenecientes al usuario autenticado. |
| `GET` | `/api/orders` | Solo `admin` | Lista todos los pedidos del sistema (soporta paginación y filtro por estado). |
| `GET` | `/api/orders/:id` | Dueño del pedido o `admin` | Obtiene el detalle de un pedido específico. |
| `PUT` | `/api/orders/:id` | Solo `admin` | Actualiza los datos o el estado de un pedido existente. |
| `DELETE` | `/api/orders/:id` | Dueño del pedido o `admin` | Elimina o cancela un pedido específico. |