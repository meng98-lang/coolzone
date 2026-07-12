'use client';

import { useState } from 'react';
import { Star, ThumbsUp, MessageCircle, Send } from 'lucide-react';

interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  helpful: number;
  verified: boolean;
}

// Sample reviews data - in production, this would come from an API
const sampleReviews: Review[] = [
  {
    id: 1,
    author: 'Thomas M.',
    rating: 5,
    date: '2024-12-15',
    title: 'Excellent cooling, very quiet',
    content: 'Installed this unit in our bedroom last month. The inverter technology makes it incredibly quiet at night. Cooling is fast and the WiFi app works perfectly. Highly recommend!',
    helpful: 24,
    verified: true,
  },
  {
    id: 2,
    author: 'Marie L.',
    rating: 4,
    date: '2024-11-28',
    title: 'Good value for money',
    content: 'Great AC for the price. Easy to install and the energy consumption is lower than my old unit. The only minor issue is the remote control could be more intuitive.',
    helpful: 18,
    verified: true,
  },
  {
    id: 3,
    author: 'Hans K.',
    rating: 5,
    date: '2024-11-10',
    title: 'Perfect for our living room',
    content: 'We needed a powerful unit for our 35m² living room. This AC handles it perfectly even on the hottest days. The A+++ energy rating means our electricity bill barely increased.',
    helpful: 31,
    verified: true,
  },
  {
    id: 4,
    author: 'Sofia R.',
    rating: 4,
    date: '2024-10-22',
    title: 'Solid build quality',
    content: 'Very happy with this purchase. The build quality feels premium and the installation was straightforward. Customer service was also very helpful when I had questions about setup.',
    helpful: 12,
    verified: true,
  },
];

interface ProductReviewsProps {
  productName: string;
  productSlug: string;
}

export function ProductReviews({ productName, productSlug }: ProductReviewsProps) {
  const [reviews] = useState<Review[]>(sampleReviews);
  const [showForm, setShowForm] = useState(false);
  const [helpfulClicked, setHelpfulClicked] = useState<Set<number>>(new Set());
  const [newReview, setNewReview] = useState({
    author: '',
    rating: 5,
    title: '',
    content: '',
  });

  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percentage: (reviews.filter(r => r.rating === star).length / reviews.length) * 100,
  }));

  const handleHelpful = (id: number) => {
    setHelpfulClicked(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would send to an API
    alert('Thank you for your review! It will be published after moderation.');
    setShowForm(false);
    setNewReview({ author: '', rating: 5, title: '', content: '' });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-blue-600" />
        Customer Reviews
      </h2>

      {/* Rating summary */}
      <div className="flex flex-col md:flex-row gap-6 mb-8 pb-6 border-b">
        <div className="text-center md:min-w-[140px]">
          <div className="text-4xl font-bold text-gray-800">{averageRating.toFixed(1)}</div>
          <div className="flex justify-center gap-0.5 my-1">
            {[1, 2, 3, 4, 5].map(star => (
              <Star
                key={star}
                className={`w-4 h-4 ${star <= Math.round(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500">{reviews.length} reviews</p>
        </div>

        <div className="flex-1 space-y-1.5">
          {ratingDistribution.map(item => (
            <div key={item.star} className="flex items-center gap-2 text-sm">
              <span className="text-gray-600 w-8">{item.star} ★</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className="text-gray-500 w-6 text-right">{item.count}</span>
            </div>
          ))}
        </div>

        <div className="md:self-center">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            Write a Review
          </button>
        </div>
      </div>

      {/* Review form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-xl">
          <h3 className="font-medium text-gray-800 mb-3">Write your review</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Your Name</label>
              <input
                type="text"
                value={newReview.author}
                onChange={e => setNewReview(p => ({ ...p, author: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview(p => ({ ...p, rating: star }))}
                    className="p-0.5"
                  >
                    <Star
                      className={`w-6 h-6 ${star <= newReview.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Title</label>
              <input
                type="text"
                value={newReview.title}
                onChange={e => setNewReview(p => ({ ...p, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Your Review</label>
              <textarea
                value={newReview.content}
                onChange={e => setNewReview(p => ({ ...p, content: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                Submit Review
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-600 text-sm hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Reviews list */}
      <div className="space-y-4">
        {reviews.map(review => (
          <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="font-medium text-gray-800 text-sm">{review.title}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-600">{review.author}</span>
                  {review.verified && (
                    <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">Verified Purchase</span>
                  )}
                  <span className="text-xs text-gray-400">{review.date}</span>
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">{review.content}</p>
            <div className="mt-2">
              <button
                onClick={() => handleHelpful(review.id)}
                disabled={helpfulClicked.has(review.id)}
                className={`flex items-center gap-1 text-xs transition-colors ${
                  helpfulClicked.has(review.id)
                    ? 'text-blue-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <ThumbsUp className="w-3 h-3" />
                Helpful ({review.helpful + (helpfulClicked.has(review.id) ? 1 : 0)})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
