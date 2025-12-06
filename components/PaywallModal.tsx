import React, { useState } from 'react';
import { X, Zap, Check, CreditCard, Sparkles } from 'lucide-react';
import { CreditPackage } from '../hooks/useCredits';

interface PaywallModalProps {
    isOpen: boolean;
    onClose: () => void;
    packages: CreditPackage[];
    currentCredits: number;
}

// Direct links to Whop checkout pages
const WHOP_PACKAGE_LINKS: Record<string, string> = {
    'prod_nsehLcXm5w5Yj': 'https://whop.com/avant-cb91/starter-package-42/',
    'prod_fOnp9wXcF0P8Z': 'https://whop.com/avant-cb91/popular-package-58/',
    'prod_u8EzPf9CDj2nY': 'https://whop.com/avant-cb91/pro-package-53-fd72/',
};

export const PaywallModal: React.FC<PaywallModalProps> = ({
    isOpen,
    onClose,
    packages,
    currentCredits,
}) => {
    if (!isOpen) return null;

    const formatPrice = (cents: number) => {
        return `$${(cents / 100).toFixed(2)}`;
    };

    const handlePurchase = (pkg: CreditPackage) => {
        // Use direct link if available
        if (pkg.whop_plan_id && WHOP_PACKAGE_LINKS[pkg.whop_plan_id]) {
            window.open(WHOP_PACKAGE_LINKS[pkg.whop_plan_id], '_blank', 'width=600,height=800');
        } else if (pkg.whop_plan_id) {
            window.open(`https://whop.com/checkout/${pkg.whop_plan_id}`, '_blank', 'width=600,height=800');
        } else {
            window.open('https://whop.com/avant-cb91', '_blank');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-[2rem] shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 fade-in duration-300">
                {/* Header */}
                <div className="bg-gradient-to-br from-violet-600 to-indigo-600 px-8 py-8 text-white">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-xl transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                            <Zap size={24} className="fill-yellow-300 text-yellow-300" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Get More Credits</h2>
                            <p className="text-violet-200 text-sm">Power your AI-generated content</p>
                        </div>
                    </div>

                    {currentCredits === 0 && (
                        <div className="mt-4 p-3 bg-white/10 rounded-xl border border-white/20">
                            <p className="text-sm">
                                <span className="font-bold">You're out of credits!</span> Purchase more to continue generating amazing content.
                            </p>
                        </div>
                    )}
                </div>

                {/* Packages */}
                <div className="p-6 space-y-3">
                    {packages.map((pkg) => (
                        <button
                            key={pkg.id}
                            onClick={() => handlePurchase(pkg)}
                            className={`
                w-full p-4 rounded-2xl border-2 text-left transition-all relative group
                ${pkg.is_popular
                                    ? 'border-violet-500 bg-violet-50 hover:bg-violet-100'
                                    : 'border-stone-200 hover:border-violet-300 hover:bg-stone-50'
                                }
              `}
                        >
                            {/* Popular badge */}
                            {pkg.is_popular && (
                                <div className="absolute -top-2 left-4 px-3 py-0.5 bg-violet-600 text-white text-xs font-bold rounded-full">
                                    MOST POPULAR
                                </div>
                            )}

                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-lg text-stone-900">{pkg.credits} Credits</span>
                                        <span className="text-stone-400">•</span>
                                        <span className="text-stone-600">{pkg.name}</span>
                                    </div>
                                    <p className="text-sm text-stone-500 mt-0.5">
                                        {formatPrice(Math.round(pkg.price_cents / pkg.credits * 100) / 100 * 100)} per credit
                                    </p>
                                </div>

                                <div className="text-right">
                                    <div className="text-2xl font-bold text-stone-900">
                                        {formatPrice(pkg.price_cents)}
                                    </div>
                                    <div className="text-xs text-violet-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                        Click to purchase →
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* What credits buy */}
                <div className="px-6 pb-6">
                    <div className="bg-stone-50 rounded-xl p-4">
                        <h4 className="font-bold text-stone-700 text-sm mb-2">What can you do with credits?</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2 text-stone-600">
                                <Check size={14} className="text-emerald-600" />
                                <span>1 Video Ad</span>
                            </div>
                            <div className="flex items-center gap-2 text-stone-600">
                                <Check size={14} className="text-emerald-600" />
                                <span>1 Design Visualization</span>
                            </div>
                            <div className="flex items-center gap-2 text-stone-600">
                                <Sparkles size={14} className="text-violet-600" />
                                <span>Free: Website Analysis</span>
                            </div>
                            <div className="flex items-center gap-2 text-stone-600">
                                <Sparkles size={14} className="text-violet-600" />
                                <span>Free: Prompt Library</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 text-center">
                    <p className="text-xs text-stone-400">
                        Secure payment powered by Whop • Instant credit delivery
                    </p>
                </div>
            </div>
        </div>
    );
};

// Smaller inline paywall for when credits run out mid-action
interface InlinePaywallProps {
    onBuyCredits: () => void;
}

export const InlinePaywall: React.FC<InlinePaywallProps> = ({ onBuyCredits }) => {
    return (
        <div className="text-center p-8 bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl border-2 border-violet-200">
            <div className="w-16 h-16 mx-auto bg-violet-100 rounded-full flex items-center justify-center mb-4">
                <Zap size={32} className="text-violet-600" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-2">Out of Credits</h3>
            <p className="text-stone-600 mb-6 max-w-sm mx-auto">
                You've used all your credits. Purchase more to continue generating amazing content.
            </p>
            <button
                onClick={onBuyCredits}
                className="px-8 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-colors flex items-center gap-2 mx-auto"
            >
                <CreditCard size={18} />
                Buy Credits
            </button>
        </div>
    );
};
