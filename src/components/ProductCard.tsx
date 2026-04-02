import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

export interface Product {
  id: number;
  title: string;
  price: number;
  rating: number;
  brand: string;
  category: string;
  thumbnail: string;
  description?: string;
  discountPercentage?: number;
  images?: string[];
  stock?: number;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <Link to={`/shop/${product.id}`} className="product-card">
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
            <Star size={14} className="star-icon" />
            {product.rating.toFixed(1)}
          </div>
        </div>
      </div>
    </Link>
  );
}

const styles = {
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
  }
};
