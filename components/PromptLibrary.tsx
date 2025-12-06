import React, { useState, useEffect } from 'react';
import {
    Search,
    Sparkles,
    TrendingUp,
    ChevronRight,
    BookOpen,
    Filter,
    X
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Prompt {
    id: string;
    title: string;
    prompt: string;
    category: string;
    hook_type: string;
    awareness_level: string | null;
    use_count: number;
    is_featured: boolean;
}

interface PromptLibraryProps {
    onSelectPrompt?: (prompt: Prompt) => void;
}

const CATEGORIES = ['All', 'Kitchen', 'Bathroom', 'Full Home', 'Exterior', 'Commercial'];

const HOOK_TYPES = [
    'All',
    'Transformation',
    'Social Proof',
    'Before/After',
    'Pain-Driven',
    'Curiosity',
    'Offer',
    'Value',
    'Story',
    'Conditional',
    'Command',
    'Label'
];

const HOOK_ICONS: Record<string, string> = {
    'Transformation': '✨',
    'Social Proof': '👥',
    'Before/After': '🔄',
    'Pain-Driven': '💔',
    'Curiosity': '🤔',
    'Offer': '🎁',
    'Value': '💰',
    'Story': '📖',
    'Conditional': '👉',
    'Command': '⚡',
    'Label': '🏷️'
};

export const PromptLibrary: React.FC<PromptLibraryProps> = ({ onSelectPrompt }) => {
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedHookType, setSelectedHookType] = useState('All');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        loadPrompts();
    }, []);

    const loadPrompts = async () => {
        try {
            const { data, error } = await supabase
                .from('prompts')
                .select('*')
                .order('is_featured', { ascending: false })
                .order('use_count', { ascending: false });

            if (error) throw error;
            setPrompts(data || []);
        } catch (err) {
            console.error('Error loading prompts:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUsePrompt = async (prompt: Prompt) => {
        // Increment use count
        await supabase
            .from('prompts')
            .update({ use_count: prompt.use_count + 1 })
            .eq('id', prompt.id);

        if (onSelectPrompt) {
            onSelectPrompt(prompt);
        }
    };

    // Filter prompts
    const filteredPrompts = prompts.filter((prompt) => {
        const matchesSearch =
            prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            prompt.prompt.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
            selectedCategory === 'All' || prompt.category === selectedCategory;

        const matchesHookType =
            selectedHookType === 'All' || prompt.hook_type === selectedHookType;

        return matchesSearch && matchesCategory && matchesHookType;
    });

    const featuredPrompts = filteredPrompts.filter(p => p.is_featured);
    const regularPrompts = filteredPrompts.filter(p => !p.is_featured);

    const clearFilters = () => {
        setSelectedCategory('All');
        setSelectedHookType('All');
        setSearchQuery('');
    };

    const hasActiveFilters = selectedCategory !== 'All' || selectedHookType !== 'All' || searchQuery !== '';

    return (
        <div className="max-w-[1400px] mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight">
                    Prompt <span className="text-emerald-600">Library</span>
                </h1>
                <p className="text-stone-500 mt-2 text-lg">
                    Proven hooks and prompts for high-converting remodeler ads
                </p>
            </div>

            {/* Search & Filters */}
            <div className="bg-white rounded-[2rem] p-6 shadow-soft border border-stone-100">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search prompts..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                    </div>

                    {/* Filter Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${showFilters || hasActiveFilters
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
                            }`}
                    >
                        <Filter size={18} />
                        Filters
                        {hasActiveFilters && (
                            <span className="w-5 h-5 bg-emerald-600 text-white text-xs rounded-full flex items-center justify-center">
                                {(selectedCategory !== 'All' ? 1 : 0) + (selectedHookType !== 'All' ? 1 : 0)}
                            </span>
                        )}
                    </button>
                </div>

                {/* Expanded Filters */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-stone-100 space-y-4 animate-in slide-in-from-top-2 duration-200">
                        {/* Categories */}
                        <div>
                            <label className="block text-sm font-bold text-stone-600 mb-2">Category</label>
                            <div className="flex flex-wrap gap-2">
                                {CATEGORIES.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category
                                            ? 'bg-stone-900 text-white'
                                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                            }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Hook Types */}
                        <div>
                            <label className="block text-sm font-bold text-stone-600 mb-2">Hook Type</label>
                            <div className="flex flex-wrap gap-2">
                                {HOOK_TYPES.map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setSelectedHookType(type)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedHookType === type
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                            }`}
                                    >
                                        {type !== 'All' && HOOK_ICONS[type]} {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Clear Filters */}
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-2 text-sm text-stone-500 hover:text-rose-600 transition-colors"
                            >
                                <X size={16} />
                                Clear all filters
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-stone-500">
                <span className="flex items-center gap-1">
                    <BookOpen size={16} />
                    {filteredPrompts.length} prompts
                </span>
                {featuredPrompts.length > 0 && (
                    <span className="flex items-center gap-1">
                        <Sparkles size={16} className="text-amber-500" />
                        {featuredPrompts.length} featured
                    </span>
                )}
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-12 h-12 rounded-full border-3 border-emerald-500 border-t-transparent animate-spin" />
                </div>
            ) : prompts.length === 0 ? (
                /* Empty state when no prompts exist */
                <div className="bg-stone-50 rounded-[2.5rem] p-12 border-2 border-dashed border-stone-200 text-center">
                    <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center mb-6 shadow-lg">
                        <BookOpen size={36} className="text-stone-400" />
                    </div>
                    <h3 className="text-xl font-bold text-stone-900 mb-2">No Prompts Yet</h3>
                    <p className="text-stone-500 max-w-md mx-auto">
                        Use the Website Analyzer to automatically generate personalized prompts for your business, or create custom prompts in the AI Video Studio.
                    </p>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Featured Prompts */}
                    {featuredPrompts.length > 0 && (
                        <div>
                            <h2 className="flex items-center gap-2 text-xl font-bold text-stone-900 mb-4">
                                <Sparkles size={20} className="text-amber-500" />
                                Featured Prompts
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {featuredPrompts.map((prompt) => (
                                    <PromptCard
                                        key={prompt.id}
                                        prompt={prompt}
                                        onUse={() => handleUsePrompt(prompt)}
                                        featured
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* All Prompts */}
                    <div>
                        <h2 className="flex items-center gap-2 text-xl font-bold text-stone-900 mb-4">
                            <TrendingUp size={20} className="text-emerald-600" />
                            {selectedCategory !== 'All' ? selectedCategory : 'All'} Prompts
                        </h2>

                        {regularPrompts.length === 0 && featuredPrompts.length === 0 ? (
                            <div className="text-center py-12 bg-stone-50 rounded-2xl border border-stone-200">
                                <p className="text-stone-500">No prompts found matching your filters.</p>
                                <button
                                    onClick={clearFilters}
                                    className="mt-4 text-emerald-600 font-medium hover:underline"
                                >
                                    Clear filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {regularPrompts.map((prompt) => (
                                    <PromptCard
                                        key={prompt.id}
                                        prompt={prompt}
                                        onUse={() => handleUsePrompt(prompt)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// Prompt Card Component
interface PromptCardProps {
    prompt: Prompt;
    onUse: () => void;
    featured?: boolean;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, onUse, featured }) => {
    return (
        <div
            className={`
        group relative bg-white rounded-2xl p-6 border transition-all duration-200 hover:shadow-lg
        ${featured
                    ? 'border-amber-200 shadow-md shadow-amber-500/10'
                    : 'border-stone-200 shadow-soft'
                }
      `}
        >
            {/* Featured badge */}
            {featured && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center shadow-lg">
                    <Sparkles size={14} className="text-white" />
                </div>
            )}

            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div>
                    <span className="text-2xl mb-1 block">{HOOK_ICONS[prompt.hook_type] || '📝'}</span>
                    <h3 className="font-bold text-stone-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                        {prompt.title}
                    </h3>
                </div>
            </div>

            {/* Prompt preview */}
            <p className="text-sm text-stone-600 line-clamp-3 mb-4 leading-relaxed">
                {prompt.prompt}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
                <span className="px-2 py-0.5 bg-stone-100 text-stone-600 text-xs font-medium rounded-full">
                    {prompt.category}
                </span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">
                    {prompt.hook_type}
                </span>
                {prompt.awareness_level && (
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                        {prompt.awareness_level}
                    </span>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                <span className="text-xs text-stone-400">
                    Used {prompt.use_count} times
                </span>
                <button
                    onClick={onUse}
                    className="flex items-center gap-1 px-4 py-2 bg-stone-900 text-white text-sm font-bold rounded-xl hover:bg-emerald-600 transition-colors"
                >
                    Use
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};
