import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ShoppingCart, Star, Settings2 } from 'lucide-react'
import { useCart } from '../context/CartContext'

interface Product {
  id: number;
  title: string;
  price: number;
  rating: number;
  brand: string;
  category: string;
  thumbnail: string;
}

export default function ShopPage() {
  const { addToCart } = useCart()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All')
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('featured')

  useEffect(() => {
    // Fetch products
    fetch('https://dummyjson.com/products?limit=100')
      .then(res => res.json())
      .then(data => {
        setProducts(data.products)
        setFilteredProducts(data.products)
        
        // Extract unique categories
        const uniqueCategories = ['All', ...new Set(data.products.map((p: Product) => p.category))] as string[]
        setCategories(uniqueCategories)
        setLoading(false)
      })
      .catch(err => {
        console.error("Failed to fetch products:", err)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    const urlCategory = searchParams.get('category') || 'All'
    if (urlCategory !== activeCategory) {
      setActiveCategory(urlCategory)
    }
  }, [searchParams])

  useEffect(() => {
    let result = [...products]
    
    // Filter by category
    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory)
    }
    
    // Sort
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating)
    }
    
    setFilteredProducts(result)
  }, [activeCategory, sortBy, products])

  if (loading) return <div style={styles.loading}>Loading catalog...</div>

  return (
    <div style={styles.container}>
      {/* Page Title */}
      <div style={styles.titleSection}>
        <h1 style={styles.title}>{activeCategory === 'All' ? 'All Products' : activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}</h1>
      </div>

      {/* Mobile Controls Section */}
      <div className="mobile-controls" style={styles.mobileControls}>
        <div style={styles.countPill}>
          {filteredProducts.length}
        </div>
        <div style={styles.filterWrapper}>
          <div style={styles.selectWithIcon}>
            <span style={styles.filterIcon}><Settings2 size={16} /></span>
            <div style={styles.redDot}></div>
            <select 
              style={styles.mobileSelect}
              value={activeCategory}
              onChange={(e) => {
                const cat = e.target.value
                setActiveCategory(cat)
                if (cat === 'All') {
                  searchParams.delete('category')
                } else {
                  searchParams.set('category', cat)
                }
                setSearchParams(searchParams)
              }}
            >
              <option value="" disabled>Filters</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div style={styles.sortWrapper}>
          <select 
            style={styles.mobileSelect} 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>

      {/* Desktop Header Section */}
      <div className="desktop-header" style={styles.header}>
        <p style={styles.count}>{filteredProducts.length} products</p>
        <div style={styles.controls}>
          <select 
            style={styles.sortSelect} 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>

      <div style={styles.layout}>
        {/* Sidebar */}
        <aside className="sidebar" style={styles.sidebar}>
          <h3 style={styles.sidebarTitle}>CATEGORY</h3>
          <ul style={styles.categoryList}>
            {categories.map(cat => (
              <li key={cat}>
                <button 
                  style={activeCategory === cat ? {...styles.categoryBtn, ...styles.activeCategory} : styles.categoryBtn}
                  onClick={() => {
                    setActiveCategory(cat)
                    if (cat === 'All') {
                      searchParams.delete('category')
                    } else {
                      searchParams.set('category', cat)
                    }
                    setSearchParams(searchParams)
                  }}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Product Grid */}
        <div style={styles.grid}>
          {filteredProducts.map(product => (
            <Link key={product.id} to={`/shop/${product.id}`} className="product-card">
              <div className="img-container">
                <img src={product.thumbnail} alt={product.title} />
                <button 
                  style={styles.atcBtn} 
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
                    <Star size={12} className="star-icon" />
                    {product.rating.toFixed(1)}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    width: '90%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  loading: {
    textAlign: 'center' as const,
    padding: '10rem',
    fontSize: '1.2rem',
    color: 'var(--color-neutral-400)',
  },
  titleSection: {
    marginBottom: '2rem',
  },
  mobileControls: {
    display: 'none', // Shown via CSS on mobile
    gap: '0.35rem',
    marginBottom: '1.5rem',
    flexWrap: 'nowrap' as const,
    alignItems: 'center',
    width: '100%',
  },
  countPill: {
    padding: '0.2rem 0.5rem',
    backgroundColor: 'var(--color-neutral-50)',
    borderRadius: '2rem',
    fontSize: '0.65rem',
    color: 'var(--color-neutral-500)',
    border: '1px solid var(--color-neutral-100)',
    whiteSpace: 'nowrap' as const,
    flexShrink: 0,
  },
  filterWrapper: {
    flex: 1,
  },
  sortWrapper: {
    flex: 1.2,
    minWidth: 0,
  },
  selectWithIcon: {
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
  },
  filterIcon: {
    position: 'absolute' as const,
    left: '0.6rem',
    color: 'var(--color-neutral-500)',
    pointerEvents: 'none' as const,
  },
  mobileSelect: {
    width: '100%',
    padding: '0.4rem 0.4rem 0.4rem 1.5rem',
    borderRadius: '0.5rem',
    border: '1px solid var(--color-neutral-200)',
    fontSize: '0.75rem',
    backgroundColor: 'white',
    appearance: 'none' as const,
    cursor: 'pointer',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.2rem center',
  },
  redDot: {
    position: 'absolute' as const,
    top: '0.3rem',
    left: '1.2rem',
    width: '4px',
    height: '4px',
    backgroundColor: '#ff4d4f',
    borderRadius: '50%',
    zIndex: 1,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '3rem',
    paddingBottom: '2rem',
    borderBottom: '1px solid var(--color-neutral-100)',
  },
  title: {
    fontSize: '2.5rem',
    color: 'var(--color-secondary-900)',
    marginBottom: '0.5rem',
  },
  count: {
    color: 'var(--color-neutral-400)',
    fontSize: '0.9rem',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  sortSelect: {
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    border: '1px solid var(--color-neutral-200)',
    fontSize: '0.9rem',
    backgroundColor: 'white',
    cursor: 'pointer',
    outline: 'none',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '240px 1fr',
    gap: '3rem',
  },
  sidebar: {
    position: 'sticky' as const,
    top: '2rem',
    height: 'fit-content',
  },
  sidebarTitle: {
    fontSize: '0.75rem',
    fontWeight: '700',
    letterSpacing: '1px',
    color: 'var(--color-neutral-400)',
    marginBottom: '1.5rem',
  },
  categoryList: {
    listStyle: 'none',
    padding: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  categoryBtn: {
    background: 'none',
    border: 'none',
    padding: '0.5rem 0',
    fontSize: '0.95rem',
    color: 'var(--color-secondary-600)',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left' as const,
    transition: 'color 0.2s',
  },
  activeCategory: {
    color: 'var(--color-secondary-900)',
    fontWeight: '700',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '2rem',
  },
  cardLink: {
    textDecoration: 'none',
    color: 'inherit',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '1rem',
    overflow: 'hidden',
    transition: 'transform 0.3s ease',
  },
  imgWrapper: {
    position: 'relative' as const,
    aspectRatio: '1',
    backgroundColor: '#F8F8F8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem',
  },
  img: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain' as const,
  },
  atcBtn: {
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
  pInfo: {
    padding: '1rem 0',
  },
  pCategory: {
    fontSize: '0.75rem',
    color: 'var(--color-neutral-400)',
    marginBottom: '0.25rem',
  },
  pName: {
    fontSize: '1rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: 'var(--color-secondary-900)',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  pFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pPrice: {
    fontWeight: '700',
    fontSize: '1.1rem',
  },
  pRating: {
    fontSize: '0.85rem',
    color: 'var(--color-neutral-500)',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  }
}
