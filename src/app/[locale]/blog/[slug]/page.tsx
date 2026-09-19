import { blogPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';

export default async function BlogPostPage({ params }: { params: { locale: string, slug: string } }) {
  const { locale, slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-12 max-w-3xl">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title[locale] || post.title.en}</h1>
        <div className="text-gray-500 text-sm">Published on {post.date}</div>
      </header>
      <div className="prose lg:prose-xl dark:prose-invert">
        <p className="text-lg leading-relaxed">
          {post.content[locale] || post.content.en}
        </p>
      </div>
    </article>
  );
}
