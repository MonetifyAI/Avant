/**
 * Sora 2 Pro Image-to-Video API Service
 * Integrates with kie.ai API for video generation
 */

const KIE_API_BASE = 'https://api.kie.ai/api/v1';
const KIE_API_KEY = import.meta.env.VITE_KIE_API_KEY;

export interface SoraTaskInput {
    prompt: string;
    image_urls: string[];
    aspect_ratio?: 'portrait' | 'landscape';
    n_frames?: '10' | '15';
    size?: 'standard' | 'high';
    remove_watermark?: boolean;
}

export interface CreateTaskResponse {
    code: number;
    msg: string;
    data: {
        taskId: string;
    };
}

export interface TaskStatusResponse {
    code: number;
    msg: string;
    data: {
        taskId: string;
        model: string;
        state: 'waiting' | 'success' | 'fail';
        param: string;
        resultJson: string;
        failCode: string | null;
        failMsg: string | null;
        costTime: number | null;
        completeTime: number | null;
        createTime: number;
    };
}

/**
 * Create a video generation task with Sora 2 Pro
 */
export async function createVideoTask(input: SoraTaskInput): Promise<CreateTaskResponse> {
    const response = await fetch(`${KIE_API_BASE}/jobs/createTask`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${KIE_API_KEY}`,
        },
        body: JSON.stringify({
            model: 'sora-2-pro-image-to-video',
            input: {
                prompt: input.prompt,
                image_urls: input.image_urls,
                aspect_ratio: input.aspect_ratio || 'landscape',
                n_frames: input.n_frames || '10',
                size: input.size || 'standard',
                remove_watermark: input.remove_watermark ?? true,
            },
        }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.msg || `API Error: ${response.status}`);
    }

    return response.json();
}

/**
 * Get the status of a video generation task
 */
export async function getTaskStatus(taskId: string): Promise<TaskStatusResponse> {
    const response = await fetch(
        `${KIE_API_BASE}/jobs/recordInfo?taskId=${encodeURIComponent(taskId)}`,
        {
            headers: {
                'Authorization': `Bearer ${KIE_API_KEY}`,
            },
        }
    );

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.msg || `API Error: ${response.status}`);
    }

    return response.json();
}

/**
 * Poll task status until completion
 */
export async function waitForCompletion(
    taskId: string,
    onProgress?: (status: TaskStatusResponse) => void,
    pollInterval = 5000,
    maxAttempts = 120
): Promise<TaskStatusResponse> {
    let attempts = 0;

    while (attempts < maxAttempts) {
        const status = await getTaskStatus(taskId);

        if (onProgress) {
            onProgress(status);
        }

        if (status.data.state === 'success' || status.data.state === 'fail') {
            return status;
        }

        await new Promise(resolve => setTimeout(resolve, pollInterval));
        attempts++;
    }

    throw new Error('Task timed out after maximum attempts');
}

/**
 * Extract result URLs from successful task
 */
export function extractResultUrls(status: TaskStatusResponse): string[] {
    if (status.data.state !== 'success' || !status.data.resultJson) {
        return [];
    }

    try {
        const result = JSON.parse(status.data.resultJson);
        return result.resultUrls || [];
    } catch {
        return [];
    }
}

// ============================================
// PROMPT BUILDER - Hormozi-Style Hooks
// ============================================

export type HookType =
    | 'Transformation'
    | 'Social Proof'
    | 'Before/After'
    | 'Pain-Driven'
    | 'Curiosity'
    | 'Offer'
    | 'Value'
    | 'Story'
    | 'Conditional'
    | 'Command'
    | 'Label';

export interface PromptOptions {
    hookType: HookType;
    roomType: string;
    beforeDescription?: string;
    afterDescription?: string;
    faceDescription?: string;
    companyName?: string;
    city?: string;
    customPrompt?: string;
}

/**
 * Build an optimized video prompt based on hook type and options
 */
export function buildRemodelerPrompt(options: PromptOptions): string {
    const { hookType, roomType, beforeDescription, afterDescription, faceDescription, companyName, city } = options;

    // If custom prompt provided, enhance it
    if (options.customPrompt) {
        let prompt = options.customPrompt
            .replace(/\[ROOM_TYPE\]/g, roomType)
            .replace(/\[CITY\]/g, city || 'your city');

        if (faceDescription) {
            prompt += ` A ${faceDescription} spokesperson presents the transformation with confidence.`;
        }

        return prompt;
    }

    // Build prompt based on hook type
    let basePrompt = '';

    switch (hookType) {
        case 'Transformation':
            basePrompt = `Cinematic before and after reveal of a stunning ${roomType} remodel. The camera slowly pans across the beautifully transformed space, highlighting premium finishes and craftsmanship. ${beforeDescription ? `The space transforms from ${beforeDescription}` : 'The dated space transforms'} into ${afterDescription || 'a modern, luxurious design'}. Warm lighting, smooth camera movements, professional real estate video quality.`;
            break;

        case 'Social Proof':
            basePrompt = `Happy homeowner reaction video showing genuine excitement as they see their remodeled ${roomType} for the first time. Authentic emotional moment with tears of joy. ${afterDescription || 'Beautiful modern space'} revealed. Documentary style, natural lighting.`;
            break;

        case 'Before/After':
            basePrompt = `Split-screen style transition showing dramatic ${roomType} transformation. Left side: ${beforeDescription || 'outdated, cramped space'}. Right side: ${afterDescription || 'stunning modern design'}. Smooth morphing transition between before and after. Professional marketing video quality.`;
            break;

        case 'Pain-Driven':
            basePrompt = `Relatable scene of homeowner frustrated with their ${beforeDescription || 'outdated, dysfunctional'} ${roomType}. Quick cut to the solution: a beautifully remodeled ${afterDescription || 'modern, functional'} space. ${roomType} transformation montage with satisfying results.`;
            break;

        case 'Curiosity':
            basePrompt = `Eye-catching reveal of a hidden gem ${roomType} transformation. Start with intrigue—what could this space become? Dramatic unveiling of ${afterDescription || 'stunning designer renovation'}. Stop-the-scroll worthy visuals.`;
            break;

        case 'Value':
            basePrompt = `Luxury ${roomType} reveal showcasing premium materials and craftsmanship. Before shot of ${beforeDescription || 'average space'} transforms into ${afterDescription || 'high-end, magazine-worthy design'}. Highlight details: countertops, fixtures, finishes. Real estate marketing aesthetic.`;
            break;

        case 'Story':
            basePrompt = `Emotional storytelling video of ${roomType} renovation journey. Start with the challenge, show the process, end with the heartwarming reveal. ${afterDescription || 'Beautiful finished space'}. Documentary style with authentic moments.`;
            break;

        default:
            basePrompt = `Professional marketing video of stunning ${roomType} remodel. Smooth camera work showcasing the transformation from ${beforeDescription || 'dated space'} to ${afterDescription || 'modern luxury'}. High production value, real estate photography style.`;
    }

    // Add spokesperson if face description provided
    if (faceDescription) {
        basePrompt += ` A ${faceDescription} contractor/spokesperson confidently presents the space, gesturing toward key features.`;
    }

    // Add company branding context
    if (companyName) {
        basePrompt += ` Professional ${companyName} branded presentation style.`;
    }

    return basePrompt;
}

/**
 * Hook type display information
 */
export const HOOK_TYPE_INFO: Record<HookType, { icon: string; description: string; example: string }> = {
    'Transformation': {
        icon: '✨',
        description: 'Show the dramatic change from before to after',
        example: 'Watch what $50K in skilled labor looks like...'
    },
    'Social Proof': {
        icon: '👥',
        description: 'Feature real customer reactions and results',
        example: 'See why 200+ homeowners chose us...'
    },
    'Before/After': {
        icon: '🔄',
        description: 'Side-by-side or sequential comparison',
        example: 'You won\'t believe this is the same room...'
    },
    'Pain-Driven': {
        icon: '💔',
        description: 'Address frustrations your audience feels',
        example: 'Tired of contractors who ghost you?'
    },
    'Curiosity': {
        icon: '🤔',
        description: 'Create intrigue with surprising information',
        example: 'The hidden mistake 90% of homeowners make...'
    },
    'Offer': {
        icon: '🎁',
        description: 'Lead with a compelling offer or discount',
        example: 'Free 3D render + $500 off this month...'
    },
    'Value': {
        icon: '💰',
        description: 'Emphasize ROI and investment value',
        example: 'What $30K gets you with the right contractor...'
    },
    'Story': {
        icon: '📖',
        description: 'Tell a compelling customer journey story',
        example: 'One day a homeowner called us crying...'
    },
    'Conditional': {
        icon: '👉',
        description: 'Target specific audience with if/then',
        example: 'If you\'re planning a remodel in 2024...'
    },
    'Command': {
        icon: '⚡',
        description: 'Direct instruction that demands attention',
        example: 'Watch this before you sign any contract...'
    },
    'Label': {
        icon: '🏷️',
        description: 'Call out your specific audience directly',
        example: 'Homeowners in Dallas, this is for you 🎁'
    }
};

export const ROOM_TYPES = [
    'Kitchen',
    'Bathroom',
    'Master Bathroom',
    'Living Room',
    'Bedroom',
    'Basement',
    'Exterior',
    'Full Home',
    'Commercial Space'
];
