import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react'

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, subtotal } = useCart();

  const shipping = subtotal > 150 ? 0 : (cart.length > 0 ? 9.99 : 0);
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  const freeShippingThreshold = 150;
  const amountToFreeShipping = freeShippingThreshold - subtotal;

  if (cart.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <h2 style={styles.emptyTitle}>Your cart is empty</h2>
        <p style={styles.emptyText}>Looks like you haven't added anything to your cart yet.</p>
        <Link to="/shop" style={styles.continueBtn}>
          <ArrowLeft size={18} /> Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Shopping Cart <span style={styles.itemCount}>({cart.length} items)</span></h1>
      </header>

      <div style={styles.layout}>
        {/* Cart Items List */}
        <div style={styles.itemsSection}>
          <div style={styles.itemsList}>
            {cart.map(item => (
              <div key={item.id} style={styles.cartItem}>
                <div style={styles.itemImageWrapper}>
                  <img src={item.thumbnail} alt={item.title} style={styles.itemImage} />
                </div>
                <div style={styles.itemDetails}>
                  <p style={styles.itemCategory}>{item.category}</p>
                  <h3 style={styles.itemTitle}>{item.title}</h3>
                  <p style={styles.unitPrice}>Unit: ${item.price}</p>
                  
                  <div style={styles.itemControls}>
                    <div style={styles.quantitySelector}>
                      <button 
                        style={styles.qtyBtn} 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus size={14} />
                      </button>
                      <span style={styles.qtyDisplay}>{item.quantity}</span>
                      <button 
                        style={styles.qtyBtn} 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
                <div style={styles.itemRight}>
                  <p style={styles.itemTotalPrice}>${(item.price * item.quantity).toFixed(2)}</p>
                  <button style={styles.removeBtn} onClick={() => removeFromCart(item.id)}>
                    <Trash2 size={16} /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button style={styles.clearBtn} onClick={clearCart}>Clear cart</button>
        </div>

        {/* Order Summary Sidebar */}
        <aside style={styles.summarySidebar}>
          <div style={styles.summaryCard}>
            <h2 style={styles.summaryTitle}>Order Summary</h2>
            <div style={styles.summaryRow}>
              <span>Subtotal ({cart.length} items)</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div style={styles.summaryRow}>
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div style={styles.summaryRow}>
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div style={{ ...styles.summaryRow, ...styles.totalRow }}>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            {amountToFreeShipping > 0 && (
              <p style={styles.shippingPromo}>
                Add ${amountToFreeShipping.toFixed(2)} more for free shipping
              </p>
            )}

            <button style={styles.checkoutBtn}>Checkout</button>
            <Link to="/shop" style={styles.continueShoppingLink}>Continue Shopping</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '90%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '3rem 1rem',
  },
  emptyContainer: {
    textAlign: 'center' as const,
    padding: '8rem 1rem',
  },
  emptyTitle: {
    fontSize: '2rem',
    color: 'var(--color-secondary-900)',
    marginBottom: '1rem',
  },
  emptyText: {
    color: 'var(--color-neutral-400)',
    marginBottom: '2rem',
  },
  continueBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: 'var(--color-secondary-900)',
    fontWeight: '600',
    textDecoration: 'none',
  },
  header: {
    marginBottom: '2.5rem',
  },
  title: {
    fontSize: '2rem',
    color: 'var(--color-secondary-900)',
  },
  itemCount: {
    fontSize: '1.2rem',
    color: 'var(--color-neutral-400)',
    fontWeight: '400',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 380px',
    gap: '4rem',
    alignItems: 'start',
  },
  itemsSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2rem',
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
  },
  cartItem: {
    display: 'flex',
    gap: '1.5rem',
    paddingBottom: '1.5rem',
    borderBottom: '1px solid var(--color-neutral-100)',
    alignItems: 'center',
  },
  itemImageWrapper: {
    width: '120px',
    height: '120px',
    backgroundColor: '#F8F8F8',
    borderRadius: '0.75rem',
    overflow: 'hidden',
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemImage: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain' as const,
  },
  itemDetails: {
    flex: 1,
  },
  itemCategory: {
    fontSize: '0.8rem',
    color: 'var(--color-neutral-400)',
    marginBottom: '0.25rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  itemTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: 'var(--color-secondary-900)',
    marginBottom: '0.5rem',
  },
  unitPrice: {
    fontSize: '0.9rem',
    color: 'var(--color-neutral-500)',
    marginBottom: '1rem',
  },
  itemControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  quantitySelector: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid var(--color-neutral-200)',
    borderRadius: '1.5rem',
    padding: '0.25rem',
  },
  qtyBtn: {
    background: 'none',
    border: 'none',
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'var(--color-secondary-600)',
    transition: 'color 0.2s',
  },
  qtyDisplay: {
    width: '30px',
    textAlign: 'center' as const,
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  itemRight: {
    textAlign: 'right' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
    height: '100px',
  },
  itemTotalPrice: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: 'var(--color-secondary-900)',
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--color-neutral-400)',
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    cursor: 'pointer',
    transition: 'color 0.2s',
  },
  clearBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--color-neutral-400)',
    fontSize: '0.9rem',
    cursor: 'pointer',
    textAlign: 'left' as const,
    padding: '0',
    width: 'fit-content',
  },
  summarySidebar: {
    position: 'sticky' as const,
    top: '2rem',
  },
  summaryCard: {
    backgroundColor: '#F9F9F9',
    padding: '2rem',
    borderRadius: '1.5rem',
  },
  summaryTitle: {
    fontSize: '1.25rem',
    marginBottom: '1.5rem',
    color: 'var(--color-secondary-900)',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem',
    fontSize: '0.95rem',
    color: 'var(--color-secondary-600)',
  },
  totalRow: {
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid var(--color-neutral-200)',
    fontSize: '1.1rem',
    fontWeight: '700',
    color: 'var(--color-secondary-900)',
  },
  shippingPromo: {
    fontSize: '0.85rem',
    color: '#E67E22',
    marginTop: '1rem',
    fontWeight: '500',
  },
  checkoutBtn: {
    width: '100%',
    padding: '1.25rem',
    backgroundColor: 'var(--color-secondary-900)',
    color: 'white',
    border: 'none',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    fontWeight: '700',
    marginTop: '2rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  continueShoppingLink: {
    display: 'block',
    textAlign: 'center' as const,
    marginTop: '1.5rem',
    fontSize: '0.9rem',
    color: 'var(--color-neutral-400)',
    textDecoration: 'none',
  }
}
