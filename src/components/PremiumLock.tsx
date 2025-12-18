import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { usePremiumStatus } from '../hooks/usePremiumStatus';

interface PremiumLockProps {
  children: React.ReactNode;
  isLocked: boolean;
  featureName?: string;
}

export const PremiumLock: React.FC<PremiumLockProps> = ({
  children,
  isLocked,
  featureName = "this scenario"
}) => {
  const [showModal, setShowModal] = useState(false);
  const { isPremium } = usePremiumStatus();

  // If user is Premium, or the specific item isn't locked, show content normally
  if (isPremium || !isLocked) {
    return <>{children}</>;
  }

  // Otherwise, render the "Locked" state
  return (
    <>
      <div onClick={() => setShowModal(true)} className="relative group cursor-pointer">
        {/* Blur the child content slightly */}
        <div className="opacity-50 pointer-events-none grayscale blur-[1px]">
          {children}
        </div>

        {/* Overlay Lock Icon */}
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 group-hover:bg-slate-900/20 transition-all">
          <div className="bg-slate-900 p-2 rounded-full border border-slate-700 shadow-xl">
            <Lock className="w-5 h-5 text-gray-400 group-hover:text-neon-500 transition-colors" />
          </div>
        </div>
      </div>

      {/* The Upsell Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-neon-500 rounded-xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-neon-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-neon-500">
                <Lock size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Unlock {featureName}</h3>
              <p className="text-gray-400 text-sm">
                Free Plan includes 5 trial scenarios. Upgrade to access all 256+ adaptive scenarios and the AI FTO.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => window.location.href = '/pricing'} // Redirects to your pricing page
                className="w-full bg-neon-500 text-slate-900 font-bold py-3 rounded hover:bg-neon-400 transition-all"
              >
                Unlock Full Access ($24.99)
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="w-full text-gray-500 text-sm py-2 hover:text-white"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};