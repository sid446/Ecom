'use client'

import { useState, FormEvent } from 'react';

// Star icon component for rating
const StarIcon = ({ filled, onClick }: { filled: boolean; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={`text-3xl transition-colors ${filled ? 'text-gray-700' : 'text-gray-300 hover:text-gray-700'}`}
  >
    ★
  </button>
);

interface LeaveReviewProps {
  productId: string;
  onReviewSubmit: () => void; // Callback to refresh product data
}

export default function LeaveReview({ productId, onReviewSubmit }: LeaveReviewProps) {
  // Form state
  const [email, setEmail] = useState(''); // <-- NEW: State for email input
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // We no longer need an eligibility check on mount. 
  // The check happens implicitly when the form is submitted.

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (email.trim() === '' || rating === 0 || comment.trim() === '') {
      setError('Please fill in your email, a rating, and a comment.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // <-- CHANGE: Send email instead of userId
        body: JSON.stringify({ email, rating, comment }), 
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit review.');
      }
      
      setSuccess(data.message);
      onReviewSubmit(); 
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If the review was successful, show a thank you message and hide the form.
  if (success) {
      return <div className="p-4 border  bg-green-900/50 border-green-700 text-green-300">{success}</div>
  }

  return (
    <div className="p-6   bg-zinc-900 my-6">
      <h3 className="text-xl font-semibold mb-4 text-white">Write a Review</h3>
      <p className="text-sm text-zinc-400 mb-4">
        Enter the email address you used to purchase the item to leave a review.
      </p>
      <form onSubmit={handleSubmit}>
        {/* --- NEW: Email Input Field --- */}
        <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
                Your Email
            </label>
            <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full p-3 rounded-md bg-zinc-800 border-zinc-600 text-white placeholder-zinc-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="you@example.com"
                required
            />
        </div>
        {/* --- END of NEW FIELD --- */}

        <div className="mb-4">
          <label className="block text-sm font-medium text-zinc-300 mb-2">Your Rating</label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon key={star} filled={star <= rating} onClick={() => setRating(star)} />
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="comment" className="block text-sm font-medium text-zinc-300">
            Your Comment
          </label>
          <textarea
            id="comment"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mt-1 p-3 block w-full  bg-zinc-800 border-zinc-600 text-white placeholder-zinc-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Tell us what you think about the product..."
            required
          />
        </div>
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium  text-black bg-white hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-zinc-600 disabled:text-zinc-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Verifying & Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}   