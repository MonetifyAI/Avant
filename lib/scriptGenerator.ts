/**
 * AI Script Generator - Powered by Alex Hormozi's $100M Hooks Methodology
 * Creates high-converting video ad scripts using proven hook formulas
 */

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;
const ANTHROPIC_API_BASE = 'https://api.anthropic.com/v1';

// Hormozi's 121 Best Performing Hooks - categorized for reference
const HORMOZI_HOOK_EXAMPLES = {
    labels: [
        "Local business owners, I have a gift for you 🎁",
        "Homeowners in [CITY], I have a gift for you",
        "Chiropractors, I have a gift for you",
    ],
    questions: [
        "Would you pay $1,000 to have the business of your dreams in 30 days? Well, how about free?",
        "Which would you rather be? The guy pushing the boulder up the hill? Or the one at the top who can just flick it?",
        "Do you ever look in the mirror and think 'I should be further ahead by now'?",
        "Business owners: Do you ever wonder if you're working on the wrong stuff?",
    ],
    conditionals: [
        "If you're working all the time and your business isn't growing, you're working on the wrong sh*t.",
        "If you want someone to treat you differently, you have to address it as soon as possible.",
        "If you wanna become obscenely wealthy and have your parents question if it's ethical...",
    ],
    commands: [
        "Read this if you're tired of being broke",
        "Read this if you want to win",
        "Watch this if you want to get more [OUTCOME]",
        "Stop scrolling if you've ever dreamed of a better [THING]",
    ],
    statements: [
        "The smartest thing you can do today...",
        "How to get ahead of 99% of people",
        "The rumors are true...",
        "That's weird... I don't see your name on the invite list?",
        "I have a confession...",
    ],
    listsSteps: [
        "In this video I'm going to talk to you about the 28 ways to stay poor",
        "3 hacks to make life suck less",
        "13 lessons I learned that I wish I learned earlier",
        "11 ways to get more [OUTCOME] without [PAIN]",
    ],
    narratives: [
        "One day I was in the back and this old lady comes in and she was piss angry...",
        "I'm at her parents' house in an extra bedroom. I'm the guy she met from the internet...",
        "When I was 18, I started working for a fur coat dealer...",
        "The sixth time I was arrested, they took me back to my parents' house.",
    ],
    exclamations: [
        "Ahhhhh... This is the blueprint to becoming a millionaire",
        "You guys want to hear something completely insane?",
        "On November 30th, 2022, the world changed forever.",
    ],
    provocative: [
        "Poor people stay poor because they're afraid of other poor people judging them for trying to get rich.",
        "Entrepreneurship f*cking sucks most of the time.",
        "I did a f*ck load of shit I hate and I did it for a very long period of time.",
        "America was built on the backs of men who smoked cigarettes and drove without seatbelts.",
    ],
    curiosity: [
        "You might be wondering why I just caught a banana...",
        "Here's a sign that you're hiring dumb people",
        "The hidden mistake 90% of homeowners make before a remodel...",
    ],
    socialProof: [
        "$4,664 per month in recurring revenue... That's what Kyle, the LAST person on the leaderboard, was able to build.",
        "I've been in business for 13 years. I've sold 9 companies. My last company I sold for $46,200,000.",
        "One in every 250 businesses does over 10 million a year. Every business I've started since 25 has crossed $10 million.",
    ],
};

export interface ScriptInput {
    hookType: string;
    roomType: string;
    companyName?: string;
    location?: string;
    beforeDescription?: string;
    afterDescription?: string;
    targetAudience?: string;
    uniqueSellingPoint?: string;
    videoDuration: '10' | '15';
}

export interface GeneratedScript {
    hook: string;
    body: string;
    cta: string;
    fullScript: string;
    videoPrompt: string;
    hookCategory: string;
}

export interface ScriptGenerationResult {
    success: boolean;
    script?: GeneratedScript;
    error?: string;
}

/**
 * Generate a high-converting video ad script using Hormozi's methodology
 */
export async function generateVideoScript(input: ScriptInput): Promise<ScriptGenerationResult> {
    const systemPrompt = `You are an ELITE direct response copywriter trained on Alex Hormozi's $100M Hooks methodology from Acquisition.com.

YOUR MISSION: Create hooks that STOP THE SCROLL and make people say "This is for me."

## THE HORMOZI HOOK FORMULA
Every hook has TWO parts:
1. CALL OUT - Gets the prospect to say "This is for me" (like hearing your name at a loud party)
2. CONDITION FOR VALUE - The promise of what they'll get if they consume

## HOOK CATEGORIES (use the most appropriate):

### LABELS - Call out your exact audience
Examples: "Local business owners, I have a gift for you 🎁" | "Homeowners in [CITY]..."

### QUESTIONS - Force engagement
- Yes Questions: "Would you pay $1,000 to have the [THING] of your dreams?"
- Open Questions: "Which would you rather be?"

### CONDITIONALS - If/then value statements  
Example: "If you're working all the time and your business isn't growing, you're working on the wrong sh*t."

### COMMANDS - Direct instruction
Examples: "Read this if you're tired of [PAIN]" | "Watch this if you want [OUTCOME]"

### STATEMENTS - Bold claims that demand attention
Examples: "The smartest thing you can do today..." | "The rumors are true..."

### LISTS/STEPS - Promise structured value
Example: "11 ways to get more [OUTCOME] without [PAIN]"

### NARRATIVES - Story hooks that create curiosity
Example: "One day I was in the back and this old lady comes in and she was piss angry..."

### PROVOCATIVE - Pattern interrupts that shock
Example: "Poor people stay poor because they're afraid of other poor people judging them."

## TOP-PERFORMING AD HOOKS FROM HORMOZI (model these):
- "You might be wondering why I just caught a banana... And the reason is because the amount of value I'm going to give you in the next 30 seconds is BANANAS."
- "That's weird... I don't see your name on the invite list?"
- "I have a confession... I am sick and tired of seeing people who have never run a business teaching other people how to grow businesses."
- "Real quick question... Can I have your email address?"
- "$4,664 per month in recurring revenue... That's what Kyle, the LAST person on the leaderboard, was able to build."

## FOR HOME REMODELING SPECIFICALLY:
- Call out homeowners directly by location or situation
- Lead with transformation/pain point (ugly kitchen, outdated bathroom)
- Show specific results ("added $75,000 to their home value")
- Create urgency without being salesy
- Use before/after tension

## YOUR OUTPUT MUST BE:
{
    "hook": "The opening 2-3 seconds that STOPS THE SCROLL - make it specific, surprising, or directly calling out the viewer",
    "body": "The middle section that builds desire and shows the transformation - be specific about results",
    "cta": "Clear call to action - tell them EXACTLY what to do next",
    "fullScript": "The complete narration combining all parts - should flow naturally when spoken",
    "videoPrompt": "Detailed video generation prompt describing visuals that MATCH the hook energy",
    "hookCategory": "Which hook category was used (label/question/conditional/command/statement/list/narrative/provocative)"
}

CRITICAL RULES:
1. The hook must work in the FIRST 2 SECONDS or you lose them
2. Be SPECIFIC - vague hooks die. "$47,000 kitchen transformation" beats "amazing remodel"
3. Sound CONVERSATIONAL not corporate. Write like you talk.
4. Create TENSION between current state and desired state
5. The hook should make them feel like you're talking DIRECTLY to them`;

    const userPrompt = `Create a ${input.videoDuration}-second video ad script for a home remodeling company.

BUSINESS DETAILS:
- Target Room: ${input.roomType}
- Preferred Hook Style: ${input.hookType}
${input.companyName ? `- Company: ${input.companyName}` : ''}
${input.location ? `- Location: ${input.location}` : ''}
${input.beforeDescription ? `- Before State: ${input.beforeDescription}` : ''}
${input.afterDescription ? `- After State: ${input.afterDescription}` : ''}
${input.targetAudience ? `- Target Audience: ${input.targetAudience}` : '- Target Audience: Homeowners looking to remodel'}
${input.uniqueSellingPoint ? `- USP: ${input.uniqueSellingPoint}` : ''}

TIMING:
- Hook: ${input.videoDuration === '10' ? '2' : '3'} seconds (MUST stop the scroll immediately)
- Body: ${input.videoDuration === '10' ? '5' : '8'} seconds (build desire, show transformation)
- CTA: ${input.videoDuration === '10' ? '3' : '4'} seconds (clear next step)

Remember: The hook is 80% of the ad's success. Spend most of your thinking time on making it IMPOSSIBLE to scroll past.

Output ONLY the JSON object, no other text.`;

    try {
        const response = await fetch(`${ANTHROPIC_API_BASE}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true',
            },
            body: JSON.stringify({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 2000,
                messages: [
                    {
                        role: 'user',
                        content: userPrompt,
                    },
                ],
                system: systemPrompt,
            }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            console.error('Claude API error:', error);
            throw new Error(error.error?.message || `Claude API error: ${response.status}`);
        }

        const result = await response.json();
        const textContent = result.content?.find((c: any) => c.type === 'text')?.text;

        if (!textContent) {
            throw new Error('No text content in Claude response');
        }

        // Parse JSON - handle potential markdown code blocks
        let jsonStr = textContent.trim();
        if (jsonStr.startsWith('```')) {
            jsonStr = jsonStr.replace(/```json?\n?/g, '').replace(/```$/g, '').trim();
        }

        const parsed = JSON.parse(jsonStr);

        return {
            success: true,
            script: {
                hook: parsed.hook,
                body: parsed.body,
                cta: parsed.cta,
                fullScript: parsed.fullScript,
                videoPrompt: parsed.videoPrompt,
                hookCategory: parsed.hookCategory || 'custom',
            },
        };
    } catch (error) {
        console.error('Script generation error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to generate script',
        };
    }
}

/**
 * Get hook examples for a specific category
 */
export function getHookExamples(category: string): string[] {
    const categoryMap: Record<string, keyof typeof HORMOZI_HOOK_EXAMPLES> = {
        'Transformation': 'statements',
        'Social Proof': 'socialProof',
        'Before/After': 'curiosity',
        'Pain-Driven': 'conditionals',
        'Curiosity': 'curiosity',
        'Offer': 'labels',
        'Value': 'statements',
        'Story': 'narratives',
        'Conditional': 'conditionals',
        'Command': 'commands',
        'Label': 'labels',
    };

    const key = categoryMap[category] || 'statements';
    return HORMOZI_HOOK_EXAMPLES[key] || [];
}
