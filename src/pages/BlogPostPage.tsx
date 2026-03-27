import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, Calendar, Tag, ThumbsUp, Eye } from 'lucide-react'

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

export default function BlogPostPage() {
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`https://dummyjson.com/posts/${id}`)
      .then(res => res.json())
      .then(data => {
        setPost(data)
        setLoading(false)
        window.scrollTo(0, 0)
      })
      .catch(err => {
        console.error("Failed to fetch post:", err)
        setLoading(false)
      })
  }, [id])

  if (loading) return <div style={styles.loading}>Loading article...</div>
  if (!post) return <div style={styles.error}>Post not found.</div>

  return (
    <div style={styles.container}>
      <Link to="/blog" style={styles.backButton}>
        <ChevronLeft size={18} /> Back to Blog
      </Link>

      <article style={styles.article}>
        {/* Header Metadata */}
        <div style={styles.meta}>
          <div style={styles.metaItem}>
            <Calendar size={16} /> 
            <span>March 26, 2026</span>
          </div>
          <div style={styles.metaItem}>
            <Eye size={16} />
            <span>{post.views} views</span>
          </div>
        </div>

        <h1 style={styles.title}>{post.title}</h1>

        {/* Tags */}
        <div style={styles.tags}>
          {post.tags.map(tag => (
            <span key={tag} style={styles.tag}>
              <Tag size={12} style={{ marginRight: '4px' }} />
              {tag}
            </span>
          ))}
        </div>

        {/* Content */}
        <div style={styles.content}>
          {post.body.split('\n').map((para, i) => (
            <p key={i} style={styles.paragraph}>{para}</p>
          ))}
        </div>

        {/* Footer info */}
        <div style={styles.footer}>
          <div style={styles.reactions}>
            <ThumbsUp size={18} style={{ marginRight: '8px' }} />
            <span>{post.reactions.likes} people liked this</span>
          </div>
        </div>
      </article>

      {/* Suggested Reading - static mockup for design */}
      <div style={styles.suggested}>
        <h3 style={styles.suggestedTitle}>Related Articles</h3>
        <div style={styles.suggestedGrid}>
          <div style={styles.suggestedCard}>
            <h4 style={styles.suggestedCardTitle}>Top 5 Summer Style Tips</h4>
            <Link to="/blog" style={styles.suggestedLink}>Read more</Link>
          </div>
          <div style={styles.suggestedCard}>
            <h4 style={styles.suggestedCardTitle}>Essential Skincare Routine</h4>
            <Link to="/blog" style={styles.suggestedLink}>Read more</Link>
          </div>
        </div>
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
  error: {
    textAlign: 'center' as const,
    padding: '10rem',
    color: 'red',
    fontSize: '1.2rem',
  },
  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: 'var(--color-neutral-500)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    marginBottom: '3rem',
    transition: 'color 0.2s',
  },
  article: {
    marginBottom: '5rem',
  },
  meta: {
    display: 'flex',
    gap: '2rem',
    color: 'var(--color-neutral-400)',
    fontSize: '0.9rem',
    marginBottom: '2rem',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  title: {
    fontSize: '3rem',
    color: 'var(--color-secondary-900)',
    lineHeight: 1.1,
    marginBottom: '2rem',
    fontWeight: '700',
  },
  tags: {
    display: 'flex',
    gap: '0.75rem',
    marginBottom: '3rem',
    flexWrap: 'wrap' as const,
  },
  tag: {
    padding: '0.4rem 0.8rem',
    backgroundColor: 'var(--color-neutral-50)',
    color: 'var(--color-neutral-500)',
    borderRadius: '1.5rem',
    fontSize: '0.8rem',
    display: 'flex',
    alignItems: 'center',
    textTransform: 'capitalize' as const,
  },
  content: {
    lineHeight: 1.8,
    color: 'var(--color-secondary-900)',
    fontSize: '1.15rem',
  },
  paragraph: {
    marginBottom: '1.5rem',
  },
  footer: {
    marginTop: '4rem',
    paddingTop: '2rem',
    borderTop: '1px solid var(--color-neutral-100)',
  },
  reactions: {
    display: 'flex',
    alignItems: 'center',
    color: 'var(--color-neutral-500)',
    fontSize: '0.95rem',
  },
  suggested: {
    backgroundColor: 'var(--color-neutral-50)',
    padding: '3rem',
    borderRadius: '1.5rem',
  },
  suggestedTitle: {
    fontSize: '1.25rem',
    color: 'var(--color-secondary-900)',
    marginBottom: '2rem',
    fontWeight: '600',
  },
  suggestedGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
  },
  suggestedCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '1rem',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
  },
  suggestedCardTitle: {
    fontSize: '1.1rem',
    color: 'var(--color-secondary-900)',
    marginBottom: '1rem',
    lineHeight: 1.4,
  },
  suggestedLink: {
    color: 'var(--color-secondary-900)',
    fontSize: '0.85rem',
    fontWeight: '600',
    textDecoration: 'none',
  }
}
