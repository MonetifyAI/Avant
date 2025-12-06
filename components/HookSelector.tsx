import React from 'react';
import { HookType, HOOK_TYPE_INFO } from '../lib/soraApi';

interface HookSelectorProps {
    value: HookType | null;
    onChange: (hookType: HookType) => void;
}

export const HookSelector: React.FC<HookSelectorProps> = ({ value, onChange }) => {
    const hookTypes = Object.entries(HOOK_TYPE_INFO) as [HookType, typeof HOOK_TYPE_INFO[HookType]][];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-bold text-stone-700 uppercase tracking-wide">
                    Hook Type
                </label>
                <span className="text-xs text-stone-400">Select the style of your ad</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {hookTypes.map(([type, info]) => {
                    const isSelected = value === type;

                    return (
                        <button
                            key={type}
                            onClick={() => onChange(type)}
                            className={`
                group relative p-4 rounded-2xl border-2 text-left transition-all duration-200
                ${isSelected
                                    ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/20'
                                    : 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-md'
                                }
              `}
                        >
                            {/* Selected indicator */}
                            {isSelected && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}

                            <div className="text-2xl mb-2">{info.icon}</div>

                            <h3 className={`
                font-bold text-sm mb-1 transition-colors
                ${isSelected ? 'text-emerald-700' : 'text-stone-900 group-hover:text-emerald-700'}
              `}>
                                {type}
                            </h3>

                            <p className="text-xs text-stone-500 line-clamp-2">
                                {info.description}
                            </p>
                        </button>
                    );
                })}
            </div>

            {/* Example preview */}
            {value && (
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                    <p className="text-xs text-stone-400 uppercase tracking-wide font-bold mb-2">
                        Example Hook
                    </p>
                    <p className="text-stone-700 font-medium italic">
                        "{HOOK_TYPE_INFO[value].example}"
                    </p>
                </div>
            )}
        </div>
    );
};
