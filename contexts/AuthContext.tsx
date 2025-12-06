import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface UserProfile {
    id: string;
    firstname: string;
    lastname: string;
    company: string;
    email: string;
    credits: number;
    created_at?: string;
    updated_at?: string;
}

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    session: Session | null;
    loading: boolean;
    signUp: (email: string, password: string, firstName: string, lastName: string, company: string) => Promise<{ error: AuthError | null }>;
    signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                loadUserProfile(session.user.id);
            } else {
                setLoading(false);
            }
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                loadUserProfile(session.user.id);
            } else {
                setProfile(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const loadUserProfile = async (userId: string) => {
        try {
            console.log('Loading profile for user:', userId);
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            console.log('Profile loaded:', { data, error });

            if (error && error.code === 'PGRST116') {
                // Profile doesn't exist - create one automatically
                console.log('Profile not found, creating automatically...');

                // Get user email from auth
                const { data: { user: authUser } } = await supabase.auth.getUser();
                const email = authUser?.email || '';
                const emailName = email.split('@')[0] || 'User';

                // Create a basic profile with default values
                const newProfile = {
                    id: userId,
                    firstname: emailName.charAt(0).toUpperCase() + emailName.slice(1), // Capitalize first letter
                    lastname: '',
                    company: '',
                    email: email,
                    credits: 4, // Default free credits
                };

                const { data: createdProfile, error: createError } = await supabase
                    .from('profiles')
                    .insert(newProfile)
                    .select()
                    .single();

                if (createError) {
                    console.error('Error creating profile:', createError);
                } else if (createdProfile) {
                    console.log('Profile created successfully:', createdProfile);
                    setProfile(createdProfile);
                }
            } else if (error) {
                console.error('Error loading profile:', error);
            } else if (data) {
                console.log('Profile data:', data);
                console.log('firstname:', data.firstname);
                setProfile(data);
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (
        email: string,
        password: string,
        firstName: string,
        lastName: string,
        company: string
    ) => {
        try {
            console.log('SignUp called with:', { email, firstName, lastName, company });

            // Sign up with user metadata so the database trigger can access the name
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        firstname: firstName,
                        lastname: lastName,
                        company: company,
                    }
                }
            });

            console.log('Auth signUp result:', { user: data?.user?.id, error });

            if (error) {
                return { error };
            }

            // Create user profile
            if (data.user) {
                console.log('Creating profile for user:', data.user.id);
                console.log('Profile data:', { firstname: firstName, lastname: lastName, company, email });

                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .insert({
                        id: data.user.id,
                        firstname: firstName,
                        lastname: lastName,
                        company,
                        email,
                        credits: 4,
                    })
                    .select()
                    .single();

                if (profileError) {
                    console.error('Error creating profile during signup:', profileError);
                } else {
                    console.log('Profile created successfully during signup:', profileData);
                    // Set the profile immediately so it doesn't trigger auto-creation
                    setProfile(profileData);
                }
            }

            return { error: null };
        } catch (error) {
            console.error('SignUp error:', error);
            return { error: error as AuthError };
        }
    };

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        return { error };
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    const value = {
        user,
        profile,
        session,
        loading,
        signUp,
        signIn,
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
