import { useState, useCallback } from 'react';

export function useFeedback() {
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFeedback = useCallback(async (question, transcript) => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, transcript }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to get feedback');
      } else {
        setFeedback(data.feedback);
      }
    } catch (err) {
      setError(err.message || 'Failed to get feedback');
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const clearFeedback = useCallback(() => {
    setFeedback(null);
    setError(null);
  }, []);

  return { feedback, loading, error, fetchFeedback, clearFeedback };
}
