import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Settings2, Search, X } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import type { Product } from '../components/ProductCard'

// Product interface is now imported from ProductCard.

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const activeCategory = searchParams.get('category') || 'All'
  const searchQuery = searchParams.get('search') || ''
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('featured')

  useEffect(() => {
    // Fetch products
    fetch('https://dummyjson.com/products?limit=100')
      .then(res => res.json())
      .then(data => {
        setProducts(data.products)
        
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

  let filteredProducts = [...products]
  
  // Filter by category
  if (activeCategory !== 'All') {
    filteredProducts = filteredProducts.filter(p => p.category === activeCategory)
  }

  // Filter by search query
  if (searchQuery) {
    const q = searchQuery.toLowerCase()
    filteredProducts = filteredProducts.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q) ||
      (p.brand && p.brand.toLowerCase().includes(q))
    )
  }
  
  // Sort
  if (sortBy === 'price-low') {
    filteredProducts.sort((a, b) => a.price - b.price)
  } else if (sortBy === 'price-high') {
    filteredProducts.sort((a, b) => b.price - a.price)
  } else if (sortBy === 'rating') {
    filteredProducts.sort((a, b) => b.rating - a.rating)
  }

  if (loading) return <div style={styles.loading}>Loading catalog...</div>

  return (
    <div style={styles.container}>
      {/* Page Title */}
      <div style={styles.titleSection}>
        <h1 style={styles.title}>
          {activeCategory === 'All' ? 'All Products' : activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
        </h1>
        {searchQuery && (
          <div style={styles.searchHeader}>
            <span style={styles.resultsText}>Results for "{searchQuery}"</span>
            <button 
              style={styles.clearSearchBtn}
              onClick={() => {
                searchParams.delete('search')
                setSearchParams(searchParams)
              }}
            >
              <X size={14} />
            </button>
          </div>
        )}
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

        <div style={styles.grid}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div style={styles.noResults}>
              <div style={styles.noResultsContent}>
                <div style={styles.noResultsIconWrapper}>
                  <Search size={48} className="no-results-icon" />
                </div>
                <h2 style={styles.noResultsTitle}>No products found</h2>
                <p style={styles.noResultsText}>Try adjusting your filters or search term</p>
                <button 
                  style={styles.clearAllBtn}
                  onClick={() => {
                    setSearchParams({})
                  }}
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}
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
  searchHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '0.5rem',
  },
  resultsText: {
    fontSize: '0.9rem',
    color: 'var(--color-neutral-400)',
  },
  clearSearchBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--color-neutral-400)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2px',
    borderRadius: '50%',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: 'var(--color-neutral-100)',
    }
  },
  noResults: {
    gridColumn: '1 / -1',
    display: 'flex',
    justifyContent: 'center',
    padding: '4rem 0',
  },
  noResultsContent: {
    textAlign: 'center' as const,
    maxWidth: '400px',
    padding: '3rem',
    border: '2px dashed var(--color-neutral-100)',
    borderRadius: '1.5rem',
    width: '100%',
  },
  noResultsIconWrapper: {
    backgroundColor: 'var(--color-tertiary-100)',
    color: 'var(--color-tertiary-500)',
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem',
  },
  noResultsTitle: {
    fontSize: '1.5rem',
    color: 'var(--color-secondary-900)',
    marginBottom: '0.5rem',
  },
  noResultsText: {
    color: 'var(--color-neutral-400)',
    marginBottom: '1.5rem',
  },
  clearAllBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--color-secondary-900)',
    fontWeight: '600',
    textDecoration: 'underline',
    cursor: 'pointer',
    fontSize: '0.9rem',
  }
}
