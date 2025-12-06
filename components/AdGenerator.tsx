import React, { useState, useEffect } from 'react';
import {
    Play,
    Sparkles,
    Download,
    RefreshCw,
    BookOpen,
    User,
    Type,
    Building2,
    Clock,
    CheckCircle2,
    XCircle,
    ChevronDown
} from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import { HookSelector } from './HookSelector';
import {
    HookType,
    ROOM_TYPES,
    buildRemodelerPrompt,
    createVideoTask,
    getTaskStatus,
    waitForCompletion,
    extractResultUrls,
    TaskStatusResponse
} from '../lib/soraApi';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type FaceMode = 'upload' | 'describe';
type GenerationStatus = 'idle' | 'generating' | 'success' | 'failed';

export const AdGenerator: React.FC = () => {
    const { user, profile } = useAuth();

    // Image state
    const [beforeImage, setBeforeImage] = useState('');
    const [afterImage, setAfterImage] = useState('');
    const [logoUrl, setLogoUrl] = useState('');

    // Face state
    const [faceMode, setFaceMode] = useState<FaceMode>('describe');
    const [faceUrl, setFaceUrl] = useState('');
    const [faceDescription, setFaceDescription] = useState('');

    // Prompt building state
    const [hookType, setHookType] = useState<HookType | null>(null);
    const [roomType, setRoomType] = useState('Kitchen');
    const [beforeDescription, setBeforeDescription] = useState('');
    const [afterDescription, setAfterDescription] = useState('');
    const [customPrompt, setCustomPrompt] = useState('');
    const [useCustomPrompt, setUseCustomPrompt] = useState(false);

    // Video settings
    const [aspectRatio, setAspectRatio] = useState<'landscape' | 'portrait'>('landscape');
    const [duration, setDuration] = useState<'10' | '15'>('10');
    const [quality, setQuality] = useState<'standard' | 'high'>('standard');

    // Generation state
    const [status, setStatus] = useState<GenerationStatus>('idle');
    const [taskId, setTaskId] = useState<string | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [pollingStatus, setPollingStatus] = useState<string>('');

    // User's saved logos
    const [savedLogos, setSavedLogos] = useState<Array<{ id: string; url: string; name: string }>>([]);

    // Load saved logos
    useEffect(() => {
        if (user) {
            loadSavedLogos();
        }
    }, [user]);

    const loadSavedLogos = async () => {
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from('user_assets')
                .select('id, url, name')
                .eq('user_id', user.id)
                .eq('type', 'logo');

            if (!error && data) {
                setSavedLogos(data);
            }
        } catch (err) {
            console.error('Error loading logos:', err);
        }
    };

    // Build the full prompt
    const getFullPrompt = (): string => {
        if (useCustomPrompt && customPrompt) {
            return customPrompt;
        }

        if (!hookType) {
            return 'Select a hook type to generate a prompt';
        }

        return buildRemodelerPrompt({
            hookType,
            roomType,
            beforeDescription: beforeDescription || undefined,
            afterDescription: afterDescription || undefined,
            faceDescription: faceMode === 'describe' ? faceDescription : undefined,
            companyName: profile?.company || undefined,
        });
    };

    // Validate inputs
    const canGenerate = (): boolean => {
        if (!beforeImage || !afterImage) return false;
        if (!useCustomPrompt && !hookType) return false;
        if (useCustomPrompt && !customPrompt) return false;
        return true;
    };

    // Generate video
    const handleGenerate = async () => {
        if (!canGenerate() || !user) return;

        setStatus('generating');
        setError(null);
        setResultUrl(null);
        setPollingStatus('Starting generation...');

        try {
            // Build image URLs (combine before and after, API uses first frame)
            // For remodeler ads, we'll use the after image as the starting frame
            const imageUrls = [afterImage];

            const prompt = getFullPrompt();

            // Create the task
            setPollingStatus('Creating video task...');
            const createResponse = await createVideoTask({
                prompt,
                image_urls: imageUrls,
                aspect_ratio: aspectRatio,
                n_frames: duration,
                size: quality,
                remove_watermark: true,
            });

            if (createResponse.code !== 200) {
                throw new Error(createResponse.msg || 'Failed to create task');
            }

            const newTaskId = createResponse.data.taskId;
            setTaskId(newTaskId);
            setPollingStatus('Video is being generated...');

            // Save task to database
            await supabase.from('ad_tasks').insert({
                user_id: user.id,
                kie_task_id: newTaskId,
                status: 'waiting',
                before_image_url: beforeImage,
                after_image_url: afterImage,
                logo_url: logoUrl || null,
                face_url: faceMode === 'upload' ? faceUrl : null,
                face_description: faceMode === 'describe' ? faceDescription : null,
                prompt,
                hook_type: hookType,
                aspect_ratio: aspectRatio,
                duration,
            });

            // Poll for completion
            const result = await waitForCompletion(
                newTaskId,
                (statusResponse: TaskStatusResponse) => {
                    if (statusResponse.data.state === 'waiting') {
                        setPollingStatus('Video is rendering... This may take a few minutes.');
                    }
                },
                5000,
                120
            );

            if (result.data.state === 'success') {
                const urls = extractResultUrls(result);
                if (urls.length > 0) {
                    setResultUrl(urls[0]);
                    setStatus('success');

                    // Update database
                    await supabase
                        .from('ad_tasks')
                        .update({
                            status: 'success',
                            result_url: urls[0],
                            completed_at: new Date().toISOString()
                        })
                        .eq('kie_task_id', newTaskId);
                } else {
                    throw new Error('No video URL in response');
                }
            } else {
                throw new Error(result.data.failMsg || 'Video generation failed');
            }
        } catch (err) {
            console.error('Generation error:', err);
            setError(err instanceof Error ? err.message : 'An error occurred');
            setStatus('failed');

            // Update database if we have a task ID
            if (taskId) {
                await supabase
                    .from('ad_tasks')
                    .update({
                        status: 'fail',
                        error_message: err instanceof Error ? err.message : 'Unknown error'
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight">
                        AI Video <span className="text-emerald-600">Studio</span>
                    </h1>
                    <p className="text-stone-500 mt-2 text-lg">
                        Transform your before/after photos into stunning video ads
                    </p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-full font-bold hover:bg-stone-800 transition-colors">
                    <BookOpen size={18} />
                    <span>Prompt Library</span>
                </button>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Left Column - Inputs */}
                <div className="col-span-12 lg:col-span-7 space-y-6">

                    {/* Before/After Images */}
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-soft border border-stone-100">
                        <h2 className="text-xl font-bold text-stone-900 mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center text-sm font-extrabold">1</span>
                            Project Photos
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ImageUploader
                                label="Before Image"
                                value={beforeImage}
                                onChange={setBeforeImage}
                                placeholder="Drop your BEFORE photo"
                                folder="before-images"
                            />
                            <ImageUploader
                                label="After Image"
                                value={afterImage}
                                onChange={setAfterImage}
                                placeholder="Drop your AFTER photo"
                                folder="after-images"
                            />
                        </div>

                        {/* Optional descriptions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <input
                                type="text"
                                value={beforeDescription}
                                onChange={(e) => setBeforeDescription(e.target.value)}
                                placeholder="Describe the before (optional)"
                                className="px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                            <input
                                type="text"
                                value={afterDescription}
                                onChange={(e) => setAfterDescription(e.target.value)}
                                placeholder="Describe the after (optional)"
                                className="px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Logo & Face */}
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-soft border border-stone-100">
                        <h2 className="text-xl font-bold text-stone-900 mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center text-sm font-extrabold">2</span>
                            Branding & Spokesperson
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Logo */}
                            <div className="space-y-3">
                                <label className="block text-sm font-bold text-stone-700 uppercase tracking-wide">
                                    Your Logo (Optional)
                                </label>

                                {savedLogos.length > 0 && (
                                    <div className="flex gap-2 flex-wrap mb-3">
                                        {savedLogos.map((logo) => (
                                            <button
                                                key={logo.id}
                                                onClick={() => setLogoUrl(logo.url)}
                                                className={`w-14 h-14 rounded-xl border-2 overflow-hidden transition-all ${logoUrl === logo.url
                                                        ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                                                        : 'border-stone-200 hover:border-stone-300'
                                                    }`}
                                            >
                                                <img src={logo.url} alt={logo.name} className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <ImageUploader
                                    label=""
                                    value={logoUrl}
                                    onChange={setLogoUrl}
                                    placeholder="Upload your logo"
                                    folder="logos"
                                />
                            </div>

                            {/* Face */}
                            <div className="space-y-3">
                                <label className="block text-sm font-bold text-stone-700 uppercase tracking-wide">
                                    Spokesperson (Optional)
                                </label>

                                {/* Mode toggle */}
                                <div className="flex gap-2 p-1 bg-stone-100 rounded-xl">
                                    <button
                                        onClick={() => setFaceMode('describe')}
                                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${faceMode === 'describe'
                                                ? 'bg-white text-stone-900 shadow-sm'
                                                : 'text-stone-500 hover:text-stone-700'
                                            }`}
                                    >
                                        <Type size={16} />
                                        Describe
                                    </button>
                                    <button
                                        onClick={() => setFaceMode('upload')}
                                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${faceMode === 'upload'
                                                ? 'bg-white text-stone-900 shadow-sm'
                                                : 'text-stone-500 hover:text-stone-700'
                                            }`}
                                    >
                                        <User size={16} />
                                        Upload Face
                                    </button>
                                </div>

                                {faceMode === 'describe' ? (
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            value={faceDescription}
                                            onChange={(e) => setFaceDescription(e.target.value)}
                                            placeholder="e.g., brunette woman with curly hair, professional contractor in hard hat"
                                            className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        />
                                        <p className="text-xs text-stone-400">
                                            Describe the person to appear in your video ad
                                        </p>
                                    </div>
                                ) : (
                                    <ImageUploader
                                        label=""
                                        value={faceUrl}
                                        onChange={setFaceUrl}
                                        placeholder="Upload a face photo"
                                        folder="faces"
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Hook Type */}
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-soft border border-stone-100">
                        <h2 className="text-xl font-bold text-stone-900 mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center text-sm font-extrabold">3</span>
                            Hook Style
                        </h2>

                        {/* Room type selector */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-stone-700 uppercase tracking-wide mb-2">
                                Room Type
                            </label>
                            <div className="relative">
                                <select
                                    value={roomType}
                                    onChange={(e) => setRoomType(e.target.value)}
                                    className="w-full md:w-64 appearance-none px-4 py-3 pr-10 rounded-xl border border-stone-200 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white cursor-pointer"
                                >
                                    {ROOM_TYPES.map((room) => (
                                        <option key={room} value={room}>{room}</option>
                                    ))}
                                </select>
                                <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                            </div>
                        </div>

                        <HookSelector value={hookType} onChange={setHookType} />

                        {/* Custom prompt toggle */}
                        <div className="mt-6 pt-6 border-t border-stone-100">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={useCustomPrompt}
                                    onChange={(e) => setUseCustomPrompt(e.target.checked)}
                                    className="w-5 h-5 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                                />
                                <span className="font-medium text-stone-700">Use custom prompt instead</span>
                            </label>

                            {useCustomPrompt && (
                                <textarea
                                    value={customPrompt}
                                    onChange={(e) => setCustomPrompt(e.target.value)}
                                    rows={4}
                                    placeholder="Enter your custom video prompt..."
                                    className="w-full mt-4 px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Preview & Generate */}
                <div className="col-span-12 lg:col-span-5 space-y-6">

                    {/* Video Settings */}
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-soft border border-stone-100">
                        <h2 className="text-lg font-bold text-stone-900 mb-4">Video Settings</h2>

                        <div className="space-y-4">
                            {/* Aspect Ratio */}
                            <div>
                                <label className="block text-sm font-medium text-stone-600 mb-2">Aspect Ratio</label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setAspectRatio('landscape')}
                                        className={`flex-1 py-2 px-4 rounded-xl font-medium text-sm transition-all ${aspectRatio === 'landscape'
                                                ? 'bg-stone-900 text-white'
                                                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                            }`}
                                    >
                                        🖥️ Landscape
                                    </button>
                                    <button
                                        onClick={() => setAspectRatio('portrait')}
                                        className={`flex-1 py-2 px-4 rounded-xl font-medium text-sm transition-all ${aspectRatio === 'portrait'
                                                ? 'bg-stone-900 text-white'
                                                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                            }`}
                                    >
                                        📱 Portrait
                                    </button>
                                </div>
                            </div>

                            {/* Duration */}
                            <div>
                                <label className="block text-sm font-medium text-stone-600 mb-2">Duration</label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setDuration('10')}
                                        className={`flex-1 py-2 px-4 rounded-xl font-medium text-sm transition-all ${duration === '10'
                                                ? 'bg-stone-900 text-white'
                                                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                            }`}
                                    >
                                        10 seconds
                                    </button>
                                    <button
                                        onClick={() => setDuration('15')}
                                        className={`flex-1 py-2 px-4 rounded-xl font-medium text-sm transition-all ${duration === '15'
                                                ? 'bg-stone-900 text-white'
                                                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                            }`}
                                    >
                                        15 seconds
                                    </button>
                                </div>
                            </div>

                            {/* Quality */}
                            <div>
                                <label className="block text-sm font-medium text-stone-600 mb-2">Quality</label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setQuality('standard')}
                                        className={`flex-1 py-2 px-4 rounded-xl font-medium text-sm transition-all ${quality === 'standard'
                                                ? 'bg-stone-900 text-white'
                                                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                            }`}
                                    >
                                        Standard
                                    </button>
                                    <button
                                        onClick={() => setQuality('high')}
                                        className={`flex-1 py-2 px-4 rounded-xl font-medium text-sm transition-all ${quality === 'high'
                                                ? 'bg-stone-900 text-white'
                                                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                            }`}
                                    >
                                        High (4x credits)
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Prompt Preview */}
                    <div className="bg-stone-900 rounded-[2.5rem] p-8 shadow-xl text-white">
                        <div className="flex items-center gap-2 text-emerald-400 mb-4">
                            <Sparkles size={18} className="fill-emerald-400" />
                            <span className="text-xs font-bold uppercase tracking-wider">Generated Prompt</span>
                        </div>

                        <p className="text-stone-300 text-sm leading-relaxed min-h-[80px]">
                            {getFullPrompt()}
                        </p>
                    </div>

                    {/* Generate Button / Status */}
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-soft border border-stone-100">
                        {status === 'idle' && (
                            <button
                                onClick={handleGenerate}
                                disabled={!canGenerate()}
                                className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${canGenerate()
                                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5'
                                        : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                                    }`}
                            >
                                <Play size={24} className="fill-current" />
                                Generate Video Ad
                            </button>
                        )}

                        {status === 'generating' && (
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center">
                                    <RefreshCw size={28} className="text-emerald-600 animate-spin" />
                                </div>
                                <div>
                                    <p className="font-bold text-stone-900">{pollingStatus}</p>
                                    <p className="text-sm text-stone-500 mt-1">This usually takes 2-5 minutes</p>
                                </div>
                            </div>
                        )}

                        {status === 'success' && resultUrl && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-center gap-2 text-emerald-600">
                                    <CheckCircle2 size={24} />
                                    <span className="font-bold">Video Ready!</span>
                                </div>

                                <video
                                    src={resultUrl}
                                    controls
                                    className="w-full rounded-2xl shadow-lg"
                                />

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
                                        New Video
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

                    {/* Tips */}
                    <div className="bg-amber-50 rounded-[2rem] p-6 border border-amber-200">
                        <h3 className="font-bold text-amber-800 mb-2">💡 Pro Tips</h3>
                        <ul className="text-sm text-amber-700 space-y-1">
                            <li>• Use high-quality, well-lit before/after photos</li>
                            <li>• "Transformation" hooks perform best for remodelers</li>
                            <li>• Portrait videos work better for Instagram/TikTok</li>
                            <li>• Add a face description to increase engagement</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
