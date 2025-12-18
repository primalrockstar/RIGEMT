import { useState, useEffect } from 'react';

// You would replace this with your actual UserContext later
export const usePremiumStatus = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check Local Storage (Fastest)
    const storedUser = localStorage.getItem('user_profile');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      // specific logic depending on how you store 'access_level'
      setIsPremium(user.access_level === 'lifetime' || user.access_level === 'subscriber');
    }
    setLoading(false);
  }, []);

  return { isPremium, loading };
};