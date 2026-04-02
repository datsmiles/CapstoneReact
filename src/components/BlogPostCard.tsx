import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image?: string;
  date?: string;
}

interface BlogPostCardProps {
  post: BlogPost;
  variant?: 'home' | 'blog';
}

export default function BlogPostCard({ post, variant = 'blog' }: BlogPostCardProps) {
  if (variant === 'home') {
    return (
      <div className="blog-card" style={styles.homeCard}>
        {post.image && (
          <div style={styles.homeImgWrapper}>
            <img src={post.image} alt={post.title} style={styles.homeImg} />
          </div>
        )}
        {post.date && <p style={styles.homeDate}>{post.date}</p>}
        <h4 style={styles.homeTitle}>{post.title}</h4>
        <p style={{...styles.homeSnippet, ...(post.image ? {} : {marginBottom: '2rem'})}}>{post.excerpt}</p>
        <Link to={`/blog/${post.id}`} style={styles.homeReadMoreLink} className="read-more">
          Read article <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  // Blog list variant
  return (
    <div className="post-card" style={styles.blogListCard}>
      <h2 style={styles.blogListTitle}>{post.title}</h2>
      <p style={styles.blogListExcerpt}>
        {post.excerpt.length > 250 ? post.excerpt.substring(0, 250) + '...' : post.excerpt}
      </p>
      <Link to={`/blog/${post.id}`} style={styles.blogListReadMore} className="read-more">
        Read more <span style={{ marginLeft: '4px' }}>→</span>
      </Link>
    </div>
  );
}

const styles = {
  // Home variant styles
  homeCard: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  homeImgWrapper: {
    height: '280px',
    backgroundColor: 'var(--color-neutral-100)',
    borderRadius: '1.25rem',
    overflow: 'hidden',
    marginBottom: '1.5rem',
  },
  homeImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    transition: 'transform 0.6s ease',
  },
  homeDate: {
    fontSize: '0.85rem',
    color: 'var(--color-primary-600)',
    fontWeight: '700',
    letterSpacing: '1px',
    marginBottom: '0.75rem',
    textTransform: 'uppercase' as const,
  },
  homeTitle: {
    fontSize: '1.5rem',
    fontWeight: '800',
    lineHeight: 1.3,
    marginBottom: '1rem',
    color: 'var(--color-secondary-900)',
  },
  homeSnippet: {
    color: 'var(--color-secondary-500)',
    fontSize: '1rem',
    lineHeight: 1.6,
    marginBottom: '1.5rem',
  },
  homeReadMoreLink: {
    color: 'var(--color-secondary-900)',
    fontWeight: '700',
    fontSize: '1rem',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
  },

  // Blog variant styles
  blogListCard: {
    padding: '2.5rem',
    backgroundColor: 'white',
    borderRadius: '1rem',
    border: '1px solid var(--color-neutral-100)',
    transition: 'all 0.3s ease',
  },
  blogListTitle: {
    fontSize: '1.5rem',
    color: 'var(--color-secondary-900)',
    marginBottom: '1rem',
    fontWeight: '600',
    lineHeight: 1.3,
  },
  blogListExcerpt: {
    fontSize: '1rem',
    color: 'var(--color-neutral-600)',
    lineHeight: 1.6,
    marginBottom: '2rem',
  },
  blogListReadMore: {
    display: 'inline-flex',
    alignItems: 'center',
    color: 'var(--color-secondary-600)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'color 0.2s',
  }
}
