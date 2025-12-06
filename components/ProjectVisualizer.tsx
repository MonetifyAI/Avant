import React, { useState, useEffect } from 'react';
import {
    Palette,
    Sparkles,
    Download,
    RefreshCw,
    CheckCircle2,
    XCircle,
    ChevronDown,
    Wand2,
    Image as ImageIcon,
    Layers,
    Sun,
    ZoomIn,
    Save
} from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import {
    RoomType,
    RemodelStyle,
    ROOM_TYPES,
    DESIGN_STYLES,
    ASPECT_RATIOS,
    RESOLUTIONS,
    buildVisualizationPrompt,
    createVisualizationTask,
    waitForVisualizationCompletion,
    extractVisualizationResultUrls,
    TaskStatusResponse
} from '../lib/nanoBananaApi';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type GenerationStatus = 'idle' | 'generating' | 'success' | 'failed';

export const ProjectVisualizer: React.FC = () => {
    const { user } = useAuth();

    // Input state
    const [sourceImage, setSourceImage] = useState('');
    const [roomType, setRoomType] = useState<RoomType>('kitchen');
    const [style, setStyle] = useState<RemodelStyle>('modern');
    const [customDescription, setCustomDescription] = useState('');
    const [keepLayout, setKeepLayout] = useState(true);
    const [lighting, setLighting] = useState<'bright_natural' | 'warm_ambient' | 'dramatic' | 'soft_modern'>('bright_natural');

    // Output settings
    const [aspectRatio, setAspectRatio] = useState<string>('auto');
    const [resolution, setResolution] = useState<'1K' | '2K' | '4K'>('2K');

    // Generation state
    const [status, setStatus] = useState<GenerationStatus>('idle');
    const [taskId, setTaskId] = useState<string | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [pollingStatus, setPollingStatus] = useState('');

    // History
    const [recentVisualizations, setRecentVisualizations] = useState<Array<{
        id: string;
        source_url: string;
        result_url: string;
        prompt: string;
        created_at: string;
    }>>([]);

    // Load recent visualizations
    useEffect(() => {
        if (user) {
            loadRecentVisualizations();
        }
    }, [user]);

    const loadRecentVisualizations = async () => {
        if (!user) return;

        try {
            const { data } = await supabase
                .from('visualization_tasks')
                .select('id, source_url, result_url, prompt, created_at')
                .eq('user_id', user.id)
                .eq('status', 'success')
                .order('created_at', { ascending: false })
                .limit(6);

            if (data) {
                setRecentVisualizations(data);
            }
        } catch (err) {
            console.error('Error loading visualizations:', err);
        }
    };

    // Build prompt preview
    const getPromptPreview = (): string => {
        return buildVisualizationPrompt({
            roomType,
            style,
            customDescription: customDescription || undefined,
            keepLayout,
            lighting,
        });
    };

    // Validate inputs
    const canGenerate = (): boolean => {
        return !!sourceImage && !!roomType && !!style;
    };

    // Generate visualization
    const handleGenerate = async () => {
        if (!canGenerate() || !user) return;

        setStatus('generating');
        setError(null);
        setResultUrl(null);
        setPollingStatus('Starting visualization...');

        try {
            const prompt = getPromptPreview();

            // Create the task
            setPollingStatus('Creating visualization task...');
            const createResponse = await createVisualizationTask({
                prompt,
                image_input: [sourceImage],
                aspect_ratio: aspectRatio as any,
                resolution,
                output_format: 'png',
            });

            if (createResponse.code !== 200) {
                throw new Error(createResponse.msg || 'Failed to create task');
            }

            const newTaskId = createResponse.data.taskId;
            setTaskId(newTaskId);
            setPollingStatus('Generating your design visualization...');

            // Save task to database
            await supabase.from('visualization_tasks').insert({
                user_id: user.id,
                kie_task_id: newTaskId,
                status: 'waiting',
                source_url: sourceImage,
                prompt,
                room_type: roomType,
                style,
                aspect_ratio: aspectRatio,
                resolution,
            });

            // Poll for completion
            const result = await waitForVisualizationCompletion(
                newTaskId,
                (statusResponse: TaskStatusResponse) => {
                    if (statusResponse.data.state === 'waiting') {
                        setPollingStatus('AI is creating your design... This usually takes 30-60 seconds.');
                    }
                },
                3000,
                60
            );

            if (result.data.state === 'success') {
                const urls = extractVisualizationResultUrls(result);
                if (urls.length > 0) {
                    setResultUrl(urls[0]);
                    setStatus('success');

                    // Update database
                    await supabase
                        .from('visualization_tasks')
                        .update({
                            status: 'success',
                            result_url: urls[0],
                            completed_at: new Date().toISOString(),
                        })
                        .eq('kie_task_id', newTaskId);

                    // Refresh recent visualizations
                    loadRecentVisualizations();
                } else {
                    throw new Error('No image URL in response');
                }
            } else {
                throw new Error(result.data.failMsg || 'Visualization generation failed');
            }
        } catch (err) {
            console.error('Generation error:', err);
            setError(err instanceof Error ? err.message : 'An error occurred');
            setStatus('failed');

            // Update database if we have a task ID
            if (taskId) {
                await supabase
                    .from('visualization_tasks')
                    .update({
                        status: 'fail',
                        error_message: err instanceof Error ? err.message : 'Unknown error',
                    })
                    .eq('kie_task_id', taskId);
            }
        }
    };

    const resetGenerator = () => {
        setStatus('idle');
        setResultUrl(null);
        setError(null);
        setTaskId(null);
        setPollingStatus('');
    };

    return (
        <div className="max-w-[1400px] mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight flex items-center gap-3">
                    <Palette className="text-violet-600" />
                    Project <span className="text-violet-600">Visualizer</span>
                </h1>
                <p className="text-stone-500 mt-2 text-lg">
                    Transform raw job site photos into stunning finished design visualizations
                </p>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Left Column - Inputs */}
                <div className="col-span-12 lg:col-span-7 space-y-6">

                    {/* Source Image */}
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-soft border border-stone-100">
                        <h2 className="text-xl font-bold text-stone-900 mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 bg-violet-100 text-violet-600 rounded-lg flex items-center justify-center text-sm font-extrabold">1</span>
                            Job Site Photo
                        </h2>

                        <ImageUploader
                            label="Upload Raw Photo"
                            value={sourceImage}
                            onChange={setSourceImage}
                            placeholder="Drop your job site or before photo here"
                            folder="visualizer-sources"
                        />

                        <p className="mt-3 text-sm text-stone-400">
                            Works best with clear photos showing the space you want to visualize
                        </p>
                    </div>

                    {/* Room & Style Selection */}
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-soft border border-stone-100">
                        <h2 className="text-xl font-bold text-stone-900 mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 bg-violet-100 text-violet-600 rounded-lg flex items-center justify-center text-sm font-extrabold">2</span>
                            Design Settings
                        </h2>

                        {/* Room Type */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-stone-700 uppercase tracking-wide mb-3">
                                Room Type
                            </label>
                            <div className="grid grid-cols-4 gap-2">
                                {ROOM_TYPES.map((room) => (
                                    <button
                                        key={room.value}
                                        onClick={() => setRoomType(room.value)}
                                        className={`
                      p-3 rounded-xl border-2 text-center transition-all
                      ${roomType === room.value
                                                ? 'border-violet-500 bg-violet-50 text-violet-700'
                                                : 'border-stone-200 hover:border-stone-300 text-stone-600'
                                            }
                    `}
                                    >
                                        <span className="text-xl block mb-1">{room.icon}</span>
                                        <span className="text-xs font-medium">{room.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Design Style */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-stone-700 uppercase tracking-wide mb-3">
                                Design Style
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {DESIGN_STYLES.map((s) => (
                                    <button
                                        key={s.value}
                                        onClick={() => setStyle(s.value)}
                                        className={`
                      p-3 rounded-xl border-2 text-left transition-all
                      ${style === s.value
                                                ? 'border-violet-500 bg-violet-50'
                                                : 'border-stone-200 hover:border-stone-300'
                                            }
                    `}
                                    >
                                        <span className={`font-bold text-sm ${style === s.value ? 'text-violet-700' : 'text-stone-900'}`}>
                                            {s.label}
                                        </span>
                                        <span className="text-xs text-stone-400 block">{s.description}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Lighting */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-stone-700 uppercase tracking-wide mb-3">
                                <Sun size={14} className="inline mr-1" />
                                Lighting Mood
                            </label>
                            <div className="flex gap-2 flex-wrap">
                                {[
                                    { value: 'bright_natural', label: 'Bright & Natural' },
                                    { value: 'warm_ambient', label: 'Warm & Cozy' },
                                    { value: 'dramatic', label: 'Dramatic' },
                                    { value: 'soft_modern', label: 'Soft Modern' },
                                ].map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => setLighting(opt.value as any)}
                                        className={`
                      px-4 py-2 rounded-full text-sm font-medium transition-all
                      ${lighting === opt.value
                                                ? 'bg-violet-600 text-white'
                                                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                            }
                    `}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Keep Layout Toggle */}
                        <label className="flex items-center gap-3 cursor-pointer mb-6">
                            <input
                                type="checkbox"
                                checked={keepLayout}
                                onChange={(e) => setKeepLayout(e.target.checked)}
                                className="w-5 h-5 rounded border-stone-300 text-violet-600 focus:ring-violet-500"
                            />
                            <div>
                                <span className="font-medium text-stone-700">Preserve Room Layout</span>
                                <span className="text-sm text-stone-400 block">Keep the same dimensions and architecture</span>
                            </div>
                        </label>

                        {/* Custom Description */}
                        <div>
                            <label className="block text-sm font-bold text-stone-700 uppercase tracking-wide mb-2">
                                <Wand2 size={14} className="inline mr-1" />
                                Custom Details (Optional)
                            </label>
                            <textarea
                                value={customDescription}
                                onChange={(e) => setCustomDescription(e.target.value)}
                                rows={3}
                                placeholder="Add specific requests like: 'white marble countertops', 'navy blue cabinets', 'gold hardware accents'..."
                                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                            />
                        </div>
                    </div>

                    {/* Output Settings */}
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-soft border border-stone-100">
                        <h2 className="text-xl font-bold text-stone-900 mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 bg-violet-100 text-violet-600 rounded-lg flex items-center justify-center text-sm font-extrabold">3</span>
                            Output Settings
                        </h2>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Aspect Ratio */}
                            <div>
                                <label className="block text-sm font-medium text-stone-600 mb-2">Aspect Ratio</label>
                                <div className="relative">
                                    <select
                                        value={aspectRatio}
                                        onChange={(e) => setAspectRatio(e.target.value)}
                                        className="w-full appearance-none px-4 py-3 pr-10 rounded-xl border border-stone-200 font-medium focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white cursor-pointer"
                                    >
                                        {ASPECT_RATIOS.map((ar) => (
                                            <option key={ar.value} value={ar.value}>{ar.label}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Resolution */}
                            <div>
                                <label className="block text-sm font-medium text-stone-600 mb-2">Resolution</label>
                                <div className="flex gap-2">
                                    {RESOLUTIONS.map((res) => (
                                        <button
                                            key={res.value}
                                            onClick={() => setResolution(res.value as any)}
                                            className={`
                        flex-1 py-3 px-3 rounded-xl font-medium text-sm transition-all
                        ${resolution === res.value
                                                    ? 'bg-violet-600 text-white'
                                                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                                }
                      `}
                                        >
                                            {res.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Preview & Generate */}
                <div className="col-span-12 lg:col-span-5 space-y-6">

                    {/* Prompt Preview */}
                    <div className="bg-violet-900 rounded-[2.5rem] p-8 shadow-xl text-white">
                        <div className="flex items-center gap-2 text-violet-300 mb-4">
                            <Sparkles size={18} className="fill-violet-300" />
                            <span className="text-xs font-bold uppercase tracking-wider">AI Prompt Preview</span>
                        </div>

                        <p className="text-violet-100 text-sm leading-relaxed max-h-32 overflow-y-auto scrollbar-hide">
                            {getPromptPreview()}
                        </p>
                    </div>

                    {/* Generate Button / Status */}
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-soft border border-stone-100">
                        {status === 'idle' && (
                            <button
                                onClick={handleGenerate}
                                disabled={!canGenerate()}
                                className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${canGenerate()
                                        ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/30 hover:-translate-y-0.5'
                                        : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                                    }`}
                            >
                                <Wand2 size={24} />
                                Generate Visualization
                            </button>
                        )}

                        {status === 'generating' && (
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 mx-auto rounded-full bg-violet-100 flex items-center justify-center">
                                    <RefreshCw size={28} className="text-violet-600 animate-spin" />
                                </div>
                                <div>
                                    <p className="font-bold text-stone-900">{pollingStatus}</p>
                                    <p className="text-sm text-stone-500 mt-1">Creating your design visualization</p>
                                </div>
                            </div>
                        )}

                        {status === 'success' && resultUrl && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-center gap-2 text-violet-600">
                                    <CheckCircle2 size={24} />
                                    <span className="font-bold">Visualization Ready!</span>
                                </div>

                                <div className="relative group rounded-2xl overflow-hidden shadow-lg">
                                    <img
                                        src={resultUrl}
                                        alt="Generated visualization"
                                        className="w-full"
                                    />
                                    <button
                                        onClick={() => window.open(resultUrl, '_blank')}
                                        className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <ZoomIn size={18} />
                                    </button>
                                </div>

                                <div className="flex gap-3">
                                    <a
                                        href={resultUrl}
                                        download
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 py-3 bg-stone-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-stone-800 transition-colors"
                                    >
                                        <Download size={18} />
                                        Download
                                    </a>
                                    <button
                                        onClick={resetGenerator}
                                        className="py-3 px-6 bg-stone-100 text-stone-700 rounded-xl font-bold hover:bg-stone-200 transition-colors"
                                    >
                                        New
                                    </button>
                                </div>
                            </div>
                        )}

                        {status === 'failed' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-center gap-2 text-rose-600">
                                    <XCircle size={24} />
                                    <span className="font-bold">Generation Failed</span>
                                </div>
                                <p className="text-center text-sm text-stone-500">{error}</p>
                                <button
                                    onClick={resetGenerator}
                                    className="w-full py-3 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800 transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Comparison View (when successful) */}
                    {status === 'success' && resultUrl && sourceImage && (
                        <div className="bg-white rounded-[2.5rem] p-6 shadow-soft border border-stone-100">
                            <h3 className="font-bold text-stone-900 mb-4 flex items-center gap-2">
                                <Layers size={18} />
                                Before / After Comparison
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <p className="text-xs text-stone-400 uppercase font-bold mb-2">Before</p>
                                    <img src={sourceImage} alt="Before" className="w-full rounded-xl" />
                                </div>
                                <div>
                                    <p className="text-xs text-stone-400 uppercase font-bold mb-2">After</p>
                                    <img src={resultUrl} alt="After" className="w-full rounded-xl" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tips */}
                    <div className="bg-violet-50 rounded-[2rem] p-6 border border-violet-200">
                        <h3 className="font-bold text-violet-800 mb-2">💡 Tips for Best Results</h3>
                        <ul className="text-sm text-violet-700 space-y-1">
                            <li>• Use well-lit, clear photos of the space</li>
                            <li>• Include walls, floors, and ceiling for context</li>
                            <li>• Add specific details like "white oak floors"</li>
                            <li>• Higher resolution = more detail (slower)</li>
                        </ul>
                    </div>

                    {/* Recent Visualizations */}
                    {recentVisualizations.length > 0 && (
                        <div className="bg-white rounded-[2rem] p-6 shadow-soft border border-stone-100">
                            <h3 className="font-bold text-stone-900 mb-4">Recent Visualizations</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {recentVisualizations.map((viz) => (
                                    <button
                                        key={viz.id}
                                        onClick={() => setResultUrl(viz.result_url)}
                                        className="aspect-square rounded-xl overflow-hidden border-2 border-stone-200 hover:border-violet-400 transition-all"
                                    >
                                        <img src={viz.result_url} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
