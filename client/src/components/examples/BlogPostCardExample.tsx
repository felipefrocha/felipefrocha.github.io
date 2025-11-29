import { BlogPostCard } from '../molecules/BlogPostCard';

export default function BlogPostCardExample() {
  const post = {
    slug: 'example-post',
    title: 'Building Scalable React Applications',
    excerpt: 'Learn the patterns and practices for building React applications that scale with your team.',
    content: '',
    date: 'Nov 25, 2025',
    readTime: '8 min read',
    category: 'React',
    tags: ['react', 'architecture'],
  };

  return (
    <div className="max-w-sm">
      <BlogPostCard post={post} />
    </div>
  );
}
