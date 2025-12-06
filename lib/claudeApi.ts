/**
 * Claude AI API Service
 * Uses Claude Haiku to generate personalized prompts from business data
 */

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;
const ANTHROPIC_API_BASE = 'https://api.anthropic.com/v1';

export interface GeneratedPrompt {
    title: string;
    prompt: string;
    hookType: string;
    category: string;
    awarenessLevel: string;
}

export interface PromptGenerationResult {
    success: boolean;
    prompts?: GeneratedPrompt[];
    businessSummary?: {
        companyName: string;
        services: string[];
        location: string;
        uniqueSellingPoints: string[];
    };
    error?: string;
}

/**
 * Generate personalized prompts using Claude Haiku
 */
export async function generatePersonalizedPrompts(
    websiteContent: string,
    existingInfo?: {
        companyName?: string;
        location?: string;
    }
): Promise<PromptGenerationResult> {
    const systemPrompt = `You are an expert marketing copywriter specializing in home remodeling and construction marketing. 
Your task is to analyze a remodeling company's website content and generate highly effective video ad hooks based on Alex Hormozi's $100M marketing playbooks.

You must generate hooks that are:
1. Specific to the company's actual services, location, and unique selling points
2. Based on proven hook formulas (Transformation, Social Proof, Pain-Driven, Curiosity, Offer, Value, Story, etc.)
3. Optimized for video ad formats (10-15 seconds)
4. Targeting different awareness levels (Unaware → Most Aware)

For each hook, specify:
- A catchy title
- The full hook/prompt text for video generation
- Hook type (Transformation, Social Proof, Before/After, Pain-Driven, Curiosity, Offer, Value, Story, Conditional, Command, Label)
- Category (Kitchen, Bathroom, Full Home, Exterior, Commercial)  
- Awareness Level (Unaware, Problem Aware, Solution Aware, Product Aware, Most Aware)

Output ONLY valid JSON in this exact format:
{
  "businessSummary": {
    "companyName": "extracted company name",
    "services": ["service1", "service2"],
    "location": "city/region",
    "uniqueSellingPoints": ["usp1", "usp2"]
  },
  "prompts": [
    {
      "title": "Hook Title",
      "prompt": "Full video prompt text with company specifics...",
      "hookType": "Transformation",
      "category": "Kitchen", 
      "awarenessLevel": "Solution Aware"
    }
  ]
}`;

    const userPrompt = `Analyze this home remodeling company's website content and generate 10-15 personalized video ad hooks.

${existingInfo?.companyName ? `Company Name: ${existingInfo.companyName}` : ''}
${existingInfo?.location ? `Location: ${existingInfo.location}` : ''}

Website Content:
${websiteContent.slice(0, 15000)}

Generate hooks that:
1. Use the company's actual name and location
2. Reference their specific services (kitchens, bathrooms, etc.)
3. Include their unique selling points
4. Cover different hook types and awareness levels
5. Are ready to use for Sora video generation

Remember: Output ONLY the JSON object, no other text.`;

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
                model: 'claude-3-haiku-20240307',
                max_tokens: 4096,
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

        // Extract the text content from Claude's response
        const textContent = result.content?.find((c: any) => c.type === 'text')?.text;

        if (!textContent) {
            throw new Error('No text content in Claude response');
        }

        // Parse the JSON response
        const parsed = JSON.parse(textContent);

        return {
            success: true,
            prompts: parsed.prompts,
            businessSummary: parsed.businessSummary,
        };
    } catch (error) {
        console.error('Claude prompt generation error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to generate prompts',
        };
    }
}

/**
 * Generate a single custom prompt based on user input
 */
export async function generateSinglePrompt(
    businessInfo: {
        companyName: string;
        service: string;
        location?: string;
        uniquePoint?: string;
    },
    hookType: string,
    category: string
): Promise<{ success: boolean; prompt?: string; error?: string }> {
    const userPrompt = `Generate a single compelling video ad hook for a home remodeling company.

Company: ${businessInfo.companyName}
Service Focus: ${businessInfo.service}
${businessInfo.location ? `Location: ${businessInfo.location}` : ''}
${businessInfo.uniquePoint ? `Unique Selling Point: ${businessInfo.uniquePoint}` : ''}
Hook Type: ${hookType}
Category: ${category}

Generate ONLY the hook text (2-3 sentences max), nothing else. Make it specific to this company and ready for video generation.`;

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
                model: 'claude-3-haiku-20240307',
                max_tokens: 500,
                messages: [
                    {
                        role: 'user',
                        content: userPrompt,
                    },
                ],
            }),
        });

        if (!response.ok) {
            throw new Error(`Claude API error: ${response.status}`);
        }

        const result = await response.json();
        const promptText = result.content?.find((c: any) => c.type === 'text')?.text;

        return {
            success: true,
            prompt: promptText?.trim(),
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to generate prompt',
        };
    }
}
