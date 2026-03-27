import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.col}>
          <h3 style={styles.brand}>Shoprite</h3>
          <p style={styles.text}>
            We believe in a world where you have total freedom to be you, without judgement.
          </p>
        </div>
        <div style={styles.col}>
          <h4 style={styles.heading}>Shop</h4>
          <ul style={styles.list}>
            <li><Link to="/shop?cat=fragrances" style={styles.link}>Fragrances</Link></li>
            <li><Link to="/shop?cat=groceries" style={styles.link}>Groceries</Link></li>
            <li><Link to="/shop?cat=laptops" style={styles.link}>Laptops</Link></li>
            <li><Link to="/shop?cat=home-decoration" style={styles.link}>Home Decor</Link></li>
            <li><Link to="/shop?cat=furniture" style={styles.link}>Furniture</Link></li>
          </ul>
        </div>
        <div style={styles.col}>
          <h4 style={styles.heading}>Help</h4>
          <ul style={styles.list}>
            <li><Link to="/" style={styles.link}>Contact</Link></li>
            <li><Link to="/" style={styles.link}>Shipping Info</Link></li>
            <li><Link to="/" style={styles.link}>Returns</Link></li>
            <li><Link to="/" style={styles.link}>FAQ</Link></li>
          </ul>
        </div>
        <div style={styles.col}>
          <h4 style={styles.heading}>Legal</h4>
          <ul style={styles.list}>
            <li><Link to="/" style={styles.link}>Privacy Policy</Link></li>
            <li><Link to="/" style={styles.link}>Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div style={styles.bottom}>
        <p>&copy; {new Date().getFullYear()} Shoppr. All rights reserved.</p>
      </div>
    </footer>
  )
}

const styles = {
  footer: {
    backgroundColor: 'var(--color-tertiary-50)',
    paddingTop: '4rem',
    borderTop: '1px solid var(--color-neutral-200)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2rem',
    marginBottom: '3rem',
  },
  col: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  brand: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--color-secondary-900)',
  },
  text: {
    color: 'var(--color-secondary-500)',
    fontSize: '0.9rem',
  },
  heading: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: 'var(--color-secondary-900)',
    marginBottom: '0.5rem',
  },
  list: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  link: {
    color: 'var(--color-secondary-500)',
    fontSize: '0.9rem',
    transition: 'color 0.2s',
  },
  bottom: {
    borderTop: '1px solid var(--color-neutral-200)',
    padding: '1.5rem 1rem',
    textAlign: 'center' as const,
    color: 'var(--color-neutral-500)',
    fontSize: '0.85rem',
  }
}
