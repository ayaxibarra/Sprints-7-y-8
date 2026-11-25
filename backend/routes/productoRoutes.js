const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const adminGuard = require("../middlewares/adminGuard");

const {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
} = require("../controllers/productoController");

router.get("/", getProductos);
router.get("/:id", getProductoById);
router.post("/", authMiddleware, adminGuard, createProducto);
router.put("/:id",authMiddleware, adminGuard, updateProducto);
router.delete("/:id",authMiddleware, adminGuard, deleteProducto);

module.exports = router;
