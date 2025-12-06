import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface CreditPackage {
    id: string;
    name: string;
    credits: number;
    price_cents: number;
    whop_plan_id: string | null;
    is_popular: boolean;
}

export interface CreditTransaction {
    id: string;
    amount: number;
    type: 'purchase' | 'usage' | 'bonus' | 'refund';
    description: string;
    created_at: string;
    balance_after: number;
}

interface UseCreditsReturn {
    credits: number;
    loading: boolean;
    packages: CreditPackage[];
    recentTransactions: CreditTransaction[];
    hasCredits: boolean;
    refreshCredits: () => Promise<void>;
    deductCredit: (description?: string, referenceId?: string) => Promise<{ success: boolean; newBalance: number; error?: string }>;
    checkCredits: (amount?: number) => boolean;
}

export function useCredits(): UseCreditsReturn {
    const { user, profile } = useAuth();
    const [credits, setCredits] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [packages, setPackages] = useState<CreditPackage[]>([]);
    const [recentTransactions, setRecentTransactions] = useState<CreditTransaction[]>([]);

    // Load credits from profile
    useEffect(() => {
        if (profile) {
            setCredits(profile.credits ?? 4);
            setLoading(false);
        }
    }, [profile]);

    // Load packages
    useEffect(() => {
        loadPackages();
    }, []);

    const loadPackages = async () => {
        try {
            const { data } = await supabase
                .from('credit_packages')
                .select('*')
                .eq('is_active', true)
                .order('sort_order');

            if (data) {
                setPackages(data);
            }
        } catch (err) {
            console.error('Error loading packages:', err);
        }
    };

    const refreshCredits = useCallback(async () => {
        if (!user) return;

        try {
            const { data } = await supabase
                .from('profiles')
                .select('credits')
                .eq('id', user.id)
                .single();

            if (data) {
                setCredits(data.credits);
            }
        } catch (err) {
            console.error('Error refreshing credits:', err);
        }
    }, [user]);

    const loadRecentTransactions = useCallback(async () => {
        if (!user) return;

        try {
            const { data } = await supabase
                .from('credit_transactions')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(10);

            if (data) {
                setRecentTransactions(data);
            }
        } catch (err) {
            console.error('Error loading transactions:', err);
        }
    }, [user]);

    // Check if user has enough credits
    const checkCredits = useCallback((amount: number = 1): boolean => {
        return credits >= amount;
    }, [credits]);

    // Deduct credits
    const deductCredit = useCallback(async (
        description: string = 'Generation',
        referenceId?: string
    ): Promise<{ success: boolean; newBalance: number; error?: string }> => {
        if (!user) {
            return { success: false, newBalance: credits, error: 'Not authenticated' };
        }

        if (credits < 1) {
            return { success: false, newBalance: credits, error: 'Insufficient credits' };
        }

        try {
            // Call the database function
            const { data, error } = await supabase.rpc('deduct_credit', {
                p_user_id: user.id,
                p_amount: 1,
                p_description: description,
                p_reference_id: referenceId || null,
            });

            if (error) {
                console.error('Deduct credit error:', error);
                return { success: false, newBalance: credits, error: error.message };
            }

            const result = data?.[0];

            if (result?.success) {
                setCredits(result.new_balance);
                return { success: true, newBalance: result.new_balance };
            } else {
                return {
                    success: false,
                    newBalance: result?.new_balance ?? credits,
                    error: result?.error_message || 'Failed to deduct credit'
                };
            }
        } catch (err) {
            console.error('Deduct credit error:', err);
            return {
                success: false,
                newBalance: credits,
                error: err instanceof Error ? err.message : 'Unknown error'
            };
        }
    }, [user, credits]);

    return {
        credits,
        loading,
        packages,
        recentTransactions,
        hasCredits: credits > 0,
        refreshCredits,
        deductCredit,
        checkCredits,
    };
}

// Credit cost definitions
export const CREDIT_COSTS = {
    VIDEO_AD: 1,
    VISUALIZATION: 1,
    WEBSITE_ANALYSIS: 0, // Free
    PROMPT_LIBRARY: 0,   // Free
} as const;

export type CreditAction = keyof typeof CREDIT_COSTS;
