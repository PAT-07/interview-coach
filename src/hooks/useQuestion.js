import { useState, useCallback } from 'react';

export function useQuestion() {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuestion = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/question', { method: 'POST' });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to generate question');
      } else {
        setQuestion(data.question);
      }
    } catch (err) {
      setError(err.message || 'Failed to generate question');
    } finally {
      setLoading(false);
    }
  }, [loading]);

  return { question, loading, error, fetchQuestion };
}
