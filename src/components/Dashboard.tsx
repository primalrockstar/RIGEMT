import React, { useEffect, useState } from 'react';
import { usePremiumStatus } from '../hooks/usePremiumStatus';

export default function Dashboard() {
  const { isPremium, loading } = usePremiumStatus();
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    if (sessionId) {
      // 1. Trigger Animation
      setShowUnlockAnimation(true);

      // 2. CRITICAL: Re-fetch the user profile from the backend
      const refreshProfile = async (retryCount = 0) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });

          if (response.ok) {
            const freshProfile = await response.json();

            // CHECK: If we still see 'free' but we just paid, wait and retry
            if (freshProfile.access_level === 'free' && retryCount < 3) {
              console.log(`Payment detected but profile not updated. Retrying (${retryCount + 1}/3)...`);
              setTimeout(() => refreshProfile(retryCount + 1), 2000); // Wait 2s and recurse
              return;
            }

            // 3. Update Local Storage so the locks disappear INSTANTLY
            localStorage.setItem('user_profile', JSON.stringify(freshProfile));
            // Force re-render by updating state
            window.location.reload(); // Simple way to refresh
          }
        } catch (err) {
          console.error("Failed to sync premium status:", err);
        }
      };

      refreshProfile();

      // 4. Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {showUnlockAnimation && (
        <div className="mb-6 bg-green-500 text-white p-4 rounded">
          Access Granted! Welcome to Premium.
        </div>
      )}

      {!loading && !isPremium && (
        <div className="mb-6 bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-lg p-4 flex justify-between items-center">
          <div>
            <h3 className="text-white font-bold text-sm">Free Account Active</h3>
            <p className="text-gray-400 text-xs">You have 3 scenarios remaining.</p>
          </div>
          <button
            onClick={() => window.location.href = '/pricing'}
            className="bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-1.5 rounded font-mono border border-white/20 transition-all"
          >
            UPGRADE
          </button>
        </div>
      )}

      {/* Other dashboard content */}
    </div>
  );
}