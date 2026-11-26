// Reutiliza las clases .card, .card-body, .card-title, .card-price y
// .card-actions del styles.css original.

function formatPrice(price) {
  return `$${Number(price).toLocaleString("es-AR")}`;
}

function resolveImage(product) {
  const src = product.img || product.imagenUrl || "";
  if (!src) return "/img/logo.svg";
  if (/^https?:\/\//i.test(src) || src.startsWith("/")) return src;
  return `${import.meta.env.BASE_URL}${src.replace(/^\//, "")}`;
}

// headingLevel: 2 en el catálogo (bajo el <h1>), 3 en el Home (bajo un <h2>).
export default function ProductCard({ product, onSelect, onAddToCart, headingLevel = 3 }) {
  const Titulo = `h${headingLevel}`;

  return (
    <article className="card">
      <img
        src={resolveImage(product)}
        alt={product.name}
        loading="lazy"
      />

      <div className="card-body">
        <Titulo className="card-title">{product.name}</Titulo>
        <p className="card-description">
          {product.desc || "Producto artesanal de Hermanos Jota."}
        </p>
        <p className="card-price">{formatPrice(product.price)}</p>

        <div className="card-actions">
          {onAddToCart && (
            <button
              type="button"
              className="btn-primary"
              onClick={() => onAddToCart(product)}
            >
              Añadir al Carrito
            </button>
          )}
          {onSelect && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => onSelect(product.id)}
              aria-label={`Ver detalle de ${product.name}`}
            >
              Ver Detalle
            </button>
          )}
        </div>
      </div>
    </article>
  );
}