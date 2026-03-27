import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Truck, RefreshCw, ShieldCheck, ShoppingCart, Star } from 'lucide-react'
import { useCart } from '../context/CartContext'
import shoplady from '../assets/img/shoplady.jpg'
import photo1 from '../assets/img/photo1.avif'
import photo2 from '../assets/img/photo2.avif'
import photo3 from '../assets/img/photo3.avif'

// Import generated blog images
import blog1 from '../assets/img/photo1.avif' // Placeholder if not found, I will update later
import blog2 from '../assets/img/photo2.avif'
import blog3 from '../assets/img/photo3.avif'

interface Product {
  id: number;
  title: string;
  price: number;
  discountPercentage: number;
  rating: number;
  brand: string;
  thumbnail: string;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    fetch('https://dummyjson.com/products?limit=8')
      .then(res => res.json())
      .then(data => {
        setProducts(data.products)
        setLoading(false)
      })
      .catch(err => {
        console.error("Failed to fetch products:", err)
        setLoading(false)
      })
  }, [])

//   useEffect(() => {
//   const fetchProducts = async () => {
//     try {
//       const res = await fetch('https://dummyjson.com/products?limit=8')
//       const data = await res.json()

//       setProducts(data.products)
//     } catch (err) {
//       console.error("Failed to fetch products:", err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   fetchProducts()
// }, [])

  const blogPosts = [
    {
      id: 1,
      image: blog1,
      date: 'March 10, 2024',
      title: 'The right match for your space',
      snippet: 'Discover how to choose furniture that complements your lifestyle and home aesthetic.'
    },
    {
      id: 2,
      image: blog2,
      date: 'March 12, 2024',
      title: 'Sustainable living trends',
      snippet: 'Explore the latest eco-friendly designs that are making a difference in modern homes.'
    },
    {
      id: 3,
      image: blog3,
      date: 'March 15, 2024',
      title: 'Minimalist decor guide',
      snippet: 'Learn the art of less is more and how to create a tranquil environment using simple pieces.'
    }
  ]
  return (
    <div style={styles.page}>
      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroContent}>
          <p style={styles.heroEyebrow}>NEW SEASON ARRIVAL</p>
          <h1 style={styles.heroTitle}>Dress the <br/>life <br/>you want.</h1>
          <p style={styles.heroSubtitle}>
            Create a living space that works for you with our curated collection of modern designs.
          </p>
          <Link to="/shop" style={styles.heroButton}>
            Explore Collection <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={styles.statsBar}>
        <div style={styles.statItem}>
          <h3 style={styles.statNumber}>1M+</h3>
          <p style={styles.statLabel}>Buyers</p>
        </div>
        <div style={styles.statItem}>
          <h3 style={styles.statNumber}>45,000+</h3>
          <p style={styles.statLabel}>Products</p>
        </div>
        <div style={styles.statItem}>
          <h3 style={styles.statNumber}>20</h3>
          <p style={styles.statLabel}>Categories</p>
        </div>
      </section>

      {/* Category Section */}
      <section style={styles.section}>
        <h5>Shop by</h5>
        <h2 style={styles.sectionTitle}>Category.</h2>
        <div style={styles.categoryGrid}>
          <div style={{ ...styles.categoryCard, gridArea: 'large' }} className="categoryCard">
            <img src={photo1} alt="Laptops" style={styles.categoryImg} />
            <div style={styles.categoryOverlay}>
              <span style={styles.categoryLabel}>COLLECTION</span>
              <h3 style={styles.categoryName}>Laptops</h3>
            </div>
          </div>
          <div style={{ ...styles.categoryCard, gridArea: 'item1' }} className="categoryCard">
            <img src={photo2} alt="Fragrances" style={styles.categoryImg} />
            <div style={styles.categoryOverlay}>
              <span style={styles.categoryLabel}>COLLECTION</span>
              <h3 style={styles.categoryName}>Fragrances</h3>
            </div>
          </div>
          <div style={{ ...styles.categoryCard, gridArea: 'item2' }} className="categoryCard">
            <img src={photo3} alt="Groceries" style={styles.categoryImg} />
            <div style={styles.categoryOverlay}>
              <span style={styles.categoryLabel}>COLLECTION</span>
              <h3 style={styles.categoryName}>Groceries</h3>
            </div>
          </div>
          <div style={{ ...styles.categoryCard, gridArea: 'item3' }} className="categoryCard">
            <img src={photo1} alt="Home Decor" style={styles.categoryImg} />
            <div style={styles.categoryOverlay}>
              <span style={styles.categoryLabel}>COLLECTION</span>
              <h3 style={styles.categoryName}>Home Decor</h3>
            </div>
          </div>
          <div style={{ ...styles.categoryCard, gridArea: 'item4' }} className="categoryCard">
            <img src={photo2} alt="Furniture" style={styles.categoryImg} />
            <div style={styles.categoryOverlay}>
              <span style={styles.categoryLabel}>COLLECTION</span>
              <h3 style={styles.categoryName}>Furniture</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Top Rated Products */}
      <section style={{ ...styles.section, backgroundColor: 'var(--color-tertiary-100)', padding: '4rem 1rem' }}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Top rated<br/><span style={{ color: 'var(--color-neutral-400)' }}>products.</span></h2>
          <Link to="/shop" style={styles.viewAllLink}>View all <ArrowRight size={16} /></Link>
        </div>
        <div style={styles.productGrid}>
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={styles.productCard}>
                <div style={styles.productImagePlaceholder}></div>
                <div style={{ height: '1rem', backgroundColor: 'var(--color-neutral-100)', width: '60%', marginBottom: '0.5rem' }}></div>
                <div style={{ height: '1.2rem', backgroundColor: 'var(--color-neutral-100)', width: '90%', marginBottom: '1rem' }}></div>
              </div>
            ))
          ) : (
            products.map((product) => (
              <Link key={product.id} to={`/shop/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={styles.productCard} className="product-card">
                  <div style={styles.productImageWrapper}>
                    <img src={product.thumbnail} alt={product.title} style={styles.productImage} />
                    <button 
                      style={styles.addToCartBtn} 
                      className="add-to-cart"
                      onClick={(e) => { 
                        e.preventDefault(); 
                        addToCart(product); 
                      }}
                    >
                      <ShoppingCart size={18} />
                    </button>
                  </div>
                  <p style={styles.productBrand}>{product.brand}</p>
                  <h4 style={styles.productName}>{product.title}</h4>
                  <div style={styles.productFooter}>
                    <span style={styles.productPrice}>${product.price}</span>
                    <span style={styles.productRating}>
                      <Star size={14} fill="currentColor" style={{ verticalAlign: 'middle', marginRight: '2px' }} />
                      {product.rating}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.featuresSection}>
        <div style={styles.feature}>
          <div style={styles.featureIconWrapper}><Truck size={24} color="var(--color-primary-600)" /></div>
          <div>
            <h4 style={styles.featureTitle}>Free Delivery</h4>
            <p style={styles.featureText}>On orders over $150</p>
          </div>
        </div>
        <div style={styles.feature}>
          <div style={styles.featureIconWrapper}><RefreshCw size={24} color="var(--color-success-600)" /></div>
          <div>
            <h4 style={styles.featureTitle}>30 Days Return</h4>
            <p style={styles.featureText}>No questions asked</p>
          </div>
        </div>
        <div style={styles.feature}>
          <div style={styles.featureIconWrapper}><ShieldCheck size={24} color="var(--color-warning-600)" /></div>
          <div>
            <h4 style={styles.featureTitle}>Secure Payment</h4>
            <p style={styles.featureText}>100% secure checkout</p>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section style={styles.promoBanner}>
        <div style={styles.promoContent}>
          <p style={{ color: 'var(--color-primary-400)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem', letterSpacing: '1px' }}>LIMITED TIME OFFER</p>
          <h2 style={styles.promoTitle}>Free shipping on<br/><span style={{ color: 'var(--color-primary-500)' }}>every order</span> over $150</h2>
          <p style={{ color: 'var(--color-neutral-400)', marginTop: '1rem', marginBottom: '2rem', maxWidth: '500px', margin: '1rem auto 2rem' }}>We've updated our delivery guidelines for making the delivery smoother.</p>
          <Link to="/shop" style={styles.promoButton}>Shop now <ArrowRight size={16} /></Link>
        </div>
      </section>

      {/* Blog Preview */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Style stories<br/><span style={{ color: 'var(--color-neutral-400)' }}>& news.</span></h2>
          <Link to="/blog" style={styles.viewAllLink}>All posts <ArrowRight size={16} /></Link>
        </div>
        <div style={styles.blogGrid}>
          {blogPosts.map((post) => (
            <div key={post.id} style={styles.blogCard} className="blog-card">
              <div style={styles.blogImgWrapper}>
                <img src={post.image} alt={post.title} style={styles.blogImg} />
              </div>
              <p style={styles.blogDate}>{post.date}</p>
              <h4 style={styles.blogTitle}>{post.title}</h4>
              <p style={styles.blogSnippet}>{post.snippet}</p>
              <Link to={`/blog/${post.id}`} style={styles.readMoreLink} className="read-more">
                Read article <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}

const styles = {
  page: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  heroSection: {
    height: '75vh',
    display: 'flex',
    alignItems: 'center',
    padding: '0 5%',
    backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${shoplady})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: 'white',
  },
  heroContent: {
    maxWidth: '500px',
  },
  heroEyebrow: {
    fontSize: '0.8rem',
    fontWeight: '600',
    letterSpacing: '2px',
    marginBottom: '1rem',
    color: 'var(--color-primary-300)',
  },
  heroTitle: {
    fontSize: '4rem',
    lineHeight: 1.1,
    marginBottom: '1.5rem',
  },
  heroSubtitle: {
    fontSize: '1.2rem',
    marginBottom: '2rem',
    color: 'var(--color-neutral-200)',
  },
  heroButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'var(--color-primary-500)',
    color: 'var(--color-secondary-900)',
    padding: '1rem 2rem',
    borderRadius: '2rem',
    fontWeight: '600',
    transition: 'background-color 0.2s',
  },
  statsBar: {
    display: 'flex',
    justifyContent: 'space-around',
    backgroundColor: 'var(--color-secondary-900)',
    color: 'white',
    padding: '2rem 1rem',
  },
  statItem: {
    textAlign: 'center' as const,
  },
  statNumber: {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '0.2rem',
  },
  statLabel: {
    color: 'var(--color-neutral-400)',
    fontSize: '0.8rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
  },
  section: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '4rem 1rem',
    width: '100%',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontSize: '2rem',
    color: 'var(--color-secondary-900)',
  },
  viewAllLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: 'var(--color-secondary-600)',
    fontWeight: '500',
    fontSize: '0.9rem',
  },
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gridTemplateRows: 'repeat(2, 200px)',
    gap: '1rem',
    gridTemplateAreas: `
      "large large item1 item2"
      "large large item3 item4"
    `,
  },
  categoryCard: {
    position: 'relative' as const,
    overflow: 'hidden',
    borderRadius: '0.5rem',
    backgroundColor: 'var(--color-neutral-200)',
  },
  categoryImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  },
  categoryOverlay: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    padding: '1.5rem',
    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
    color: 'white',
  },
  categoryLabel: {
    fontSize: '0.7rem',
    letterSpacing: '1px',
    color: 'var(--color-neutral-300)',
  },
  categoryName: {
    fontSize: '1.2rem',
    marginTop: '0.2rem',
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '2rem',
  },
  productCard: {
    backgroundColor: 'white',
    padding: '1.25rem',
    borderRadius: '1rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  productImageWrapper: {
    position: 'relative' as const,
    height: '240px',
    backgroundColor: 'var(--color-neutral-50)',
    borderRadius: '0.75rem',
    overflow: 'hidden',
    marginBottom: '1.25rem',
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain' as const,
    padding: '1rem',
    transition: 'transform 0.5s ease',
  },
  addToCartBtn: {
    position: 'absolute' as const,
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
    transition: 'opacity 0.3s ease, transform 0.3s ease',
  },
  productImagePlaceholder: {
    height: '240px',
    backgroundColor: 'var(--color-neutral-100)',
    borderRadius: '0.75rem',
    marginBottom: '1.25rem',
  },
  productBrand: {
    fontSize: '0.75rem',
    color: 'var(--color-neutral-500)',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    fontWeight: '600',
  },
  productName: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: 'var(--color-secondary-900)',
    margin: '0.5rem 0',
    height: '2.8rem',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical' as const,
  },
  productFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid var(--color-neutral-100)',
  },
  productPrice: {
    fontWeight: '800',
    fontSize: '1.25rem',
    color: 'var(--color-secondary-900)',
  },
  productRating: {
    fontSize: '0.9rem',
    color: 'var(--color-primary-600)',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
  },
  featuresSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '3rem',
    padding: '6rem 1rem',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    padding: '2rem',
    backgroundColor: 'var(--color-primary-50)',
    borderRadius: '1.5rem',
  },
  featureIconWrapper: {
    width: '60px',
    height: '60px',
    borderRadius: '30px',
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
  },
  featureTitle: {
    fontWeight: '700',
    fontSize: '1.1rem',
    marginBottom: '0.25rem',
  },
  featureText: {
    color: 'var(--color-neutral-500)',
    fontSize: '0.9rem',
  },
  promoBanner: {
    backgroundColor: 'var(--color-secondary-900)',
    backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(201, 169, 110, 0.15), transparent 40%), radial-gradient(circle at 80% 50%, rgba(201, 169, 110, 0.1), transparent 40%)',
    color: 'white',
    padding: '8rem 1rem',
    textAlign: 'center' as const,
  },
  promoContent: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  promoTitle: {
    fontSize: '3.5rem',
    lineHeight: 1.1,
    fontWeight: '800',
  },
  promoButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.75rem',
    backgroundColor: 'var(--color-primary-500)',
    color: 'var(--color-secondary-900)',
    padding: '1.2rem 2.5rem',
    borderRadius: '3rem',
    fontWeight: '700',
    fontSize: '1.1rem',
    marginTop: '1rem',
    transition: 'transform 0.3s ease, background-color 0.3s ease',
  },
  blogGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '2.5rem',
  },
  blogCard: {
    display: 'flex',
    flexDirection: 'column' as const,
    group: 'blog-post',
  },
  blogImgWrapper: {
    height: '280px',
    backgroundColor: 'var(--color-neutral-100)',
    borderRadius: '1.25rem',
    overflow: 'hidden',
    marginBottom: '1.5rem',
  },
  blogImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    transition: 'transform 0.6s ease',
  },
  blogDate: {
    fontSize: '0.85rem',
    color: 'var(--color-primary-600)',
    fontWeight: '700',
    letterSpacing: '1px',
    marginBottom: '0.75rem',
    textTransform: 'uppercase' as const,
  },
  blogTitle: {
    fontSize: '1.5rem',
    fontWeight: '800',
    lineHeight: 1.3,
    marginBottom: '1rem',
    color: 'var(--color-secondary-900)',
  },
  blogSnippet: {
    color: 'var(--color-secondary-500)',
    fontSize: '1rem',
    lineHeight: 1.6,
    marginBottom: '1.5rem',
  },
  readMoreLink: {
    color: 'var(--color-secondary-900)',
    fontWeight: '700',
    fontSize: '1rem',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
  }
}
