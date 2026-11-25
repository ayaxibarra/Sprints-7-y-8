const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");

const MAX_ITEMS = 50;

// ---------- Helpers ----------

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const handleError = (res, error, contexto) => {
  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(" ") });
  }

  if (error.name === "CastError") {
    return res.status(400).json({ message: "Identificador inválido." });
  }

  console.error(`Error en ${contexto}:`, error);
  return res.status(500).json({ message: "Error interno del servidor." });
};

// Devuelve el stock de los items de un pedido
const restoreStock = async (items) => {
  if (!items || items.length === 0) return;

  await Product.bulkWrite(
    items.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { stock: item.cantidad } },
      },
    }))
  );
};

// Normaliza los items del body: valida y unifica productos repetidos
const normalizeItems = (rawItems) => {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return { error: "El pedido debe incluir al menos un producto." };
  }

  if (rawItems.length > MAX_ITEMS) {
    return { error: `Un pedido no puede tener más de ${MAX_ITEMS} productos.` };
  }

  const merged = new Map();

  for (const raw of rawItems) {
    const productId = raw?.product;
    const cantidad = Number(raw?.cantidad);

    if (!isValidId(productId)) {
      return { error: "Uno de los productos tiene un identificador inválido." };
    }

    if (!Number.isInteger(cantidad) || cantidad < 1) {
      return { error: "La cantidad de cada producto debe ser un entero mayor a 0." };
    }

    const key = String(productId);
    merged.set(key, (merged.get(key) || 0) + cantidad);
  }

  return {
    items: [...merged.entries()].map(([product, cantidad]) => ({
      product,
      cantidad,
    })),
  };
};

// ---------- Crear pedido (usuario logueado) ----------

const createOrder = async (req, res) => {
  const reserved = []; // items con stock ya descontado (para rollback)

  try {
    const { items: rawItems, direccionEnvio, notas } = req.body;

    const { items, error } = normalizeItems(rawItems);
    if (error) return res.status(400).json({ message: error });

    // Buscar productos en la base: precio y nombre NUNCA vienen del cliente
    const products = await Product.find({
      _id: { $in: items.map((i) => i.product) },
    });

    const productsById = new Map(products.map((p) => [p._id.toString(), p]));

    for (const item of items) {
      if (!productsById.has(item.product)) {
        return res.status(404).json({
          message: `El producto ${item.product} no existe.`,
        });
      }
    }

    // Descontar stock de forma atómica (evita vender de más ante pedidos simultáneos)
    for (const item of items) {
      const updated = await Product.findOneAndUpdate(
        { _id: item.product, stock: { $gte: item.cantidad } },
        { $inc: { stock: -item.cantidad } }
      );

      if (!updated) {
        await restoreStock(reserved);
        const nombre = productsById.get(item.product).nombre;
        return res.status(409).json({
          message: `Stock insuficiente para "${nombre}".`,
        });
      }

      reserved.push(item);
    }

    const orderItems = items.map((item) => {
      const product = productsById.get(item.product);
      return {
        product: product._id,
        nombre: product.nombre,
        precio: product.precio,
        cantidad: item.cantidad,
      };
    });

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      direccionEnvio,
      notas,
    });

    return res.status(201).json({
      message: "Pedido creado correctamente.",
      order,
    });
  } catch (error) {
    // Si algo falló después de descontar stock, lo devolvemos
    try {
      await restoreStock(reserved);
    } catch (rollbackError) {
      console.error("Error al revertir stock:", rollbackError);
    }

    return handleError(res, error, "createOrder");
  }
};

// ---------- Mis pedidos ----------

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    return res.json(orders);
  } catch (error) {
    return handleError(res, error, "getMyOrders");
  }
};

// ---------- Todos los pedidos (admin) ----------

const getAllOrders = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);

    const filter = {};
    if (req.query.estado) {
      if (!Order.ESTADOS.includes(req.query.estado)) {
        return res.status(400).json({ message: "Estado inválido." });
      }
      filter.estado = req.query.estado;
    }

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("user", "nombre email")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Order.countDocuments(filter),
    ]);

    return res.json({
      orders,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return handleError(res, error, "getAllOrders");
  }
};

// ---------- Un pedido (dueño o admin) ----------

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: "Identificador inválido." });
    }

    const order = await Order.findById(id).populate("user", "nombre email");

    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado." });
    }

    const isOwner = order.user._id.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "No tenés permisos para ver este pedido.",
      });
    }

    return res.json(order);
  } catch (error) {
    return handleError(res, error, "getOrderById");
  }
};

// ---------- Modificar pedido (solo admin) ----------

const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: "Identificador inválido." });
    }

    // Solo estos campos se pueden modificar
    const allowed = ["estado", "direccionEnvio", "notas"];
    const updates = {};

    for (const field of allowed) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: `Enviá al menos uno de estos campos: ${allowed.join(", ")}.`,
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado." });
    }

    if (updates.estado !== undefined && updates.estado !== order.estado) {
      if (order.estado === "cancelado") {
        return res.status(409).json({
          message: "Un pedido cancelado no puede cambiar de estado.",
        });
      }

      // Al cancelar, el stock vuelve al inventario
      if (updates.estado === "cancelado") {
        await restoreStock(order.items);
      }
    }

    order.set(updates);
    await order.save(); // corre validaciones del schema (enum, maxlength, etc.)

    return res.json({
      message: "Pedido actualizado correctamente.",
      order,
    });
  } catch (error) {
    return handleError(res, error, "updateOrder");
  }
};

// ---------- Eliminar pedido (dueño o admin) ----------

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: "Identificador inválido." });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado." });
    }

    const isOwner = order.user.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "Solo podés eliminar tus propios pedidos.",
      });
    }

    // Si ya estaba cancelado, el stock ya se devolvió
    if (order.estado !== "cancelado") {
      await restoreStock(order.items);
    }

    await order.deleteOne();

    return res.json({ message: "Pedido eliminado correctamente." });
  } catch (error) {
    return handleError(res, error, "deleteOrder");
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};
