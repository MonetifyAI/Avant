import React from 'react';
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react';

interface EmailVerificationProps {
    email: string;
    onBack: () => void;
    onResend?: () => void;
}

export const EmailVerification: React.FC<EmailVerificationProps> = ({
    email,
    onBack,
    onResend
}) => {
    const [resending, setResending] = React.useState(false);
    const [resent, setResent] = React.useState(false);

    const handleResend = async () => {
        if (onResend) {
            setResending(true);
            await onResend();
            setResending(false);
            setResent(true);
            setTimeout(() => setResent(false), 3000);
        }
    };

    return (
        <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center p-8 font-sans">
            <div className="max-w-md w-full text-center">
                {/* Back button */}
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors font-bold text-sm mb-8 mx-auto"
                >
                    <ArrowLeft size={18} /> Back to Login
                </button>

                {/* Email icon */}
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Mail size={40} className="text-emerald-600" />
                </div>

                {/* Title */}
                <h1 className="text-4xl font-extrabold text-stone-900 tracking-tight mb-4">
                    Check your email
                </h1>

                {/* Description */}
                <p className="text-stone-600 text-lg mb-2">
                    We've sent a verification link to:
                </p>
                <p className="text-stone-900 font-bold text-lg mb-8">
                    {email}
                </p>

                {/* Instructions */}
                <div className="bg-white border-2 border-stone-100 rounded-2xl p-6 mb-8 text-left">
                    <h3 className="font-bold text-stone-900 mb-3">Next steps:</h3>
                    <ol className="space-y-2 text-stone-600">
                        <li className="flex gap-3">
                            <span className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-sm font-bold shrink-0">1</span>
                            <span>Open the email from Avant</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-sm font-bold shrink-0">2</span>
                            <span>Click the verification link</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-sm font-bold shrink-0">3</span>
                            <span>You'll be redirected to your dashboard</span>
                        </li>
                    </ol>
                </div>

                {/* Resend button */}
                {onResend && (
                    <button
                        onClick={handleResend}
                        disabled={resending || resent}
                        className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors font-medium text-sm mx-auto disabled:opacity-50"
                    >
                        <RefreshCw size={16} className={resending ? 'animate-spin' : ''} />
                        {resent ? 'Email sent!' : resending ? 'Sending...' : "Didn't receive it? Resend email"}
                    </button>
                )}

                {/* Spam hint */}
                <p className="text-stone-400 text-sm mt-6">
                    Check your spam folder if you don't see it.
                </p>
            </div>
        </div>
    );
};
