import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Send } from 'lucide-react';
import { PageWrapper } from '../../components/shared/PageWrapper';
import { StarRating } from '../../components/feedback/StarRating';
import { useSessionStore } from '../../store/sessionStore';
import { submitFeedback } from '../../lib/api';

const FeedbackPage: React.FC = () => {
  const navigate = useNavigate();
  const { tableId } = useSessionStore();
  const [ratings, setRatings] = useState({
    food: 5,
    service: 5,
    ambience: 5
  });
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitFeedback({
        table_id: tableId || '12',
        food_rating: ratings.food,
        service_rating: ratings.service,
        ambience_rating: ratings.ambience,
        comment
      });
      // Mock success toast logic
      alert("Thanks for your feedback! 🎉");
      navigate('/menu');
    } catch (err) {
      navigate('/menu');
    }
  };

  return (
    <main className="bg-[var(--color-bg-primary)] min-h-screen">
      <header className="sticky top-0 z-50 bg-blur border-b border-[var(--color-border)] px-5 h-16 flex items-center justify-center">
        <h1 className="text-lg font-bold text-white">Share Your Experience</h1>
      </header>

      <PageWrapper>
        <div className="flex flex-col items-center mb-10 text-center">
           <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-[var(--color-primary)] p-1">
             <img 
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=100&auto=format&fit=crop" 
              className="w-full h-full object-cover rounded-full"
              alt="Dining history"
             />
           </div>
           <h2 className="text-xl font-bold">How was the meal?</h2>
           <p className="text-sm text-[var(--color-text-muted)]">Your feedback helps us serve you better.</p>
        </div>

        <div className="space-y-8 bg-[var(--color-bg-surface)] p-8 rounded-[var(--radius-lg)] border border-[var(--color-border)] mb-8">
           <StarRating 
              label="Food Quality" 
              rating={ratings.food} 
              onRatingChange={(v) => setRatings({...ratings, food: v})} 
           />
           <StarRating 
              label="Service" 
              rating={ratings.service} 
              onRatingChange={(v) => setRatings({...ratings, service: v})} 
           />
           <StarRating 
              label="Ambience" 
              rating={ratings.ambience} 
              onRatingChange={(v) => setRatings({...ratings, ambience: v})} 
           />
        </div>

        <div className="space-y-4 mb-10">
           <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2 block flex items-center gap-2">
             <MessageSquare size={14} />
             Share your thoughts
           </label>
           <textarea 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-4 text-sm text-white h-32 outline-none focus:border-[var(--color-primary)] transition-all resize-none"
            placeholder="Tell us what you liked or what we can improve..."
          />
        </div>

        <div className="flex flex-col gap-4">
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full h-[52px] bg-[var(--color-primary)] text-white rounded-[var(--radius-md)] font-bold shadow-[var(--shadow-glow)] flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? "Sending..." : "Submit Feedback"}
            {!isSubmitting && <Send size={18} />}
          </button>
          <button 
            onClick={() => navigate('/menu')}
            className="text-center text-sm font-semibold text-[var(--color-text-muted)] hover:text-white"
          >
            Skip for now →
          </button>
        </div>
      </PageWrapper>
    </main>
  );
};

export default FeedbackPage;
