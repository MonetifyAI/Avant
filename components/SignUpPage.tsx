import React, { useState } from 'react';
import { Hexagon, ArrowLeft, Mail, Lock, User, Building2, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SignUpPageProps {
  onNavigate: (page: string) => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({ onNavigate }) => {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await signUp(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        formData.company
      );

      if (error) {
        setError(error.message);
      } else {
        // Successfully signed up, navigate to email verification screen
        onNavigate('verify_email');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] flex font-sans text-stone-900">

      {/* Right Side - Visual (Swapped for variety on signup) */}
      <div className="hidden lg:flex w-1/2 bg-stone-900 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[100px]" />

        <div className="relative z-10 w-full max-w-md">
          <h2 className="text-5xl font-extrabold text-white mb-12 tracking-tighter leading-tight">
            Join the <span className="text-emerald-400 font-serif-italic">top 1%</span> of remodelers.
          </h2>

          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-3xl flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-stone-900 font-bold">1</div>
              <div className="text-white font-medium">Create account</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/5 p-6 rounded-3xl flex items-center gap-4 opacity-50">
              <div className="w-10 h-10 bg-stone-800 rounded-full flex items-center justify-center text-white font-bold">2</div>
              <div className="text-white font-medium">Upload logo</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/5 p-6 rounded-3xl flex items-center gap-4 opacity-50">
              <div className="w-10 h-10 bg-stone-800 rounded-full flex items-center justify-center text-white font-bold">3</div>
              <div className="text-white font-medium">Generate first video</div>
            </div>
          </div>
        </div>
      </div>

      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 md:p-16 lg:p-24 justify-center bg-white border-l border-stone-100 shadow-2xl z-10">
        <div className="max-w-md w-full mx-auto">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors font-bold text-sm mb-12"
          >
            <ArrowLeft size={18} /> Back
          </button>

          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4 text-stone-900">Get started.</h1>
            <p className="text-lg text-stone-500 font-medium">Free for 7 days. No commitment.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 font-medium">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-900 uppercase tracking-wide">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Jane"
                  required
                  className="w-full px-4 py-3 bg-stone-50 border-2 border-stone-100 rounded-xl outline-none focus:border-emerald-500 font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-900 uppercase tracking-wide">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                  className="w-full px-4 py-3 bg-stone-50 border-2 border-stone-100 rounded-xl outline-none focus:border-emerald-500 font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-900 uppercase tracking-wide">Company</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Acme Construction"
                required
                className="w-full px-4 py-3 bg-stone-50 border-2 border-stone-100 rounded-xl outline-none focus:border-emerald-500 font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-900 uppercase tracking-wide">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jane@acme.com"
                required
                className="w-full px-4 py-3 bg-stone-50 border-2 border-stone-100 rounded-xl outline-none focus:border-emerald-500 font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-900 uppercase tracking-wide">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-4 py-3 bg-stone-50 border-2 border-stone-100 rounded-xl outline-none focus:border-emerald-500 font-bold"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-emerald-500 text-white text-lg font-bold rounded-xl hover:scale-[1.02] hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-200 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <div className="mt-8 text-center text-sm font-medium text-stone-500">
            Already have an account?{' '}
            <button onClick={() => onNavigate('login')} className="text-stone-900 hover:underline font-extrabold">
              Log in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
