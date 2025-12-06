import React, { useState } from 'react';
import {
    Wand2,
    RefreshCw,
    Copy,
    Check,
    Sparkles,
    Edit3,
    ChevronDown,
    ChevronUp,
    Zap
} from 'lucide-react';
import { generateVideoScript, GeneratedScript, ScriptInput } from '../lib/scriptGenerator';
import { HookType, HOOK_TYPE_INFO } from '../lib/soraApi';

interface ScriptGeneratorProps {
    hookType: HookType | null;
    roomType: string;
    companyName?: string;
    location?: string;
    services?: string[];
    uniqueSellingPoints?: string[];
    duration: '10' | '15';
    beforeDescription?: string;
    afterDescription?: string;
    onUseScript: (script: GeneratedScript) => void;
}

export const ScriptGenerator: React.FC<ScriptGeneratorProps> = ({
    hookType,
    roomType,
    companyName,
    location,
    services,
    uniqueSellingPoints,
    duration,
    beforeDescription,
    afterDescription,
    onUseScript,
}) => {
    const [script, setScript] = useState<GeneratedScript | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedScript, setEditedScript] = useState<GeneratedScript | null>(null);
    const [copied, setCopied] = useState<string | null>(null);
    const [isExpanded, setIsExpanded] = useState(true);

    const handleGenerate = async () => {
        if (!hookType) return;

        setIsGenerating(true);
        setError(null);

        const input: ScriptInput = {
            hookType,
            roomType,
            companyName,
            location,
            uniqueSellingPoint: uniqueSellingPoints?.join(', '),
            targetAudience: services ? `Homeowners looking for ${services.slice(0, 3).join(', ')}` : undefined,
            videoDuration: duration,
            beforeDescription,
            afterDescription,
        };

        const result = await generateVideoScript(input);

        if (result.success && result.script) {
            setScript(result.script);
            setEditedScript(result.script);
        } else {
            setError(result.error || 'Failed to generate script');
        }

        setIsGenerating(false);
    };

    const handleCopy = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopied(field);
        setTimeout(() => setCopied(null), 2000);
    };

    const handleUseScript = () => {
        if (editedScript) {
            onUseScript(editedScript);
        }
    };

    const CopyButton: React.FC<{ text: string; field: string }> = ({ text, field }) => (
        <button
            onClick={() => handleCopy(text, field)}
            className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
            title="Copy"
        >
            {copied === field ? (
                <Check size={14} className="text-emerald-500" />
            ) : (
                <Copy size={14} className="text-stone-400" />
            )}
        </button>
    );

    return (
        <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-[2rem] p-6 border border-violet-100">
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between mb-4"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
                        <Wand2 size={20} className="text-white" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-stone-900">AI Script Generator</h3>
                        <p className="text-xs text-stone-500">Powered by $100M Hooks methodology</p>
                    </div>
                </div>
                {isExpanded ? (
                    <ChevronUp size={20} className="text-stone-400" />
                ) : (
                    <ChevronDown size={20} className="text-stone-400" />
                )}
            </button>

            {isExpanded && (
                <div className="space-y-4">
                    {/* Generate Button */}
                    {!script && (
                        <button
                            onClick={handleGenerate}
                            disabled={!hookType || isGenerating}
                            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${hookType && !isGenerating
                                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30 hover:-translate-y-0.5'
                                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                                }`}
                        >
                            {isGenerating ? (
                                <>
                                    <RefreshCw size={18} className="animate-spin" />
                                    Generating Script...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={18} />
                                    Generate AI Script
                                </>
                            )}
                        </button>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Generated Script */}
                    {script && !isEditing && (
                        <div className="space-y-4">
                            {/* Hook */}
                            <div className="bg-white rounded-xl p-4 border border-violet-100">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-violet-600 uppercase tracking-wider">
                                            🎣 Hook ({duration === '10' ? '2' : '3'}s)
                                        </span>
                                        {editedScript?.hookCategory && (
                                            <span className="px-2 py-0.5 bg-violet-100 text-violet-700 text-xs font-medium rounded-full">
                                                {editedScript.hookCategory}
                                            </span>
                                        )}
                                    </div>
                                    <CopyButton text={editedScript?.hook || ''} field="hook" />
                                </div>
                                <p className="text-stone-800 font-medium">{editedScript?.hook}</p>
                            </div>

                            {/* Body */}
                            <div className="bg-white rounded-xl p-4 border border-violet-100">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-violet-600 uppercase tracking-wider">
                                        📝 Body ({duration === '10' ? '5' : '8'}s)
                                    </span>
                                    <CopyButton text={editedScript?.body || ''} field="body" />
                                </div>
                                <p className="text-stone-700">{editedScript?.body}</p>
                            </div>

                            {/* CTA */}
                            <div className="bg-white rounded-xl p-4 border border-violet-100">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-violet-600 uppercase tracking-wider">
                                        📣 Call to Action ({duration === '10' ? '3' : '4'}s)
                                    </span>
                                    <CopyButton text={editedScript?.cta || ''} field="cta" />
                                </div>
                                <p className="text-stone-800 font-semibold">{editedScript?.cta}</p>
                            </div>

                            {/* Video Prompt Preview */}
                            <div className="bg-stone-900 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                                        <Sparkles size={12} />
                                        Generated Video Prompt
                                    </span>
                                    <CopyButton text={editedScript?.videoPrompt || ''} field="prompt" />
                                </div>
                                <p className="text-stone-300 text-sm leading-relaxed">
                                    {editedScript?.videoPrompt}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleUseScript}
                                    className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-violet-500/30 transition-all hover:-translate-y-0.5"
                                >
                                    <Zap size={18} />
                                    Use This Script
                                </button>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="py-3 px-5 bg-white border border-stone-200 text-stone-700 rounded-xl font-semibold flex items-center gap-2 hover:bg-stone-50 transition-colors"
                                >
                                    <Edit3 size={16} />
                                    Edit
                                </button>
                                <button
                                    onClick={handleGenerate}
                                    disabled={isGenerating}
                                    className="py-3 px-5 bg-white border border-stone-200 text-stone-700 rounded-xl font-semibold flex items-center gap-2 hover:bg-stone-50 transition-colors"
                                >
                                    <RefreshCw size={16} className={isGenerating ? 'animate-spin' : ''} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Edit Mode */}
                    {script && isEditing && editedScript && (
                        <div className="space-y-4">
                            <div className="space-y-3">
                                <label className="block">
                                    <span className="text-xs font-bold text-violet-600 uppercase tracking-wider">Hook</span>
                                    <textarea
                                        value={editedScript.hook}
                                        onChange={(e) => setEditedScript({ ...editedScript, hook: e.target.value })}
                                        rows={2}
                                        className="w-full mt-1 px-4 py-3 rounded-xl border border-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-xs font-bold text-violet-600 uppercase tracking-wider">Body</span>
                                    <textarea
                                        value={editedScript.body}
                                        onChange={(e) => setEditedScript({ ...editedScript, body: e.target.value })}
                                        rows={3}
                                        className="w-full mt-1 px-4 py-3 rounded-xl border border-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-xs font-bold text-violet-600 uppercase tracking-wider">Call to Action</span>
                                    <textarea
                                        value={editedScript.cta}
                                        onChange={(e) => setEditedScript({ ...editedScript, cta: e.target.value })}
                                        rows={2}
                                        className="w-full mt-1 px-4 py-3 rounded-xl border border-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-xs font-bold text-violet-600 uppercase tracking-wider">Video Prompt</span>
                                    <textarea
                                        value={editedScript.videoPrompt}
                                        onChange={(e) => setEditedScript({ ...editedScript, videoPrompt: e.target.value })}
                                        rows={4}
                                        className="w-full mt-1 px-4 py-3 rounded-xl border border-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none font-mono text-sm"
                                    />
                                </label>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-bold"
                                >
                                    Save Changes
                                </button>
                                <button
                                    onClick={() => {
                                        setEditedScript(script);
                                        setIsEditing(false);
                                    }}
                                    className="py-3 px-5 bg-stone-100 text-stone-700 rounded-xl font-semibold"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Helper text when no hook selected */}
                    {!hookType && !script && (
                        <p className="text-center text-stone-500 text-sm py-4">
                            Select a hook type above to generate an AI script
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};
