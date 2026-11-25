const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const adminGuard = require("../middlewares/adminGuard");
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

// Todas las rutas de pedidos requieren estar logueado
router.use(authMiddleware);

// Crear pedido (cualquier usuario logueado)
router.post("/", createOrder);

// Mis pedidos (debe ir ANTES de "/:id")
router.get("/mine", getMyOrders);

// Todos los pedidos (solo admin)
router.get("/", adminGuard, getAllOrders);

// Ver un pedido (dueño o admin, se valida en el controller)
router.get("/:id", getOrderById);

// Modificar pedido (solo admin)
router.put("/:id", adminGuard, updateOrder);

// Eliminar pedido (dueño o admin, se valida en el controller)
router.delete("/:id", deleteOrder);

module.exports = router;
