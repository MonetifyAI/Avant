import React, { useState } from 'react';
import { Zap, Plus, ChevronDown } from 'lucide-react';
import { PaywallModal } from './PaywallModal';
import { useCredits } from '../hooks/useCredits';

interface CreditDisplayProps {
    variant?: 'header' | 'compact' | 'full';
}

export const CreditDisplay: React.FC<CreditDisplayProps> = ({ variant = 'header' }) => {
    const { credits, loading, packages } = useCredits();
    const [showPaywall, setShowPaywall] = useState(false);

    if (loading) {
        return (
            <div className="h-10 w-24 bg-stone-200 rounded-xl animate-pulse" />
        );
    }

    // Header variant - compact button style
    if (variant === 'header') {
        return (
            <>
                <button
                    onClick={() => setShowPaywall(true)}
                    className={`
            flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all
            ${credits > 0
                            ? 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                            : 'bg-violet-600 hover:bg-violet-700 text-white animate-pulse'
                        }
          `}
                >
                    <Zap size={16} className={credits > 0 ? 'text-yellow-500' : 'text-yellow-300'} />
                    <span>{credits} Credits</span>
                    <Plus size={14} className="opacity-60" />
                </button>

                <PaywallModal
                    isOpen={showPaywall}
                    onClose={() => setShowPaywall(false)}
                    packages={packages}
                    currentCredits={credits}
                />
            </>
        );
    }

    // Compact variant - just the number
    if (variant === 'compact') {
        return (
            <div className="flex items-center gap-1.5 text-sm font-bold">
                <Zap size={14} className="text-yellow-500" />
                <span>{credits}</span>
            </div>
        );
    }

    // Full variant - detailed card
    return (
        <>
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-stone-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-stone-900">Your Credits</h3>
                    <button
                        onClick={() => setShowPaywall(true)}
                        className="text-sm text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1"
                    >
                        <Plus size={14} />
                        Buy More
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <Zap size={28} className="text-white fill-white" />
                    </div>
                    <div>
                        <div className="text-4xl font-extrabold text-stone-900">{credits}</div>
                        <div className="text-sm text-stone-500">credits remaining</div>
                    </div>
                </div>

                {credits <= 2 && credits > 0 && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                        <p className="text-sm text-amber-700">
                            <span className="font-bold">Running low!</span> Consider buying more credits.
                        </p>
                    </div>
                )}

                {credits === 0 && (
                    <button
                        onClick={() => setShowPaywall(true)}
                        className="mt-4 w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-colors"
                    >
                        Buy Credits to Continue
                    </button>
                )}
            </div>

            <PaywallModal
                isOpen={showPaywall}
                onClose={() => setShowPaywall(false)}
                packages={packages}
                currentCredits={credits}
            />
        </>
    );
};
