const Product = require("../models/Product");

const getProductos = async (req, res, next) => {
  try {
    const productos = await Product.find();
    res.status(200).json(productos);
  } catch (error) {
    next(error);
  }
};

const getProductoById = async (req, res, next) => {
  try {
    const producto = await Product.findById(req.params.id);

    if (!producto) {
      const error = new Error("Producto no encontrado");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json(producto);
  } catch (error) {
    if (error.name === "CastError") {
      error.statusCode = 400;
      error.message = "Identificador de producto inválido.";
    }
    next(error);
  }
};

const createProducto = async (req, res, next) => {
  try {
    const productoGuardado = await Product.create(req.body);

    res.status(201).json({
      mensaje: "Producto creado con éxito",
      producto: productoGuardado,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      error.statusCode = 400;
    }
    next(error);
  }
};

const updateProducto = async (req, res, next) => {
  try {
    const productoActualizado = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!productoActualizado) {
      const error = new Error("Producto no encontrado");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      mensaje: "Producto actualizado con éxito",
      producto: productoActualizado,
    });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      error.statusCode = 400;
    }
    next(error);
  }
};

const deleteProducto = async (req, res, next) => {
  try {
    const productoEliminado = await Product.findByIdAndDelete(req.params.id);

    if (!productoEliminado) {
      const error = new Error("Producto no encontrado");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      mensaje: "Producto eliminado con éxito",
      producto: productoEliminado,
    });
  } catch (error) {
    if (error.name === "CastError") {
      error.statusCode = 400;
      error.message = "Identificador de producto inválido.";
    }
    next(error);
  }
};

module.exports = {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
};
