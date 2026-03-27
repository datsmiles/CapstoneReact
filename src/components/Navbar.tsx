import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Search, ShoppingCart, Menu, X } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { cartCount } = useCart()

  return (
    <>
    <div className='top-container'>Free shipping on orders over $150  ·  Easy 30-day returns</div>
    <nav style={styles.nav}>
      <div style={styles.container}>
        <div style={styles.leftNav}>
          <Link to="/" style={styles.brand}>Shoprite</Link>
          
          {/* Desktop Links */}
          <ul style={styles.links} className="nav-links">
            <li><NavLink to="/shop" style={({ isActive }) => isActive ? { ...styles.link, ...styles.activeLink } : styles.link}>Shop</NavLink></li>
            <li><NavLink to="/blog" style={({ isActive }) => isActive ? { ...styles.link, ...styles.activeLink } : styles.link}>Post</NavLink></li>
          </ul>
        </div>

        <div style={styles.icons}>
          <button style={styles.iconBtn}><Search size={20} /></button>
          <Link to="/cart" style={styles.iconBtn}>
            <ShoppingCart size={20} />
            {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
          </Link>
          {/* Hamburger Menu Icon */}
          <button 
            className="hamburger"
            style={styles.hamburger} 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div style={styles.mobileMenu}>
          <ul style={styles.mobileLinks}>
            <li>
              <NavLink 
                to="/shop" 
                onClick={() => setIsOpen(false)}
                className="mobile-nav-link"
                style={styles.mobileLink}
              >
                Shop
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/blog" 
                onClick={() => setIsOpen(false)}
                className="mobile-nav-link"
                style={styles.mobileLink}
              >
                Post
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/cart" 
                onClick={() => setIsOpen(false)}
                className="mobile-nav-link"
                style={styles.mobileLink}
              >
                Cart
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </nav>
    </>
  )
}

const styles = {
  nav: {
    backgroundColor: 'var(--color-tertiary-50)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    padding: '1rem 0',
    position: 'relative' as const,
  },
  container: {
    width: '90%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative' as const,
  },
  leftNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '4rem',
  },
  brand: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--color-secondary-900)',
  },
  links: {
    display: 'flex',
    gap: '2rem',
  },
  link: {
    fontSize: '0.95rem',
    fontWeight: '500',
    color: 'var(--color-secondary-600)',
    transition: 'color 0.2s',
  },
  activeLink: {
    color: 'var(--color-primary-600)',
  },
  icons: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--color-secondary-800)',
    position: 'relative' as const,
  },
  badge: {
    position: 'absolute' as const,
    top: '-8px',
    right: '-8px',
    backgroundColor: 'var(--color-primary-500)',
    color: 'white',
    fontSize: '0.7rem',
    fontWeight: '700',
    minWidth: '16px',
    height: '16px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hamburger: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--color-secondary-900)',
    display: 'none',
    alignItems: 'center',
    padding: '0.5rem',
  },
  mobileMenu: {
    position: 'absolute' as const,
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: '2rem 1rem',
    borderTop: '1px solid var(--color-neutral-200)',
    boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
    zIndex: 1000,
  },
  mobileLinks: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
    alignItems: 'flex-start',
  },
  mobileLink: {
    display: 'block',
    width: '100%',
    padding: '0.75rem 1rem',
    fontSize: '1.1rem',
    fontWeight: '500',
    color: 'var(--color-secondary-900)',
    borderRadius: '0.5rem',
    transition: 'all 0.2s ease',
  }
}
