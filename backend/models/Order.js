const mongoose = require("mongoose");

const ESTADOS = ["pendiente", "pagado", "enviado", "entregado", "cancelado"];

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "El producto es obligatorio."],
    },
    // Snapshot del producto al momento de la compra
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    precio: {
      type: Number,
      required: true,
      min: [0, "El precio no puede ser negativo."],
    },
    cantidad: {
      type: Number,
      required: [true, "La cantidad es obligatoria."],
      min: [1, "La cantidad mínima es 1."],
      validate: {
        validator: Number.isInteger,
        message: "La cantidad debe ser un número entero.",
      },
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El usuario es obligatorio."],
      index: true,
    },

    items: {
      type: [orderItemSchema],
      validate: {
        validator: (items) => Array.isArray(items) && items.length > 0,
        message: "El pedido debe tener al menos un producto.",
      },
    },

    total: {
      type: Number,
      required: true,
      min: [0, "El total no puede ser negativo."],
    },

    estado: {
      type: String,
      enum: {
        values: ESTADOS,
        message: "Estado inválido. Valores permitidos: " + ESTADOS.join(", "),
      },
      default: "pendiente",
    },

    direccionEnvio: {
      type: String,
      trim: true,
      default: "",
      maxlength: [300, "La dirección no puede superar 300 caracteres."],
    },

    notas: {
      type: String,
      trim: true,
      default: "",
      maxlength: [500, "Las notas no pueden superar 500 caracteres."],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// El total siempre se calcula en el servidor
orderSchema.pre("validate", function () {
  if (Array.isArray(this.items)) {
    const total = this.items.reduce(
      (acc, item) => acc + item.precio * item.cantidad,
      0
    );
    this.total = Math.round(total * 100) / 100;
  }
});

const Order = mongoose.model("Order", orderSchema);
Order.ESTADOS = ESTADOS;

module.exports = Order;
