import React, { useState } from 'react';
import {
    Globe,
    Sparkles,
    Loader2,
    CheckCircle2,
    XCircle,
    Plus,
    ExternalLink,
    Wand2,
    BookOpen,
    Building2,
    MapPin,
    Star,
    Save
} from 'lucide-react';
import { scrapeUrl, crawlWebsite, combineScrapedContent } from '../lib/firecrawlApi';
import { generatePersonalizedPrompts, GeneratedPrompt } from '../lib/claudeApi';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type AnalyzerStatus = 'idle' | 'scraping' | 'generating' | 'success' | 'error';

export const WebsiteAnalyzer: React.FC = () => {
    const { user, profile } = useAuth();
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [status, setStatus] = useState<AnalyzerStatus>('idle');
    const [statusMessage, setStatusMessage] = useState('');
    const [error, setError] = useState<string | null>(null);

    const [businessSummary, setBusinessSummary] = useState<{
        companyName: string;
        services: string[];
        location: string;
        uniqueSellingPoints: string[];
    } | null>(null);

    const [generatedPrompts, setGeneratedPrompts] = useState<GeneratedPrompt[]>([]);
    const [savedPromptIds, setSavedPromptIds] = useState<Set<number>>(new Set());
    const [savingAll, setSavingAll] = useState(false);

    const validateUrl = (url: string): boolean => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const handleAnalyze = async () => {
        if (!websiteUrl || !validateUrl(websiteUrl)) {
            setError('Please enter a valid website URL');
            return;
        }

        setStatus('scraping');
        setStatusMessage('Scanning your website...');
        setError(null);
        setGeneratedPrompts([]);
        setBusinessSummary(null);
        setSavedPromptIds(new Set());

        try {
            // Step 1: Scrape the website
            setStatusMessage('Extracting content from your website...');

            // Try crawling multiple pages for better context
            const scrapeResults = await crawlWebsite(websiteUrl, 5);

            // Check if we got any content
            const hasContent = scrapeResults.some(r => r.success && r.data?.markdown);

            if (!hasContent) {
                // Fallback to single page scrape
                const singleResult = await scrapeUrl(websiteUrl);
                if (!singleResult.success) {
                    throw new Error(singleResult.error || 'Failed to scrape website');
                }
                scrapeResults.push(singleResult);
            }

            // Step 2: Combine content
            setStatus('generating');
            setStatusMessage('Analyzing your business and generating personalized hooks...');

            const combinedContent = combineScrapedContent(scrapeResults);

            if (!combinedContent || combinedContent.length < 100) {
                throw new Error('Could not extract enough content from the website');
            }

            // Step 3: Generate prompts with Claude
            const result = await generatePersonalizedPrompts(combinedContent, {
                companyName: profile?.company,
            });

            if (!result.success || !result.prompts) {
                throw new Error(result.error || 'Failed to generate prompts');
            }

            setBusinessSummary(result.businessSummary || null);
            setGeneratedPrompts(result.prompts);
            setStatus('success');
            setStatusMessage('');

        } catch (err) {
            console.error('Analysis error:', err);
            setError(err instanceof Error ? err.message : 'An error occurred');
            setStatus('error');
        }
    };

    const handleSavePrompt = async (prompt: GeneratedPrompt, index: number) => {
        if (!user) return;

        try {
            const { error } = await supabase.from('user_prompts').insert({
                user_id: user.id,
                title: prompt.title,
                prompt: prompt.prompt,
                category: prompt.category,
                hook_type: prompt.hookType,
                awareness_level: prompt.awarenessLevel,
                source: 'ai_generated',
                source_url: websiteUrl,
            });

            if (error) throw error;

            setSavedPromptIds(prev => new Set([...prev, index]));
        } catch (err) {
            console.error('Error saving prompt:', err);
        }
    };

    const handleSaveAll = async () => {
        if (!user || generatedPrompts.length === 0) return;

        setSavingAll(true);

        try {
            const promptsToInsert = generatedPrompts.map(prompt => ({
                user_id: user.id,
                title: prompt.title,
                prompt: prompt.prompt,
                category: prompt.category,
                hook_type: prompt.hookType,
                awareness_level: prompt.awarenessLevel,
                source: 'ai_generated',
                source_url: websiteUrl,
            }));

            const { error } = await supabase.from('user_prompts').insert(promptsToInsert);

            if (error) throw error;

            // Mark all as saved
            setSavedPromptIds(new Set(generatedPrompts.map((_, i) => i)));
        } catch (err) {
            console.error('Error saving all prompts:', err);
        } finally {
            setSavingAll(false);
        }
    };

    const resetAnalyzer = () => {
        setStatus('idle');
        setError(null);
        setGeneratedPrompts([]);
        setBusinessSummary(null);
        setSavedPromptIds(new Set());
    };

    return (
        <div className="max-w-[1200px] mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight flex items-center gap-3">
                    <Wand2 className="text-emerald-600" />
                    Website <span className="text-emerald-600">Analyzer</span>
                </h1>
                <p className="text-stone-500 mt-2 text-lg">
                    Enter your website URL and we'll generate personalized ad hooks for your business
                </p>
            </div>

            {/* URL Input Section */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-soft border border-stone-100">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Globe size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                            type="url"
                            value={websiteUrl}
                            onChange={(e) => setWebsiteUrl(e.target.value)}
                            placeholder="https://yourcompany.com"
                            disabled={status === 'scraping' || status === 'generating'}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-stone-200 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </div>

                    <button
                        onClick={handleAnalyze}
                        disabled={!websiteUrl || status === 'scraping' || status === 'generating'}
                        className={`
              flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all
              ${status === 'scraping' || status === 'generating'
                                ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5'
                            }
            `}
                    >
                        {status === 'scraping' || status === 'generating' ? (
                            <>
                                <Loader2 size={22} className="animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Sparkles size={22} />
                                Analyze & Generate
                            </>
                        )}
                    </button>
                </div>

                {/* Status Message */}
                {statusMessage && (
                    <div className="mt-4 flex items-center gap-3 text-stone-600">
                        <Loader2 size={18} className="animate-spin text-emerald-600" />
                        <span className="font-medium">{statusMessage}</span>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="mt-4 flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700">
                        <XCircle size={20} />
                        <span className="font-medium">{error}</span>
                        <button
                            onClick={resetAnalyzer}
                            className="ml-auto text-sm underline hover:no-underline"
                        >
                            Try again
                        </button>
                    </div>
                )}
            </div>

            {/* Business Summary */}
            {businessSummary && (
                <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-[2.5rem] p-8 text-white shadow-xl">
                    <div className="flex items-center gap-2 text-emerald-400 mb-4">
                        <CheckCircle2 size={20} />
                        <span className="text-sm font-bold uppercase tracking-wider">Analysis Complete</span>
                    </div>

                    <h2 className="text-3xl font-bold mb-6">{businessSummary.companyName}</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Location */}
                        <div>
                            <div className="flex items-center gap-2 text-stone-400 mb-2">
                                <MapPin size={16} />
                                <span className="text-xs uppercase tracking-wide font-bold">Location</span>
                            </div>
                            <p className="text-white font-medium">{businessSummary.location || 'Not specified'}</p>
                        </div>

                        {/* Services */}
                        <div>
                            <div className="flex items-center gap-2 text-stone-400 mb-2">
                                <Building2 size={16} />
                                <span className="text-xs uppercase tracking-wide font-bold">Services</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {businessSummary.services.slice(0, 4).map((service, i) => (
                                    <span key={i} className="px-2 py-0.5 bg-white/10 rounded-full text-xs font-medium">
                                        {service}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* USPs */}
                        <div>
                            <div className="flex items-center gap-2 text-stone-400 mb-2">
                                <Star size={16} />
                                <span className="text-xs uppercase tracking-wide font-bold">Unique Points</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {businessSummary.uniqueSellingPoints.slice(0, 3).map((usp, i) => (
                                    <span key={i} className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-medium">
                                        {usp}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Generated Prompts */}
            {generatedPrompts.length > 0 && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
                            <BookOpen size={24} className="text-emerald-600" />
                            Generated Prompts
                            <span className="ml-2 px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full">
                                {generatedPrompts.length}
                            </span>
                        </h2>

                        <button
                            onClick={handleSaveAll}
                            disabled={savingAll || savedPromptIds.size === generatedPrompts.length}
                            className={`
                flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all
                ${savedPromptIds.size === generatedPrompts.length
                                    ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                                    : 'bg-stone-900 text-white hover:bg-stone-800'
                                }
              `}
                        >
                            {savingAll ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <Save size={18} />
                            )}
                            {savedPromptIds.size === generatedPrompts.length ? 'All Saved' : 'Save All to Library'}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {generatedPrompts.map((prompt, index) => (
                            <div
                                key={index}
                                className={`
                  bg-white rounded-2xl p-6 border-2 transition-all
                  ${savedPromptIds.has(index)
                                        ? 'border-emerald-200 bg-emerald-50/50'
                                        : 'border-stone-200 shadow-soft hover:shadow-md'
                                    }
                `}
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="font-bold text-stone-900 line-clamp-1">{prompt.title}</h3>
                                    {savedPromptIds.has(index) && (
                                        <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0" />
                                    )}
                                </div>

                                {/* Prompt Text */}
                                <p className="text-sm text-stone-600 line-clamp-3 mb-4 leading-relaxed">
                                    {prompt.prompt}
                                </p>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    <span className="px-2 py-0.5 bg-stone-100 text-stone-600 text-xs font-medium rounded-full">
                                        {prompt.category}
                                    </span>
                                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">
                                        {prompt.hookType}
                                    </span>
                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                                        {prompt.awarenessLevel}
                                    </span>
                                </div>

                                {/* Actions */}
                                {!savedPromptIds.has(index) && (
                                    <button
                                        onClick={() => handleSavePrompt(prompt, index)}
                                        className="w-full py-2.5 bg-stone-900 text-white rounded-xl font-medium text-sm hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Plus size={16} />
                                        Save to My Library
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {status === 'idle' && (
                <div className="bg-stone-50 rounded-[2.5rem] p-12 border-2 border-dashed border-stone-200 text-center">
                    <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center mb-6 shadow-lg">
                        <Globe size={36} className="text-stone-400" />
                    </div>
                    <h3 className="text-xl font-bold text-stone-900 mb-2">Analyze Your Website</h3>
                    <p className="text-stone-500 max-w-md mx-auto">
                        Enter your company website above and we'll automatically generate personalized video ad hooks based on your services, location, and unique selling points.
                    </p>

                    <div className="mt-8 grid grid-cols-3 gap-4 max-w-lg mx-auto">
                        <div className="text-center">
                            <div className="w-10 h-10 mx-auto bg-emerald-100 rounded-xl flex items-center justify-center mb-2">
                                <Globe size={20} className="text-emerald-600" />
                            </div>
                            <p className="text-xs text-stone-500 font-medium">Scrape Website</p>
                        </div>
                        <div className="text-center">
                            <div className="w-10 h-10 mx-auto bg-emerald-100 rounded-xl flex items-center justify-center mb-2">
                                <Sparkles size={20} className="text-emerald-600" />
                            </div>
                            <p className="text-xs text-stone-500 font-medium">AI Analysis</p>
                        </div>
                        <div className="text-center">
                            <div className="w-10 h-10 mx-auto bg-emerald-100 rounded-xl flex items-center justify-center mb-2">
                                <BookOpen size={20} className="text-emerald-600" />
                            </div>
                            <p className="text-xs text-stone-500 font-medium">Get Prompts</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
