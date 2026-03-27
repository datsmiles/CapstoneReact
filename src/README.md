# Tecvinson Frontend Training, Cohort 2025
# Shoppr: React Capstone Project

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [User Stories](#2-user-stories)
3. [The API](#3-the-api)
4. [API Endpoints](#4-api-endpoints)
5. [App Architecture](#5-app-architecture)
6. [Routing Requirements](#6-routing-requirements)
7. [React Concepts to Apply](#7-react-concepts-to-apply)
8. [Design System](#8-design-system)
9. [Tools & Libraries](#9-tools--libraries)
10. [Best Practices](#10-best-practices)
11. [Common Pitfalls](#11-common-pitfalls)
12. [Resources](#12-resources)
13. [Suggested Build Order](#13-suggested-build-order)
14. [Grading Structure](#14-grading-structure)
15. [Submission Instructions](#15-submission-instructions)

---

## 1. Project Overview

Shoppr Lite is a front-end e-commerce application. You are required to build it using React, consuming a live REST API for your data. The project is your opportunity to apply everything covered in Modules 15–17 in one cohesive, real-world context.

The app allows shoppers to browse products, view product detail, and manage a cart. It also has a blog section powered by a separate API endpoint. You are expected to design and structure the application yourself. The user stories below define what needs to work, not how to build it.

### Live Demo

A reference implementation is deployed at:

> **[https://ngshoppr.netlify.app](https://ngshoppr.netlify.app)**

Use this to understand what the finished app should do and how it should behave. Do not copy the code; build your own version from scratch. Your implementation may look completely different. What matters is that it meets all the user stories.

### Scope

There is no user authentication, no real payment processing, and no persistent cart. The cart resets when the page is refreshed. This is intentional. The goal is to demonstrate your React fundamentals.

---

## 2. User Stories

These define what the finished application must do. Use them to guide your build and to verify your implementation is complete.

### Browsing & Shopping

- **US-01** — As a shopper, I want to browse all available products so I can discover what the store sells.
- **US-02** — As a shopper, I want to filter products by category so I only see items relevant to me.
- **US-03** — As a shopper, I want to search for a product by name or description so I can quickly find what I'm looking for.
- **US-04** — As a shopper, I want to sort products by price (low to high, high to low) and by rating so I can compare options.
- **US-05** — As a shopper, I want my active filter and search term to be reflected in the URL so I can share or bookmark that view.
- **US-06** — As a shopper, I want to see a loading state while products are being fetched so the page doesn't appear broken.
- **US-07** — As a shopper, I want to see an error message if products fail to load so I know something went wrong.
- **US-08** — As a shopper, I want a helpful message when no products match my filters so I'm not staring at a blank page.

### Product Detail

- **US-09** — As a shopper, I want to view a product's full details (name, price, description, rating, brand, stock level) so I can make an informed decision.
- **US-10** — As a shopper, I want to choose a quantity before adding to cart so I don't have to add the same item multiple times.
- **US-11** — As a shopper, I want to see how many units of the product are in stock.
- **US-12** — As a shopper, I want to see related products from the same category so I can discover similar items.

### Cart

- **US-13** — As a shopper, I want items added to my cart to appear immediately without a page reload.
- **US-14** — As a shopper, I want to see the product image, name, and price for each cart item.
- **US-15** — As a shopper, I want to update the quantity of a cart item.
- **US-16** — As a shopper, I want to remove an individual item from my cart.
- **US-17** — As a shopper, I want to see a subtotal, shipping cost, and estimated tax in an order summary.
- **US-18** — As a shopper, I want to know how much more I need to spend to qualify for free shipping.
- **US-19** — As a shopper, I want to be asked to confirm before clearing my entire cart.
- **US-20** — As a shopper, I want to see a live cart item count in the navigation bar that updates instantly.

### Blog

- **US-21** — As a visitor, I want to see a preview of the latest blog posts on the homepage so I can discover content.
- **US-22** — As a visitor, I want clicking a blog preview to take me to that post's full content.

### Loading & Error States

- **US-23** — As a user, I want to see a loading indicator whenever a page is fetching data so the app never looks frozen or broken.
- **US-24** — As a user, I want to see a friendly 404 page if I navigate to a URL that doesn't exist, with a clear message and a link back to a working page.

---

## 3. The API

### Base URL

```
https://dummyjson.com
```

### What kind of API is this?

This is a **public fake REST API**, also called a mock or seed API. It exists to give you realistic data to build against without needing a real backend. Before writing any code, you need to understand these characteristics:

#### The data is pre-seeded and realistic

Unlike some fake APIs, DummyJSON uses realistic product names like `"iPhone X"`, `"Huawei P30"`, and `"Brown Perfume"`. The data is fixed and consistent — the same request will return the same data every time.

#### Write operations do not persist

The API exposes `POST`, `PUT`, and `DELETE` endpoints. They will return a success response, but **nothing is actually saved**. Any data you write will not be there on the next request. This is why your cart must be managed entirely in local React state; you cannot rely on the API to store it.

#### No authentication required

All endpoints are fully open. Every request is a plain `GET` with no tokens, no headers, nothing to configure.

#### Image fields are absolute URLs

The `thumbnail` field on a product object is a complete, ready-to-use URL, for example:
```
https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png
```
You do **not** need to prefix it with anything. Use it directly as your `src` attribute.

#### Prices are numbers, not strings

The `price` field comes back as a proper JavaScript number: `9.99`. You can use it in arithmetic directly without any conversion. However, be aware that the prices are in US Dollars and represent the raw value without formatting — you will still want to format them for display using something like `toLocaleString`.

#### Products are wrapped in an envelope object

This is one of the most important things to understand about this API. When you fetch a list of products, the response is **not** a plain array. It is an object that contains the array plus pagination metadata:

```json
{
  "products": [ ... ],
  "total": 194,
  "skip": 0,
  "limit": 30
}
```

This means you cannot use the response directly as your products array. You must always access `response.products` to get the actual list. The same applies to blog posts — `response.posts` gives you the array. We will cover this in detail in the endpoints section below.

#### The server is fast and reliable

DummyJSON is a well-maintained, widely used public API. Response times are generally under 300ms. You should still always handle loading states — never assume data arrives instantly — but you are unlikely to experience the 1–3 second delays you might encounter with free-tier self-hosted servers.

---

## 4. API Endpoints

You are required to use the following endpoints.

---

### `GET /products?limit=100`

Returns a paginated wrapper object containing an array of products.

```json
{
  "products": [
    {
      "id": 1,
      "title": "Essence Mascara Lash Princess",
      "description": "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects.",
      "price": 9.99,
      "rating": 4.94,
      "stock": 5,
      "brand": "Essence",
      "category": "beauty",
      "thumbnail": "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png"
    }
  ],
  "total": 194,
  "skip": 0,
  "limit": 100
}
```

**Things to note:**

- The array lives inside the `products` key. You must access `data.products`, not `data` itself, when using this in your component.
- `price` is already a number. No conversion needed before arithmetic.
- `thumbnail` is a complete, absolute URL. Use it directly as an image `src`.
- `rating` is a number between 1 and 5, directly on the product object — it is not nested inside a `meta` object.
- `stock` is directly on the product object — it is not nested. It represents the total available units.
- `brand` is directly on the product object. Some products may not have a brand — use optional chaining (`product?.brand`) to be safe.
- `category` is a lowercase hyphenated slug, for example `"beauty"`, `"mens-shirts"`, `"home-decoration"`. These must match exactly when you filter by category.
- `?limit=100` tells the API to return up to 100 products in one request. Without it, you only get the default of 30.

---

### `GET /products/:id`

Returns a single product object directly (not wrapped in an envelope).

```json
{
  "id": 1,
  "title": "Essence Mascara Lash Princess",
  "description": "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects.",
  "price": 9.99,
  "rating": 4.94,
  "stock": 5,
  "brand": "Essence",
  "category": "beauty",
  "thumbnail": "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png",
  "images": [
    "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/1.png"
  ]
}
```

**Things to note:**

- This time the product is returned directly — there is no wrapper. You can use `data` immediately.
- This is the endpoint you will call from your `ProductPage` using the `:id` URL parameter.
- The `images` array contains additional product photos you can optionally display in a gallery. `thumbnail` is the primary image.
- `id` is a **number**, not a string. When you read it from `useParams()`, it comes back as a string from the URL. If you need to compare it against a product's `id` field, be aware of this type difference. You can coerce it with `Number(id)` or simply pass it directly to the URL since the API accepts both.

---

### `GET /posts?limit=30`

Returns a paginated wrapper object containing an array of posts. This is used to power the blog section of the app.

```json
{
  "posts": [
    {
      "id": 1,
      "title": "His mother had always taught him",
      "body": "His mother had always taught him not to ever think of himself as better than others. He'd tried to live by this motto...",
      "userId": 121,
      "tags": ["history", "american", "crime"],
      "reactions": {
        "likes": 192,
        "dislikes": 25
      },
      "views": 305
    }
  ],
  "total": 251,
  "skip": 0,
  "limit": 30
}
```

**Things to note:**

- The array lives inside the `posts` key, just like `products` above. Access `data.posts`, not `data`.
- The field for the post's written content is called `body`, not `content`. When you display the post text in your UI, you will read from `post.body`.
- There is no `author` name field. The post only has a `userId` (a number). You can display it as `"Author #${post.userId}"` or simply omit the author display. Do not expect a name string.
- There is no `date` or `publishedAt` field. If you want to show a date, you will need to either omit it or generate a synthetic one.
- There is no `readTime` field. Same applies — omit it or calculate a rough estimate from the word count.
- `tags` is an array of strings that you can optionally display as labels on the post card.

---

### `GET /posts/:id`

Returns a single post object directly (not wrapped in an envelope).

```json
{
  "id": 1,
  "title": "His mother had always taught him",
  "body": "His mother had always taught him not to ever think of himself as better than others...",
  "userId": 121,
  "tags": ["history", "american", "crime"],
  "reactions": {
    "likes": 192,
    "dislikes": 25
  },
  "views": 305
}
```

**Things to note:**

- Returned directly, no wrapper. Use `data` immediately.
- Same field names as above. Your `PostPage` reads `post.body` for the content and `post.title` for the heading.

---

### Endpoints You Do Not Need

| Endpoint | Reason not used |
|----------|----------------|
| `GET /products/categories` | Returns the full list of category slugs. You don't need to fetch this because your categories are already defined in `constants.js`. |
| `GET /products/category/:name` | Fetches products pre-filtered by category on the server. You don't need this because you fetch all products once and filter client-side using `useMemo`. |
| `GET /carts` | Cart items from this endpoint carry no image data and no variant information. There is no way to reconstruct a usable cart from this data. The cart must live in local React state. |
| `GET /users` | No user authentication is required in this project. |

---

## 5. App Architecture

You are required to organise your code in layers. The exact folder names and file names are your decision, but each layer must have a clear, single responsibility.

**Entry point:** The file that mounts your React app (`main.jsx` or `index.jsx`). Your router and context providers are set up here. Nothing else goes here.

**`App.jsx`:** Defines your routes. This is the top-level component rendered inside your providers.

**Context:** Files that manage global shared state. You will need at minimum a cart context. Each context file should expose a custom hook so consumers don't need to import the context object directly.

**Hooks:** Any reusable logic that uses React hooks belongs here, separate from your components. If you find yourself copying the same `useState`/`useEffect` pattern into multiple components, it should be a custom hook.

**Components:** Reusable UI pieces not tied to any specific page. A component used in more than one place should not live inside a page file.

**Pages:** One component per route. Each page is responsible for fetching the data it needs, managing its own state, and composing smaller components into a view.

**Utils:** Pure helper functions and shared constants. If a function doesn't use hooks and doesn't return JSX, it belongs here.

---

## 6. Routing Requirements

You are required to use **React Router v6**, specifically `BrowserRouter`, `Routes`, and `Route` (the standard JSX-based v6 API).

### Entry point setup

`BrowserRouter` must wrap your entire application in your entry point file, outside of `App`:

```jsx
// main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
```

### Route structure

Your routes must be defined inside `App.jsx` using `Routes` and `Route`. You are required to use a **nested route with a shared layout** so that your navigation and footer persist across page changes without re-mounting:

```jsx
// App.jsx
import { Routes, Route } from 'react-router-dom'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="shop/:id" element={<ProductPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:id" element={<PostPage />} />
        <Route path="*"        element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
```

### Routes in this app

| URL | Component | Notes |
|-----|-----------|-------|
| `/` | `HomePage` | Index route (default child of Layout) |
| `/shop` | `ShopPage` | Accepts `?q=` and `?cat=` query params |
| `/shop/:id` | `ProductPage` | `:id` read via `useParams` |
| `/cart` | `CartPage` | Session-only cart |
| `/blog` | `BlogPage` | All posts with search |
| `/blog/:id` | `PostPage` | Single post, `:id` read via `useParams` |
| `*` | `NotFoundPage` | Catch-all for any unmatched URL |

Your `Layout` component must render an `<Outlet />` where the active page should appear:

```jsx
// Layout.jsx (simplified)
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div>
      <nav>...</nav>
      <main>
        <Outlet />
      </main>
      <footer>...</footer>
    </div>
  )
}
```

### Navigation

Use `<Link>` and `<NavLink>` for clickable navigation in JSX. Use `useNavigate()` for programmatic navigation triggered by events (e.g. a back button, or after a form action).

```jsx
// Declarative
<Link to="/shop">Browse shop</Link>

// NavLink — applies active styling automatically
<NavLink to="/cart" className={({ isActive }) => isActive ? 'active' : ''}>
  Cart
</NavLink>

// Programmatic
const navigate = useNavigate()
navigate(-1)          // go back one step in history
navigate('/shop')     // navigate to a specific route
```

### URL as state

Your ShopPage filter and search state must be stored in the URL as query parameters so that filtered views are shareable and bookmarkable. Use `useSearchParams` to read and write them.

### 404 Catch-all Route

You are required to handle URLs that don't match any defined route. Add a `path="*"` route as the last child of your layout route. React Router will render it for any URL that falls through all other routes.

```jsx
<Route path="*" element={<NotFoundPage />} />
```

Inside your `NotFoundPage`, use `useLocation` to read the URL the user tried to visit and display it clearly so they understand what went wrong.

```jsx
const location = useLocation()
// location.pathname === "/some/unknown/route"
```

---

## 7. React Concepts to Apply

The following is a revision summary of the concepts you are required to demonstrate in this project. You are expected to apply these, not just know them.

---

### JSX & Components

Every piece of UI you build is a component: a JavaScript function that returns JSX. Components accept **props**, which is how a parent passes data down to a child. Data flows one direction: parent to child. If a child needs to trigger a change in a parent, the parent must pass a callback function as a prop.

---

### Conditional Rendering

Render things only when the conditions are right. Two patterns you will use throughout this project:

```jsx
// Short-circuit — renders when condition is truthy
{isLoading && <Spinner />}

// Ternary — renders one of two things
{loading ? <Skeleton /> : <ProductList />}
```

---

### List Rendering

Use `.map()` to render a list of items from an array. Every item rendered in a list **must** have a unique, stable `key` prop. Never use the array index as a key when the list can be filtered, sorted, or reordered.

```jsx
{products.map(product => (
  <ProductCard key={product.id} product={product} />
))}
```

---

### useState

Adds a piece of local state to a component. The component re-renders whenever the state changes. Never mutate state directly; always use the setter function.

```jsx
const [count, setCount] = useState(0)

// Update using a value
setCount(1)

// Update based on previous value (always prefer this for derived updates)
setCount(prev => prev + 1)
```

---

### useEffect

Runs a side effect after the component renders. Fetching data, setting a document title, subscribing to events: these are all side effects. The dependency array controls when it re-runs.

```jsx
useEffect(() => {
  // runs after render

  return () => {
    // cleanup — runs before the next effect, or when the component unmounts
  }
}, [dependency]) // re-runs when `dependency` changes
```

- `[]` runs once after the first render only
- `[value]` runs again whenever `value` changes
- No array means it runs after every render (almost always wrong)

---

### useRef

Returns a mutable object whose `.current` property persists across renders without causing re-renders when it changes. Two uses:

**Accessing a DOM element directly:**
```jsx
const inputRef = useRef(null)

useEffect(() => {
  inputRef.current.focus()
}, [])

return <input ref={inputRef} />
```

**Storing a value between renders without triggering a re-render:**
```jsx
const timerRef = useRef(null)
timerRef.current = setTimeout(...)
```

---

### useContext

Lets any component read shared state without prop drilling. Consists of three steps:

```jsx
// 1. Create
const CartContext = createContext(null)

// 2. Provide — wrap the part of the tree that needs access
<CartContext.Provider value={{ items, addItem }}>
  {children}
</CartContext.Provider>

// 3. Consume — anywhere inside the Provider
const { items, addItem } = useContext(CartContext)
```

Expose a custom hook from your context file to keep consumer imports clean:

```jsx
export function useCart() {
  return useContext(CartContext)
}
```

---

### useMemo

Caches the result of a computation and only recalculates it when one of its dependencies changes. Use it when a computation is expensive (filtering or sorting large arrays) or when referential stability matters.

```jsx
const filtered = useMemo(() => {
  return products.filter(p => p.category === category)
}, [products, category])
```

Without this, the filter would re-run on every render, including those caused by unrelated state changes like a user hovering a button.

---

### useCallback

Caches a function so the same reference is returned across renders, unless its dependencies change. Use it for functions passed as props or placed in a context value, where a new reference on every render would cause unnecessary child re-renders.

```jsx
const addItem = useCallback((product, qty) => {
  setItems(prev => [...prev, { product, qty }])
}, []) // stable - no dependencies
```

---

### Custom Hooks

A custom hook is a function whose name starts with `use` and that calls other hooks inside it. Extract logic into a custom hook whenever the same combination of hooks appears in more than one component.

```jsx
// Instead of repeating this in every component that fetches data:
const [data, setData] = useState(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)
useEffect(() => { fetch(url).then(...) }, [url])

// Write it once as a custom hook:
const { data, loading, error } = useFetch(url)
```

Custom hooks follow the same rules as all hooks: call them only at the top level of a component or another hook, never inside loops or conditionals.

---

### useParams

Reads dynamic segments from the current URL. Required on your product detail page and blog post page.

```jsx
// Route: /shop/:id
// URL:   /shop/1

const { id } = useParams()
// id === "1"  ← note: always a string, even though the API's id is a number
```

---

### useSearchParams

Reads and writes the query string portion of the URL. Required on your shop page so that filter state lives in the URL.

```jsx
const [searchParams, setSearchParams] = useSearchParams()
const category = searchParams.get('cat') || 'All'
```

---

## 8. Design System

The reference app is built around a specific colour palette. You are not required to use these exact colours. You are free to design your app however you like. This section documents the palette used in the demo so you have a reference if you want to match it closely or draw inspiration from it.

### Colour Palette

#### Primary (Gold)

| Token | Value |
|-------|-------|
| `--color-primary-50` | `#fefaf2` |
| `--color-primary-100` | `#fdf3dc` |
| `--color-primary-200` | `#f9e4b0` |
| `--color-primary-300` | `#f2d078` |
| `--color-primary-400` | `#D4AF70` |
| `--color-primary-500` | `#C9A96E` |
| `--color-primary-600` | `#B8944A` |
| `--color-primary-700` | `#96763A` |
| `--color-primary-800` | `#755B2D` |
| `--color-primary-900` | `#4A3A1C` |

#### Secondary (Near-black)

| Token | Value |
|-------|-------|
| `--color-secondary-50` | `#f5f5f5` |
| `--color-secondary-100` | `#e8e8e8` |
| `--color-secondary-200` | `#d1d1d1` |
| `--color-secondary-300` | `#a1a1a1` |
| `--color-secondary-400` | `#6b6b6b` |
| `--color-secondary-500` | `#4A4A4A` |
| `--color-secondary-600` | `#2e2e2e` |
| `--color-secondary-700` | `#1a1a1a` |
| `--color-secondary-800` | `#0F0F0F` |
| `--color-secondary-900` | `#0A0A0A` |

#### Tertiary (Warm cream)

| Token | Value |
|-------|-------|
| `--color-tertiary-50` | `#ffffff` |
| `--color-tertiary-100` | `#F8F6F3` |
| `--color-tertiary-200` | `#f0ece5` |
| `--color-tertiary-300` | `#e4ddd3` |
| `--color-tertiary-400` | `#cec4b7` |
| `--color-tertiary-500` | `#b5a898` |

#### Neutral (Gray scale)

| Token | Value |
|-------|-------|
| `--color-neutral-50` | `#f9fafb` |
| `--color-neutral-100` | `#f3f4f6` |
| `--color-neutral-200` | `#e5e7eb` |
| `--color-neutral-300` | `#d1d5db` |
| `--color-neutral-400` | `#9ca3af` |
| `--color-neutral-500` | `#6b7280` |
| `--color-neutral-600` | `#4b5563` |
| `--color-neutral-700` | `#374151` |
| `--color-neutral-800` | `#1f2937` |
| `--color-neutral-900` | `#111827` |

#### Error

| Token | Value |
|-------|-------|
| `--color-error-50` | `#fef2f2` |
| `--color-error-100` | `#fee2e2` |
| `--color-error-200` | `#fecaca` |
| `--color-error-300` | `#fca5a5` |
| `--color-error-400` | `#f87171` |
| `--color-error-500` | `#ef4444` |
| `--color-error-600` | `#dc2626` |
| `--color-error-700` | `#b91c1c` |
| `--color-error-800` | `#991b1b` |
| `--color-error-900` | `#7f1d1d` |

#### Warning

| Token | Value |
|-------|-------|
| `--color-warning-50` | `#fff7ed` |
| `--color-warning-100` | `#ffedd5` |
| `--color-warning-200` | `#fed7aa` |
| `--color-warning-300` | `#fdba74` |
| `--color-warning-400` | `#fb923c` |
| `--color-warning-500` | `#f97316` |
| `--color-warning-600` | `#ea580c` |
| `--color-warning-700` | `#c2410c` |
| `--color-warning-800` | `#9a3412` |
| `--color-warning-900` | `#7c2d12` |

#### Success

| Token | Value |
|-------|-------|
| `--color-success-50` | `#f0fdf4` |
| `--color-success-100` | `#dcfce7` |
| `--color-success-200` | `#bbf7d0` |
| `--color-success-300` | `#86efac` |
| `--color-success-400` | `#4ade80` |
| `--color-success-500` | `#22c55e` |
| `--color-success-600` | `#16a34a` |
| `--color-success-700` | `#15803d` |
| `--color-success-800` | `#166534` |
| `--color-success-900` | `#14532d` |

#### Rating

| Token | Value |
|-------|-------|
| `--color-rating-300` | `#fcd34d` |
| `--color-rating-400` | `#fbbf24` |
| `--color-rating-500` | `#f59e0b` |
| `--color-rating-600` | `#d97706` |

### Using these colours in your app

However you choose to style your app, having a defined palette makes it visually consistent. Define your colours once (as CSS custom properties, a JS constants file, or inside your framework's config) and reference them throughout rather than scattering magic hex values everywhere.

```css
/* Example — CSS custom properties */
:root {
  --color-brand-gold:  #C9A96E;
  --color-brand-black: #0A0A0A;
  --color-brand-cream: #F8F6F3;
}

.button-primary {
  background-color: var(--color-brand-gold);
  color: var(--color-brand-black);
}
```

---

## 9. Tools & Libraries

### Required

| Tool | Purpose |
|------|---------|
| **React 18+** | UI framework |
| **React Router DOM v6** | Client-side routing |
| **Vite** | Build tool and development server |

### Recommended

| Tool | Purpose |
|------|---------|
| **lucide-react** | Icon library with clean, consistent icons as React components |

### Styling

You are free to style your application however you choose. Options include plain CSS, CSS Modules, Tailwind CSS, styled-components, or any other approach you are comfortable with. What matters is that your app is usable and visually coherent, not which tool you used to get there.

### HTTP

You do not need an external HTTP library. Use the native browser `fetch` API. It is good to understand `fetch` directly before reaching for abstractions like axios.

### Development Tools

| Tool | Why it matters |
|------|---------------|
| **React DevTools** (browser extension) | Inspect your component tree, see the current value of props, state, and context in real time. Essential for debugging. |
| **Network tab** (browser DevTools) | Watch your API calls: see the request URL, response data, status code, and timing. |
| **ESLint** | Catches common React mistakes: missing keys, missing dependencies in hooks, unused variables. |

---

## 10. Best Practices

**Always handle all three fetch states.** Every component that fetches data must handle loading, error, and the success state. Never attempt to render data without first checking it isn't `null`.

```jsx
if (loading) return <Skeleton />
if (error)   return <ErrorMessage />
return <Content data={data} />
```

**Unwrap the API envelope before using data.** DummyJSON wraps all list responses in an object. Always access the inner array:

```js
// After your fetch completes, your response object looks like this:
// { products: [...], total: 194, skip: 0, limit: 100 }

// Wrong — this is the whole wrapper object, not the array
const products = data

// Correct — go one level deeper
const products = data?.products  // ← the actual array
const posts    = data?.posts     // ← same pattern for blog posts
```

Forgetting this is the single most common mistake when using this API. If your `.map()` crashes, check that you are not trying to map over the wrapper object itself.

**Use optional chaining for API fields that may be absent.** Not every product is guaranteed to have every field. Use `?.` to avoid runtime crashes.

```js
product?.brand
product?.rating
```

**Never use array index as a key** when your list can be filtered, sorted, or reordered. Use the item's unique `id` from the API.

**Never store derived state in `useState`.** If a value can be computed from existing state, compute it. Do not store a copy of it in a separate state variable, as that creates two sources of truth that can go out of sync.

```js
// Wrong — redundant state that can drift
const [total, setTotal] = useState(0)

// Correct — derive it
const total = items.reduce((sum, item) => sum + item.price * item.qty, 0)
```

**Clean up side effects.** When a `useEffect` starts something ongoing (a fetch, a timer, an event listener), return a cleanup function. This prevents errors when a component unmounts before an async operation completes.

**Keep components focused.** If a component is doing many unrelated things and growing long, break it into smaller sub-components or extract logic into a custom hook.

**Centralise magic strings.** Your API base URL, category names, and other repeated constants should live in one place and be imported where needed, not typed inline repeatedly.

---

## 11. Common Pitfalls

### Crashing on `.map()` with "data.map is not a function"

**Symptom:** The app crashes immediately on load with `TypeError: data.map is not a function` or `products.map is not a function`.

**Cause:** This is the most common mistake with DummyJSON. The products endpoint does not return a plain array — it returns an object with a `products` key. If you call `.map()` on the raw response object, JavaScript rightfully tells you that objects don't have a `.map()` method.

**Fix:** Always unwrap the envelope:

```js
// Wrong — treating the whole response as the array
const products = data
products.map(...)  // data is { products: [...], total: 194, ... }

// Correct — extract the array from inside the object
const products = data?.products  // ✅ now this is the array
products?.map(...)
```

The same applies to blog posts: `data?.posts`, not `data`.

---

### Category filter shows zero results

**Symptom:** Selecting a category from the sidebar shows no products, even though you can see products of that type in the full list.

**Cause:** The category strings in your filter don't exactly match what the API puts on each product. DummyJSON uses lowercase hyphenated slugs: `"mens-shirts"`, `"home-decoration"`, `"womens-dresses"`. If your `CATEGORIES` array uses different casing or spacing, the comparison `p.category === category` will always be false.

**Fix:** Make sure the strings in your `CATEGORIES` constant exactly match the slugs the API returns. You can verify by `console.log`-ing a product from the API and reading its `category` field directly.

---

### Crash on first render before data arrives

**Symptom:** `Cannot read properties of null (reading 'map')` or `Cannot read properties of undefined`.

**Cause:** `data` from your fetch starts as `null`. Calling `data.products.map()` or `data.map()` immediately crashes before the request completes.

**Fix:** Guard before rendering. Check for `loading` or check that `data` is not null before trying to use it. Optional chaining (`?.`) is your friend here:

```js
const products = data?.products ?? []
```

This reads: "if `data` exists, give me `data.products`; if not, give me an empty array." Your `.map()` over an empty array renders nothing gracefully instead of crashing.

---

### Images are broken

**Symptom:** All product images show the broken image icon.

**Cause:** You may have accidentally kept the old pattern of prepending a base URL to the image path. DummyJSON's `thumbnail` field is already a complete URL.

**Fix:** Use the `thumbnail` value directly with no modification:

```jsx
// Wrong — double-prefixing a URL that's already absolute
<img src={`https://dummyjson.com${product.thumbnail}`} />

// Correct — use it as-is
<img src={product.thumbnail} />
```

Always add an `onError` handler on `<img>` elements as a fallback in case a specific image fails to load.

---

### Rating and stock are undefined

**Symptom:** Stars don't render, stock status is missing, or you see `NaN` where a number should appear.

**Cause:** On the old API, rating and stock were nested inside a `meta` object: `product.meta.rating`, `product.meta.total_stock`. On DummyJSON these fields are flat — directly on the product:

```js
// Old API — nested
product.meta.rating
product.meta.total_stock

// DummyJSON — flat, directly on the product
product.rating
product.stock
```

**Fix:** Update every place in your code that reads these fields. Search your codebase for `meta.rating` and `meta.total_stock` and replace them.

---

### Blog post content is blank

**Symptom:** The post page renders but the body text is empty.

**Cause:** The old API used `post.content` for the written body of a post. DummyJSON uses `post.body`.

**Fix:**

```jsx
// Wrong
<p>{post.content}</p>

// Correct
<p>{post.body}</p>
```

---

### Removing a cart item doesn't update the total

**Symptom:** An item is visually removed but the order summary still shows the old total.

**Cause:** State was mutated directly (`.splice()`, direct property assignment) instead of returning a new array. React didn't see a change and didn't re-render.

**Fix:** Always return a new array from your state setter:

```js
setItems(prev => prev.filter(item => item.id !== id))
```

---

### `useEffect` runs on every render / causes an infinite loop

**Symptom:** Your API is called hundreds of times, the browser tab becomes unresponsive.

**Cause:** Missing dependency array, or a new object/array being created on every render and placed in the dependency array.

**Fix:** Always provide a dependency array. If you only want the effect to run once on mount, use `[]`.

---

## 12. Resources

### Official Documentation

| Resource | URL |
|----------|-----|
| React | https://react.dev |
| React Router v6 | https://reactrouter.com/en/main |
| MDN Fetch API | https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API |
| Tailwind CSS | https://tailwindcss.com/docs |
| Lucide Icons | https://lucide.dev/icons |
| DummyJSON API Docs | https://dummyjson.com/docs |

### Hooks Reference

| Hook | Link |
|------|------|
| useState | https://react.dev/reference/react/useState |
| useEffect | https://react.dev/reference/react/useEffect |
| useContext | https://react.dev/reference/react/useContext |
| useRef | https://react.dev/reference/react/useRef |
| useMemo | https://react.dev/reference/react/useMemo |
| useCallback | https://react.dev/reference/react/useCallback |

### Essential Reading

| Article | Why |
|---------|-----|
| "Thinking in React" (react.dev) | The canonical guide to breaking a UI into components and deciding where state lives |
| "You Might Not Need an Effect" (react.dev) | Explains the most common `useEffect` misuse patterns |
| "A Complete Guide to useEffect" (overreacted.io) | Deep-dive on how effects, cleanup, and dependencies actually work |

---

*Shoppr Lite Capstone*

---

## 13. Suggested Build Order

Do not try to build the whole app at once. Work in vertical slices — get one feature fully working before moving to the next. This order is recommended because each step gives you something you can see and test before you add more complexity.

**Estimated total time: 25–40 hours** depending on your pace and how much you customise the UI.

---

### Phase 1 — Scaffolding

Get a working shell before writing any real features.

1. Create your project with Vite: `npm create vite@latest shoppr-lite -- --template react`
2. Install React Router: `npm install react-router-dom`
3. Set up `main.jsx` with `BrowserRouter` wrapping `App`
4. Define all routes in `App.jsx` with placeholder page components (each just returns a heading for now)
5. Build your `Layout` component with a `<nav>`, `<Outlet />`, and a `<footer>`
6. Add navigation links and verify all routes render without crashing
7. Add your 404 catch-all route and `NotFoundPage`

**Goal:** Every route renders. Clicking nav links works. Visiting `/nonsense` shows your 404 page.

---

### Phase 2 — Product Listing

8. Create a custom data-fetching hook that handles `loading`, `error`, and `data` state
9. Fetch all products in `ShopPage` using your hook — call `https://dummyjson.com/products?limit=100`
10. **Remember to unwrap:** use `data?.products` not `data` directly
11. Build a `ProductCard` component and render a grid of cards using `product.title` and `product.thumbnail`
12. Add category filter using `useSearchParams` — the selected category must appear in the URL (`?cat=laptops`)
13. Add search using `useSearchParams` — the search term must also live in the URL (`?q=keyboard`)
14. Add sort controls (price low→high, high→low, rating) — sort by `product.rating` directly, not `product.meta.rating`
15. Apply all three (filter, search, sort) together using `useMemo`
16. Handle the empty-results state with a helpful message

**Goal:** The shop page displays products, filter/search/sort all work, and the URL reflects the active state.

---

### Phase 3 — Product Detail

17. Fetch a single product in `ProductPage` using `useParams` to get the ID
18. Call `GET /products/:id` — this returns the product directly, no unwrapping needed
19. Display all product fields: `product.title`, `product.price`, `product.description`, `product.rating`, `product.brand`, `product.stock`
20. Add the quantity input
21. Add the "Add to Cart" button — no colour or size selection is needed since DummyJSON products have no variants
22. Fetch and display related products (same category, excluding the current product)

**Goal:** You can view a product and add it to the cart with a chosen quantity.

---

### Phase 4 — Cart

23. Create `CartContext`
24. Expose a custom hook from the context file so consumers don't need to import the context object directly
25. Wrap your app in `CartContext.Provider` inside `main.jsx`
26. Wire the "Add to Cart" button on `ProductPage` to call your cart's add function
27. Build `CartPage` — list each item with its image, name, price, and quantity controls
28. Implement remove and quantity update functions in the cart page
29. Build the order summary: subtotal (derived, not stored in state), shipping, tax, total
30. Add the free-shipping progress indicator
31. Add the "Clear cart" button with a confirmation dialog
32. Display live cart item count in the navbar

**Goal:** You can add items, adjust quantities, remove items, and see totals update instantly.

---

### Phase 5 — Blog & Polish

33. Fetch all blog posts in `BlogPage` using `GET /posts?limit=30`
34. **Remember to unwrap:** use `data?.posts` not `data`
35. Display post previews using `post.title` and `post.body`
36. Link each preview to `/blog/:id`
37. Fetch and display a single post in `PostPage` using `GET /posts/:id` — use `post.body` for the content
38. Add blog post previews to `HomePage`
39. Add loading skeletons or spinners to every page that fetches data
40. Review every user story against your implementation and check off each one

**Goal:** All user stories pass. The app handles slow networks and failed fetches gracefully.

---

## 14. Grading Structure

Your submission will be graded across four areas. The breakdown below shows how marks are allocated and what distinguishes each level.

---

### 1. Functionality — 50 points

Each user story is worth approximately 2 points. A story earns full marks if it works correctly in all expected scenarios (including edge cases like empty cart, no search results, or a network error). It earns 1 point if it partially works. It earns 0 if it is missing or broken.

| User Story Group | Stories | Points |
|-----------------|---------|--------|
| Browsing & Shopping | US-01 to US-08 | 16 |
| Product Detail | US-09 to US-12 | 8 |
| Cart | US-13 to US-20 | 16 |
| Blog | US-21 to US-22 | 4 |
| Loading & Error States | US-23 to US-24 | 4 |
| **Total** | | **48\*** |

---

### 2. Code Quality — 25 points

| Criterion | Full marks | Partial | Zero |
|-----------|-----------|---------|------|
| **Architecture** (5 pts) | Clear separation of pages, components, hooks, context, and utils. Each layer has a single responsibility. | Some mixing of concerns; logic in the wrong layer | No meaningful organisation; everything in one file |
| **React patterns** (5 pts) | Correct use of `useState`, `useEffect`, `useContext`, `useMemo`, `useCallback`, and custom hooks where appropriate | Mostly correct; minor misuse (e.g. missing cleanup, redundant state) | Significant misuse: state mutation, missing deps, no context |
| **No derived state** (5 pts) | Cart total, filtered products, and all other computable values are derived; not duplicated in `useState` | One or two redundant state variables | Multiple redundant state variables that go out of sync |
| **Key props & list rendering** (5 pts) | All lists use stable, unique keys from the API (`product.id`, `post.id`). No array indices used as keys on sortable/filterable lists | One or two index keys on non-static lists | Index keys used throughout |
| **API envelope handling** (5 pts) | `data.products` and `data.posts` are correctly unwrapped before use. No crashes from trying to map over the wrapper object. Optional chaining used where fields may be absent. | Mostly correct; one or two unguarded accesses | Not handled — crashes on load |

---

### 3. Robustness — 15 points

| Criterion | Full marks | Partial | Zero |
|-----------|-----------|---------|------|
| **Fetch state handling** (5 pts) | Every data-fetching component handles loading, error, and success. No render attempted before data exists. | Most covered; one or two missing | No loading/error handling anywhere |
| **Optional chaining** (5 pts) | `?.` used consistently for all API fields that may be absent (`brand`, `rating`, `stock`). No runtime crashes from missing fields. | Mostly present; occasional crash possible | Missing throughout |
| **Edge cases** (5 pts) | App handles: empty cart, zero stock, no search results, navigating to a non-existent product ID | Several edge cases handled | No edge case handling |

---

### 4. UI & UX — 10 points

| Criterion | Full marks | Partial | Zero |
|-----------|-----------|---------|------|
| **Visual coherence** (5 pts) | Consistent colours, spacing, and typography throughout. Clearly intentional design, even if simple. | Some pages styled; others unstyled or inconsistent | No styling applied |
| **Usability** (5 pts) | Responsive layout. Navigation is clear. Actions have obvious feedback. Error and empty states are helpful, not confusing. | Mostly usable; one or two confusing interactions | Difficult to navigate or use |

---

### Total: 100 points

| Grade | Score |
|-------|-------|
| Distinction | 85–100 |
| Merit | 70–84 |
| Pass | 55–69 |
| Needs resubmission | Below 55 |

---

## 15. Submission Instructions

### What to submit

You must submit **two things**:

1. **A GitHub repository** containing your complete source code
2. **A live deployed URL** where the app can be used in a browser

Both are required. A repository without a deployed link, or a deployed link without a repository, will not be accepted.

---

### GitHub repository requirements

- The repository must be **public** so it can be reviewed
- The root of the repository must contain your project files (not nested inside a subfolder)
- Your `README.md` must include: your name, a one-line description of the project, and your deployed URL
- Do **not** commit your `node_modules` folder. Your `.gitignore` (created automatically by Vite) already excludes it — do not remove that entry
- Commit regularly throughout development. A single commit with all your code is a red flag. Your commit history should show your build process.

---

### Deploying with Netlify (recommended)

Netlify is free and integrates directly with GitHub. Once connected, every push to your main branch redeploys automatically.

1. Push your project to GitHub
2. Go to [netlify.com](https://netlify.com) and sign up with your GitHub account
3. Click **Add new site → Import an existing project → GitHub**
4. Select your repository
5. Set the build command to `npm run build` and the publish directory to `dist`
6. Click **Deploy site**

**Important — fix client-side routing on Netlify:**
React Router handles routing in the browser, but Netlify serves files from a CDN. When a user refreshes on `/shop/1`, Netlify looks for a file at that path, finds nothing, and returns a 404. To fix this, create a file called `_redirects` in your `public/` folder with this single line:

```
/*    /index.html    200
```

This tells Netlify to serve `index.html` for all paths and let React Router take over.

---

### Submission

Submit your work with a document containing:

- Your full name
- Your GitHub repository URL
- Your deployed app URL

**Deadline:** 87th May, 2026. 

---