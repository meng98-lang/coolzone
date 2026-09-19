import { blogPosts } from '@/lib/blog';
import Link from 'next/link';

export default async function BlogListPage({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="grid gap-8">
        {blogPosts.map((post) => (
          <div key={post.id} className="border p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">{post.title[locale] || post.title.en}</h2>
            <p className="text-gray-600 mb-4">{post.excerpt[locale] || post.excerpt.en}</p>
            <Link href={`/${locale}/blog/${post.slug}`} className="text-blue-600 font-medium hover:underline">
              Read More →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
