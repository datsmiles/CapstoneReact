import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'

interface Post {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
  views: number;
  userId: number;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://dummyjson.com/posts?limit=30')
      .then(res => res.json())
      .then(data => {
        setPosts(data.posts)
        setFilteredPosts(data.posts)
        setLoading(false)
      })
      .catch(err => {
        console.error("Failed to fetch posts:", err)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    const query = searchQuery.toLowerCase()
    const filtered = posts.filter(post => 
      post.title.toLowerCase().includes(query) || 
      post.body.toLowerCase().includes(query)
    )
    setFilteredPosts(filtered)
  }, [searchQuery, posts])

  if (loading) return <div style={styles.loading}>Loading articles...</div>

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Blog</h1>
        <p style={styles.subtitle}>Style tips, product news & more</p>
      </div>

      {/* Search Bar */}
      <div style={styles.searchWrapper}>
        <div style={styles.searchContainer}>
          <Search size={18} style={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search posts..." 
            style={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Post List */}
      <div style={styles.postList}>
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <div key={post.id} style={styles.postCard} className="post-card">
              <h2 style={styles.postTitle}>{post.title}</h2>
              <p style={styles.postExcerpt}>
                {post.body.length > 250 ? post.body.substring(0, 250) + '...' : post.body}
              </p>
              <Link to={`/blog/${post.id}`} style={styles.readMore} className="read-more">
                Read more <span style={{ marginLeft: '4px' }}>→</span>
              </Link>
            </div>
          ))
        ) : (
          <p style={styles.noResults}>No posts found matching your search.</p>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    width: '80%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '4rem 0',
  },
  loading: {
    textAlign: 'center' as const,
    padding: '10rem',
    fontSize: '1.2rem',
    color: 'var(--color-neutral-400)',
  },
  header: {
    textAlign: 'left' as const,
    marginBottom: '3rem',
  },
  title: {
    fontSize: '2.5rem',
    color: 'var(--color-secondary-900)',
    marginBottom: '0.5rem',
    fontWeight: '700',
  },
  subtitle: {
    fontSize: '1rem',
    color: 'var(--color-neutral-500)',
  },
  searchWrapper: {
    marginBottom: '3rem',
    display: 'flex',
    justifyContent: 'flex-start',
  },
  searchContainer: {
    position: 'relative' as const,
    width: '100%',
    maxWidth: '450px',
  },
  searchIcon: {
    position: 'absolute' as const,
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--color-neutral-400)',
  },
  searchInput: {
    width: '100%',
    padding: '0.8rem 1rem 0.8rem 3rem',
    borderRadius: '0.5rem',
    border: '1px solid var(--color-neutral-200)',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'all 0.2s',
    backgroundColor: 'white',
  },
  postList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2.5rem',
  },
  postCard: {
    padding: '2.5rem',
    backgroundColor: 'white',
    borderRadius: '1rem',
    border: '1px solid var(--color-neutral-100)',
    transition: 'all 0.3s ease',
  },
  postTitle: {
    fontSize: '1.5rem',
    color: 'var(--color-secondary-900)',
    marginBottom: '1rem',
    fontWeight: '600',
    lineHeight: 1.3,
  },
  postExcerpt: {
    fontSize: '1rem',
    color: 'var(--color-neutral-600)',
    lineHeight: 1.6,
    marginBottom: '2rem',
  },
  readMore: {
    display: 'inline-flex',
    alignItems: 'center',
    color: 'var(--color-secondary-600)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'color 0.2s',
  },
  noResults: {
    textAlign: 'left' as const,
    color: 'var(--color-neutral-400)',
    fontSize: '1.1rem',
    marginTop: '2rem',
  }
}
