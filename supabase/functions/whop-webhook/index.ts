// Supabase Edge Function: Whop Webhook Handler
// This function receives webhooks from Whop when a purchase is completed
// and automatically adds credits to the user's account

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Credit amounts for each Whop product
const PRODUCT_CREDITS: Record<string, number> = {
    'prod_nsehLcXm5w5Yj': 10,  // Starter - 10 credits
    'prod_fOnp9wXcF0P8Z': 25,  // Popular - 25 credits
    'prod_u8EzPf9CDj2nY': 100, // Pro - 100 credits
};

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-whop-signature',
};

interface WhopWebhookPayload {
    action: string;
    data: {
        id: string;
        product?: {
            id: string;
            name: string;
        };
        user?: {
            id: string;
            email: string;
            username: string;
        };
        email?: string;
        status?: string;
        created_at?: number;
        metadata?: {
            user_id?: string;
        };
    };
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        // Get environment variables
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

        // Create Supabase admin client
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Parse the webhook payload
        const payload: WhopWebhookPayload = await req.json();

        console.log('Received Whop webhook:', JSON.stringify(payload, null, 2));

        // Handle different webhook events
        // Whop events: payment_succeeded, membership_available
        const validEvents = [
            'payment_succeeded',
            'membership_available',
            'membership.went_valid',
            'payment.succeeded'
        ];

        if (validEvents.includes(payload.action)) {
            const productId = payload.data.product?.id;
            const userEmail = payload.data.email || payload.data.user?.email;
            const metadataUserId = payload.data.metadata?.user_id;

            if (!productId) {
                console.error('No product ID in webhook payload');
                return new Response(
                    JSON.stringify({ error: 'Missing product ID' }),
                    { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                );
            }

            // Get credit amount for this product
            const creditAmount = PRODUCT_CREDITS[productId];

            if (!creditAmount) {
                console.error(`Unknown product ID: ${productId}`);
                return new Response(
                    JSON.stringify({ error: 'Unknown product' }),
                    { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                );
            }

            // Find the user by email or metadata user_id
            let userId: string | null = metadataUserId || null;

            if (!userId && userEmail) {
                // Look up user by email
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('email', userEmail)
                    .single();

                if (profile) {
                    userId = profile.id;
                }
            }

            if (!userId) {
                console.error(`Could not find user for email: ${userEmail}`);

                // Log the failed webhook for manual processing
                await supabase.from('webhook_logs').insert({
                    source: 'whop',
                    event_type: payload.action,
                    payload: payload,
                    status: 'failed',
                    error_message: `User not found for email: ${userEmail}`,
                });

                return new Response(
                    JSON.stringify({ error: 'User not found', email: userEmail }),
                    { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                );
            }

            // Add credits to the user
            const { data: result, error } = await supabase.rpc('add_credits', {
                p_user_id: userId,
                p_amount: creditAmount,
                p_type: 'purchase',
                p_description: `Purchased ${creditAmount} credits via Whop`,
                p_reference_id: payload.data.id,
            });

            if (error) {
                console.error('Error adding credits:', error);

                // Log the failure
                await supabase.from('webhook_logs').insert({
                    source: 'whop',
                    event_type: payload.action,
                    payload: payload,
                    status: 'failed',
                    error_message: error.message,
                });

                return new Response(
                    JSON.stringify({ error: 'Failed to add credits' }),
                    { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                );
            }

            // Log successful webhook
            await supabase.from('webhook_logs').insert({
                source: 'whop',
                event_type: payload.action,
                payload: payload,
                status: 'success',
                user_id: userId,
                credits_added: creditAmount,
            });

            console.log(`Successfully added ${creditAmount} credits to user ${userId}`);

            return new Response(
                JSON.stringify({
                    success: true,
                    message: `Added ${creditAmount} credits`,
                    user_id: userId,
                    new_balance: result?.[0]?.new_balance
                }),
                { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // For other events, just acknowledge receipt
        console.log(`Received unhandled Whop event: ${payload.action}`);

        return new Response(
            JSON.stringify({ received: true, action: payload.action }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('Webhook error:', error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});
