/**
 * Nano Banana Pro API Service
 * Transforms raw job site photos into finished design visualizations
 */

const KIE_API_BASE = 'https://api.kie.ai/api/v1';
const KIE_API_KEY = import.meta.env.VITE_KIE_API_KEY;

export interface NanoBananaInput {
    prompt: string;
    image_input: string[];  // URLs of input images
    aspect_ratio?: '1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '4:5' | '5:4' | '9:16' | '16:9' | '21:9' | 'auto';
    resolution?: '1K' | '2K' | '4K';
    output_format?: 'png' | 'jpg';
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
 * Create an image generation task with Nano Banana Pro
 */
export async function createVisualizationTask(input: NanoBananaInput): Promise<CreateTaskResponse> {
    const response = await fetch(`${KIE_API_BASE}/jobs/createTask`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${KIE_API_KEY}`,
        },
        body: JSON.stringify({
            model: 'nano-banana-pro',
            input: {
                prompt: input.prompt,
                image_input: input.image_input,
                aspect_ratio: input.aspect_ratio || 'auto',
                resolution: input.resolution || '2K',
                output_format: input.output_format || 'png',
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
 * Get the status of an image generation task
 */
export async function getVisualizationTaskStatus(taskId: string): Promise<TaskStatusResponse> {
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
export async function waitForVisualizationCompletion(
    taskId: string,
    onProgress?: (status: TaskStatusResponse) => void,
    pollInterval = 3000,
    maxAttempts = 60
): Promise<TaskStatusResponse> {
    let attempts = 0;

    while (attempts < maxAttempts) {
        const status = await getVisualizationTaskStatus(taskId);

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
export function extractVisualizationResultUrls(status: TaskStatusResponse): string[] {
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
// REMODELING PROMPT TEMPLATES
// ============================================

export type RemodelStyle =
    | 'modern'
    | 'traditional'
    | 'contemporary'
    | 'farmhouse'
    | 'industrial'
    | 'coastal'
    | 'minimalist'
    | 'luxury';

export type RoomType =
    | 'kitchen'
    | 'bathroom'
    | 'living_room'
    | 'bedroom'
    | 'basement'
    | 'exterior'
    | 'office'
    | 'commercial';

export interface VisualizationOptions {
    roomType: RoomType;
    style: RemodelStyle;
    customDescription?: string;
    keepLayout?: boolean;
    lighting?: 'bright_natural' | 'warm_ambient' | 'dramatic' | 'soft_modern';
}

/**
 * Build an optimized visualization prompt
 */
export function buildVisualizationPrompt(options: VisualizationOptions): string {
    const styleDescriptions: Record<RemodelStyle, string> = {
        modern: 'sleek modern design with clean lines, minimalist fixtures, and contemporary finishes',
        traditional: 'classic traditional design with elegant moldings, rich wood tones, and timeless details',
        contemporary: 'contemporary design with current trends, mixed materials, and sophisticated styling',
        farmhouse: 'warm farmhouse style with shiplap, rustic wood, and cozy cottage elements',
        industrial: 'urban industrial design with exposed brick, metal accents, and raw textures',
        coastal: 'bright coastal design with light colors, natural textures, and beach-inspired elements',
        minimalist: 'minimalist design with clean surfaces, neutral palette, and uncluttered spaces',
        luxury: 'high-end luxury design with premium materials, designer fixtures, and opulent details',
    };

    const roomDescriptions: Record<RoomType, string> = {
        kitchen: 'kitchen with professional-grade appliances, custom cabinetry, and premium countertops',
        bathroom: 'spa-like bathroom with designer fixtures, elegant tile work, and luxurious finishes',
        living_room: 'living room with comfortable seating, beautiful lighting, and harmonious decor',
        bedroom: 'serene bedroom with cozy bedding, ambient lighting, and calming atmosphere',
        basement: 'finished basement with entertainment area, proper lighting, and quality flooring',
        exterior: 'stunning home exterior with beautiful landscaping, fresh paint, and curb appeal',
        office: 'productive home office with ergonomic furniture, good lighting, and organized storage',
        commercial: 'professional commercial space with modern fixtures, strategic layout, and brand-appropriate design',
    };

    const lightingDescriptions = {
        bright_natural: 'flooded with bright natural light from large windows',
        warm_ambient: 'bathed in warm ambient lighting creating a cozy atmosphere',
        dramatic: 'dramatically lit with strategic accent lighting and shadows',
        soft_modern: 'softly lit with modern recessed and pendant lighting',
    };

    let prompt = `Transform this raw construction/job site photo into a stunning, photorealistic visualization of a beautifully finished ${roomDescriptions[options.roomType]}. `;

    prompt += `Apply a ${styleDescriptions[options.style]}. `;

    if (options.lighting) {
        prompt += `The space should be ${lightingDescriptions[options.lighting]}. `;
    }

    if (options.keepLayout) {
        prompt += `Maintain the exact same room layout, dimensions, and architectural features from the original photo. `;
    }

    if (options.customDescription) {
        prompt += `Additional details: ${options.customDescription}. `;
    }

    prompt += `The result should be a professional architectural rendering suitable for client presentations, with realistic textures, proper perspective, and magazine-quality finish. High detail, photorealistic, interior design visualization.`;

    return prompt;
}

export const ROOM_TYPES: { value: RoomType; label: string; icon: string }[] = [
    { value: 'kitchen', label: 'Kitchen', icon: '🍳' },
    { value: 'bathroom', label: 'Bathroom', icon: '🚿' },
    { value: 'living_room', label: 'Living Room', icon: '🛋️' },
    { value: 'bedroom', label: 'Bedroom', icon: '🛏️' },
    { value: 'basement', label: 'Basement', icon: '🏠' },
    { value: 'exterior', label: 'Exterior', icon: '🏡' },
    { value: 'office', label: 'Home Office', icon: '💼' },
    { value: 'commercial', label: 'Commercial', icon: '🏢' },
];

export const DESIGN_STYLES: { value: RemodelStyle; label: string; description: string }[] = [
    { value: 'modern', label: 'Modern', description: 'Clean lines, minimalist' },
    { value: 'traditional', label: 'Traditional', description: 'Classic, timeless elegance' },
    { value: 'contemporary', label: 'Contemporary', description: 'Current trends, sophisticated' },
    { value: 'farmhouse', label: 'Farmhouse', description: 'Rustic, cozy charm' },
    { value: 'industrial', label: 'Industrial', description: 'Urban, raw materials' },
    { value: 'coastal', label: 'Coastal', description: 'Light, beach-inspired' },
    { value: 'minimalist', label: 'Minimalist', description: 'Simple, uncluttered' },
    { value: 'luxury', label: 'Luxury', description: 'Premium, high-end' },
];

export const ASPECT_RATIOS = [
    { value: 'auto', label: 'Auto (Match Original)' },
    { value: '16:9', label: '16:9 (Widescreen)' },
    { value: '4:3', label: '4:3 (Standard)' },
    { value: '1:1', label: '1:1 (Square)' },
    { value: '3:2', label: '3:2 (Photo)' },
    { value: '9:16', label: '9:16 (Portrait)' },
];

export const RESOLUTIONS = [
    { value: '1K', label: '1K (Fast)', description: '~1024px' },
    { value: '2K', label: '2K (Balanced)', description: '~2048px' },
    { value: '4K', label: '4K (High Quality)', description: '~4096px' },
];
