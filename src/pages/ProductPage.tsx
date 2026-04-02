import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, Star, ShoppingCart, Truck, RotateCcw, ShieldCheck, Plus, Minus } from 'lucide-react'
import { useCart } from '../context/CartContext'

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  stock: number;
}

export default function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [similarProducts, setSimilarProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const { addToCart } = useCart()

  useEffect(() => {
    setLoading(true)
    fetch(`https://dummyjson.com/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data)
        // Fetch similar products in same category
        return fetch(`https://dummyjson.com/products/category/${data.category}?limit=5`)
      })
      .then(res => res.json())
      .then(data => {
        setSimilarProducts(data.products.filter((p: Product) => p.id !== parseInt(id || '')).slice(0, 4))
        setLoading(false)
        window.scrollTo(0, 0)
      })
      .catch(err => {
        console.error("Failed to fetch product:", err)
        setLoading(false)
      })
  }, [id])

  if (loading) return <div style={styles.loading}>Loading...</div>
  if (!product) return <div style={styles.error}>Product not found.</div>

  return (
    <div style={styles.container}>
      <Link to="/" style={styles.backLink}>
        <ChevronLeft size={18} /> Back
      </Link>

      <div style={styles.productLayout}>
        {/* Product Image */}
        <div style={styles.imageSection}>
          <div style={styles.mainImageWrapper}>
            <img src={product.thumbnail} alt={product.title} style={styles.mainImage} />
          </div>
        </div>

        {/* Product Info */}
        <div style={styles.infoSection}>
          <p style={styles.categoryLabel}>{product.category.toUpperCase()}</p>
          <h1 style={styles.productTitle}>{product.title}</h1>
          
          <div style={styles.ratingRow}>
            <div style={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={14} 
                  fill={i < Math.floor(product.rating) ? "var(--color-primary-500)" : "transparent"} 
                  color={i < Math.floor(product.rating) ? "var(--color-primary-500)" : "var(--color-neutral-300)"}
                />
              ))}
            </div>
            <span style={styles.ratingText}>{product.rating} · {product.brand}</span>
          </div>

          <p style={styles.priceTag}>${product.price}</p>
          <p style={styles.stockStatus}>In stock</p>

          <div style={styles.actionRow}>
            <div style={styles.quantitySelector}>
              <button style={styles.qtyBtn} onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={14} /></button>
              <span style={styles.qtyVal}>{quantity}</span>
              <button style={styles.qtyBtn} onClick={() => setQuantity(quantity + 1)}><Plus size={14} /></button>
            </div>
            <button 
              style={styles.atcBtn}
              onClick={() => addToCart(product, quantity)}
            >
              <ShoppingCart size={18} style={{marginRight: '8px'}} /> Add to Cart
            </button>
          </div>

          <div style={styles.infoList}>
            <div style={styles.infoItem}>
              <Truck size={18} color="var(--color-neutral-400)" />
              <span>Free shipping on orders over $150</span>
            </div>
            <div style={styles.infoItem}>
              <RotateCcw size={18} color="var(--color-neutral-400)" />
              <span>30-day hassle-free returns</span>
            </div>
            <div style={styles.infoItem}>
              <ShieldCheck size={18} color="var(--color-neutral-400)" />
              <span>Secure, encrypted checkout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabSection}>
        <div style={styles.tabHeader}>
          <button 
            style={activeTab === 'description' ? {...styles.tabBtn, ...styles.activeTab} : styles.tabBtn}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button 
            style={activeTab === 'details' ? {...styles.tabBtn, ...styles.activeTab} : styles.tabBtn}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
        </div>
        <div style={styles.tabContent}>
          {activeTab === 'description' ? (
            <p>{product.description}</p>
          ) : (
            <div style={styles.detailsGrid}>
              <p><strong>Brand:</strong> {product.brand}</p>
              <p><strong>Category:</strong> {product.category}</p>
              <p><strong>Stock:</strong> {product.stock} units</p>
            </div>
          )}
        </div>
      </div>

      {/* You May Also Like */}
      <section style={styles.relatedSection}>
        <div style={styles.relatedHeader}>
          <h2 style={styles.relatedTitle}>You may also like</h2>
          <Link to="/shop" style={styles.viewAll}>View all &rarr;</Link>
        </div>
        <div style={styles.relatedGrid}>
          {similarProducts.map(product => (
            <Link key={product.id} to={`/shop/${product.id}`} className="product-card">
              <div className="img-container">
                <img src={product.thumbnail} alt={product.title} />
                <button 
                  style={{
                    position: 'absolute',
                    bottom: '1rem',
                    right: '1rem',
                    width: '40px',
                    height: '40px',
                    borderRadius: '20px',
                    backgroundColor: 'var(--color-secondary-900)',
                    color: 'white',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    opacity: 0,
                    transform: 'translateY(10px)',
                    transition: 'all 0.3s ease',
                  }} 
                  className="add-to-cart"
                  onClick={(e) => { 
                    e.preventDefault(); 
                    addToCart(product); 
                  }}
                >
                  <ShoppingCart size={18} />
                </button>
              </div>
              <div className="product-info">
                <span className="category-tag">{product.category.replace('-', ' ')}</span>
                <h4 className="product-title">{product.title}</h4>
                <div className="price-rating-row">
                  <span className="product-price">${product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  <div className="rating-row">
                    <Star size={14} className="star-icon" />
                    {product.rating.toFixed(1)}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

const styles = {
  container: {
    width: '80%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    padding: '10rem',
    fontSize: '1.5rem',
    color: 'var(--color-neutral-400)',
  },
  error: {
    textAlign: 'center' as const,
    padding: '10rem',
    color: 'red',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: 'var(--color-neutral-400)',
    fontSize: '0.9rem',
    marginBottom: '2rem',
  },
  productLayout: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '4rem',
    marginBottom: '4rem',
  },
  imageSection: {
    backgroundColor: '#F8F8F8',
    borderRadius: '1.5rem',
    padding: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainImageWrapper: {
    width: '100%',
    aspectRatio: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainImage: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain' as const,
  },
  infoSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
  },
  categoryLabel: {
    fontSize: '0.8rem',
    letterSpacing: '1px',
    color: 'var(--color-neutral-400)',
    marginBottom: '0.5rem',
  },
  productTitle: {
    fontSize: '2.5rem',
    lineHeight: 1.1,
    marginBottom: '1rem',
    color: 'var(--color-secondary-900)',
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2rem',
  },
  stars: {
    display: 'flex',
    gap: '2px',
  },
  ratingText: {
    fontSize: '0.9rem',
    color: 'var(--color-neutral-400)',
  },
  priceTag: {
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
  },
  stockStatus: {
    color: '#10B981',
    fontSize: '0.9rem',
    fontWeight: '600',
    marginBottom: '2rem',
  },
  actionRow: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '3rem',
  },
  quantitySelector: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid var(--color-neutral-200)',
    borderRadius: '2rem',
    padding: '0.5rem',
  },
  qtyBtn: {
    background: 'none',
    border: 'none',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'var(--color-neutral-500)',
  },
  qtyVal: {
    width: '40px',
    textAlign: 'center' as const,
    fontWeight: '600',
  },
  atcBtn: {
    flex: 1,
    backgroundColor: 'var(--color-secondary-900)',
    color: 'white',
    border: 'none',
    borderRadius: '2rem',
    padding: '0 2rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  infoList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    paddingTop: '2rem',
    borderTop: '1px solid var(--color-neutral-100)',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    fontSize: '0.85rem',
    color: 'var(--color-neutral-500)',
  },
  atcBtnSmall: {
    position: 'absolute' as const,
    bottom: '1rem',
    right: '1rem',
    width: '36px',
    height: '36px',
    borderRadius: '18px',
    backgroundColor: 'var(--color-secondary-900)',
    color: 'white',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    opacity: 0,
    transform: 'translateY(10px)',
    transition: 'all 0.3s ease',
  },
  tabSection: {
    marginBottom: '6rem',
  },
  tabHeader: {
    display: 'flex',
    gap: '2.5rem',
    borderBottom: '1px solid var(--color-neutral-100)',
    marginBottom: '2rem',
  },
  tabBtn: {
    background: 'none',
    border: 'none',
    padding: '1rem 0',
    fontSize: '1rem',
    fontWeight: '600',
    color: 'var(--color-neutral-400)',
    cursor: 'pointer',
    position: 'relative' as const,
  },
  activeTab: {
    color: 'var(--color-secondary-900)',
    borderBottom: '2px solid var(--color-secondary-900)',
  },
  tabContent: {
    maxWidth: '800px',
    color: 'var(--color-neutral-500)',
    lineHeight: '1.6',
    fontSize: '1rem',
  },
  detailsGrid: {
    display: 'grid',
    gap: '0.5rem',
  },
  relatedSection: {
    width: '100%',
  },
  relatedHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '2rem',
  },
  relatedTitle: {
    fontSize: '1.8rem',
  },
  viewAll: {
    fontSize: '0.9rem',
    color: 'var(--color-neutral-500)',
    fontWeight: '500',
  },
  relatedGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '2rem',
  },
  relatedCard: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  relatedImgWrapper: {
    backgroundColor: '#F8F8F8',
    borderRadius: '1rem',
    padding: '1.5rem',
    aspectRatio: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
    overflow: 'hidden',
  },
  relatedImg: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain' as const,
    transition: 'transform 0.3s ease',
  },
  relatedCategory: {
    fontSize: '0.75rem',
    color: 'var(--color-neutral-400)',
    marginBottom: '0.25rem',
  },
  relatedName: {
    fontSize: '1rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: 'var(--color-secondary-900)',
  },
  relatedFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.9rem',
    fontWeight: '700',
  },
  relatedPrice: {
    color: 'var(--color-secondary-900)',
  },
  relatedRating: {
    color: 'var(--color-primary-600)',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  }
}
