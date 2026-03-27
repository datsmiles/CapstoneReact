import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import ShopPage from './pages/ShopPage'
import CartPage from './pages/CartPage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'
import { CartProvider } from './context/CartContext'

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="shop/:id" element={<ProductPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:id" element={<BlogPostPage />} />
        </Route>
      </Routes>
    </CartProvider>
  )
}

export default App
