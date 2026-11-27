import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../services/productService";
import { useCart } from "../context/CartContext.jsx";

function formatPrice(price) {
  if (price === undefined || price === null || isNaN(Number(price))) return '$0';
  return `$${Number(price).toLocaleString("es-AR")}`;
}

function resolveImage(product) {
  const src = product.img || product.imagenUrl || "";
  if (!src) return "/img/logo.svg";
  if (/^https?:\/\//i.test(src) || src.startsWith("/")) return src;
  return `${import.meta.env.BASE_URL}${src.replace(/^\//, "")}`;
}

// Props (contrato definido por App.jsx):
//   id → id del producto a mostrar (0 es un id válido).
//   onVolver() → volver al catálogo (opcional).
//   onAgregarAlCarrito(producto) → agregar al carrito (opcional).
export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const onVolver = () => navigate("/catalogo");
  const onAgregarAlCarrito = addItem;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    getProductById(id)
      .then((data) => {
        if (!cancelled) setProduct(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setProduct(null);
          setError(err);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, attempt]);

  const retry = () => setAttempt((n) => n + 1);

  const backButton = onVolver && (
    <button type="button" className="btn-secondary" onClick={onVolver}>
      Volver al catálogo
    </button>
  );

  if (loading) {
    return (
      <div className="contenedor-producto" role="status" aria-live="polite">
        <span className="loader" aria-hidden="true" />
        <p>Cargando producto...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="contenedor-producto estado-error" role="alert">
        <h1>Oops!</h1>
        <p>{error.message}</p>
        {/* Un 400/404 no se arregla reintentando: solo se ofrece volver. */}
        {!(error.status >= 400 && error.status < 500) && (
          <button type="button" className="btn-primary" onClick={retry}>
            Reintentar
          </button>
        )}
        {backButton}
      </div>
    );
  }

  const specs = Object.entries(product.specs || {}).filter(
    ([, valor]) => valor !== undefined && valor !== null && valor !== ""
  );

  return (
    <article className="contenedor-producto">
      <section className="seccion-imagen">
        <img
          src={resolveImage(product)}
          alt={product.name}
          className="product-image"
        />
      </section>

      <section className="seccion-informacion">
        {backButton}
        <h1 className="titulo-producto">{product.name}</h1>
        <p className="descripcion-producto">
          {product.desc || "Producto artesanal de Hermanos Jota."}
        </p>

        {specs.length > 0 && (
          <ul className="detalles-producto">
            {specs.map(([etiqueta, valor]) => (
              <li key={etiqueta}>
                <span className="detalle-titulo">{etiqueta}</span>
                <span className="detalle-valor">{valor}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="contenedor-precio" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <span className="precio-producto">{formatPrice(product.price)}</span>
          <span
            className={`stock-badge ${product.stock > 0 ? 'stock-ok' : 'stock-cero'}`}
            style={{
              fontSize: '0.875rem',
              padding: '0.3rem 0.65rem',
              borderRadius: '4px',
              backgroundColor: product.stock > 0 ? '#e8f5e9' : '#ffebee',
              color: product.stock > 0 ? '#2e7d32' : '#c62828',
              fontWeight: 600,
            }}
          >
            {product.stock > 0 ? `Stock: ${product.stock} disponibles` : 'Sin stock disponible'}
          </span>
        </div>

        {onAgregarAlCarrito && (
          <button
            type="button"
            className="btn-agregar-carrito"
            disabled={!product.stock || product.stock <= 0}
            style={(!product.stock || product.stock <= 0) ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
            onClick={() => onAgregarAlCarrito(product)}
          >
            {product.stock > 0 ? 'Añadir al Carrito' : 'Agotado'}
          </button>
        )}
      </section>
    </article>
  );
}