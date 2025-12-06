import React, { useState, useEffect } from 'react';
import {
    History,
    Trash2,
    Download,
    Play,
    Clock,
    CheckCircle2,
    XCircle,
    RefreshCw,
    ChevronRight,
    X
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

interface GenerationItem {
    id: string;
    kie_task_id: string;
    status: 'waiting' | 'success' | 'fail';
    before_image_url: string;
    after_image_url: string;
    prompt: string;
    hook_type: string | null;
    aspect_ratio: string;
    duration: string;
    result_url: string | null;
    error_message: string | null;
    created_at: string;
    completed_at: string | null;
}

interface GenerationHistoryProps {
    onSelectGeneration?: (generation: GenerationItem) => void;
}

export const GenerationHistory: React.FC<GenerationHistoryProps> = ({ onSelectGeneration }) => {
    const { user } = useAuth();
    const toast = useToast();
    const [generations, setGenerations] = useState<GenerationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState<GenerationItem | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (user) {
            loadGenerations();
        }
    }, [user]);

    const loadGenerations = async () => {
        if (!user) return;
        setLoading(true);

        try {
            const { data, error } = await supabase
                .from('ad_tasks')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(50);

            if (!error && data) {
                setGenerations(data as GenerationItem[]);
            }
        } catch (err) {
            console.error('Error loading generations:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!user) return;

        try {
            const { error } = await supabase
                .from('ad_tasks')
                .delete()
                .eq('id', id)
                .eq('user_id', user.id);

            if (!error) {
                setGenerations(prev => prev.filter(g => g.id !== id));
                setDeleteConfirm(null);
                toast.success('Deleted', 'Generation removed from history.');
                if (selectedVideo?.id === id) {
                    setSelectedVideo(null);
                }
            } else {
                toast.error('Delete failed', 'Could not delete this generation.');
            }
        } catch (err) {
            console.error('Error deleting generation:', err);
            toast.error('Delete failed', 'An unexpected error occurred.');
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        if (diffHours < 1) {
            const mins = Math.floor(diffMs / (1000 * 60));
            return `${mins} min${mins !== 1 ? 's' : ''} ago`;
        } else if (diffHours < 24) {
            const hours = Math.floor(diffHours);
            return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        } else if (diffDays < 7) {
            const days = Math.floor(diffDays);
            return `${days} day${days !== 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'success':
                return <CheckCircle2 size={16} className="text-emerald-500" />;
            case 'fail':
                return <XCircle size={16} className="text-rose-500" />;
            default:
                return <RefreshCw size={16} className="text-amber-500 animate-spin" />;
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'success':
                return 'Completed';
            case 'fail':
                return 'Failed';
            default:
                return 'Processing';
        }
    };

    const successfulGenerations = generations.filter(g => g.status === 'success');
    const processingGenerations = generations.filter(g => g.status === 'waiting');
    const failedGenerations = generations.filter(g => g.status === 'fail');

    if (!isExpanded) {
        return (
            <button
                onClick={() => setIsExpanded(true)}
                className="fixed bottom-6 right-6 flex items-center gap-2 px-5 py-3 bg-stone-900 text-white rounded-full shadow-xl hover:bg-stone-800 transition-all hover:scale-105 z-50"
            >
                <History size={20} />
                <span className="font-semibold">History</span>
                {successfulGenerations.length > 0 && (
                    <span className="ml-1 px-2 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded-full">
                        {successfulGenerations.length}
                    </span>
                )}
            </button>
        );
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                onClick={() => setIsExpanded(false)}
            />

            {/* Panel */}
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 animate-in slide-in-from-right duration-300 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-stone-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <History size={20} className="text-emerald-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-stone-900">Generation History</h2>
                            <p className="text-sm text-stone-500">{generations.length} total generations</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsExpanded(false)}
                        className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-stone-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <RefreshCw size={24} className="text-emerald-600 animate-spin" />
                        </div>
                    ) : generations.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto bg-stone-100 rounded-2xl flex items-center justify-center mb-4">
                                <History size={28} className="text-stone-400" />
                            </div>
                            <p className="text-stone-500 font-medium">No generations yet</p>
                            <p className="text-sm text-stone-400 mt-1">Your video generations will appear here</p>
                        </div>
                    ) : (
                        <>
                            {/* Processing Section */}
                            {processingGenerations.length > 0 && (
                                <div className="space-y-2">
                                    <h3 className="text-xs font-bold text-amber-600 uppercase tracking-wider px-2">
                                        Processing ({processingGenerations.length})
                                    </h3>
                                    {processingGenerations.map(gen => (
                                        <GenerationCard
                                            key={gen.id}
                                            generation={gen}
                                            formatDate={formatDate}
                                            getStatusIcon={getStatusIcon}
                                            getStatusLabel={getStatusLabel}
                                            onSelect={() => setSelectedVideo(gen)}
                                            onDelete={() => setDeleteConfirm(gen.id)}
                                            deleteConfirm={deleteConfirm}
                                            onConfirmDelete={() => handleDelete(gen.id)}
                                            onCancelDelete={() => setDeleteConfirm(null)}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Completed Section */}
                            {successfulGenerations.length > 0 && (
                                <div className="space-y-2">
                                    <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-wider px-2">
                                        Completed ({successfulGenerations.length})
                                    </h3>
                                    {successfulGenerations.map(gen => (
                                        <GenerationCard
                                            key={gen.id}
                                            generation={gen}
                                            formatDate={formatDate}
                                            getStatusIcon={getStatusIcon}
                                            getStatusLabel={getStatusLabel}
                                            onSelect={() => setSelectedVideo(gen)}
                                            onDelete={() => setDeleteConfirm(gen.id)}
                                            deleteConfirm={deleteConfirm}
                                            onConfirmDelete={() => handleDelete(gen.id)}
                                            onCancelDelete={() => setDeleteConfirm(null)}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Failed Section */}
                            {failedGenerations.length > 0 && (
                                <div className="space-y-2">
                                    <h3 className="text-xs font-bold text-rose-600 uppercase tracking-wider px-2">
                                        Failed ({failedGenerations.length})
                                    </h3>
                                    {failedGenerations.map(gen => (
                                        <GenerationCard
                                            key={gen.id}
                                            generation={gen}
                                            formatDate={formatDate}
                                            getStatusIcon={getStatusIcon}
                                            getStatusLabel={getStatusLabel}
                                            onSelect={() => setSelectedVideo(gen)}
                                            onDelete={() => setDeleteConfirm(gen.id)}
                                            deleteConfirm={deleteConfirm}
                                            onConfirmDelete={() => handleDelete(gen.id)}
                                            onCancelDelete={() => setDeleteConfirm(null)}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Refresh Button */}
                <div className="p-4 border-t border-stone-100">
                    <button
                        onClick={loadGenerations}
                        className="w-full py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                        <RefreshCw size={18} />
                        Refresh History
                    </button>
                </div>
            </div>

            {/* Video Modal */}
            {selectedVideo && selectedVideo.result_url && (
                <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-4 border-b border-stone-100 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-stone-900">
                                    {selectedVideo.hook_type || 'Custom'} Video
                                </h3>
                                <p className="text-sm text-stone-500">
                                    Created {formatDate(selectedVideo.created_at)}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedVideo(null)}
                                className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-4">
                            <video
                                src={selectedVideo.result_url}
                                controls
                                autoPlay
                                className="w-full rounded-2xl"
                            />
                        </div>

                        <div className="p-4 border-t border-stone-100 flex gap-3">
                            <a
                                href={selectedVideo.result_url}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 py-3 bg-stone-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-stone-800 transition-colors"
                            >
                                <Download size={18} />
                                Download Video
                            </a>
                            <button
                                onClick={() => setSelectedVideo(null)}
                                className="py-3 px-6 bg-stone-100 text-stone-700 rounded-xl font-bold hover:bg-stone-200 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

interface GenerationCardProps {
    generation: GenerationItem;
    formatDate: (date: string) => string;
    getStatusIcon: (status: string) => React.ReactNode;
    getStatusLabel: (status: string) => string;
    onSelect: () => void;
    onDelete: () => void;
    deleteConfirm: string | null;
    onConfirmDelete: () => void;
    onCancelDelete: () => void;
}

const GenerationCard: React.FC<GenerationCardProps> = ({
    generation,
    formatDate,
    getStatusIcon,
    getStatusLabel,
    onSelect,
    onDelete,
    deleteConfirm,
    onConfirmDelete,
    onCancelDelete
}) => {
    const isDeleting = deleteConfirm === generation.id;

    return (
        <div
            className={`bg-stone-50 rounded-2xl p-4 hover:bg-stone-100 transition-colors ${generation.status === 'success' ? 'cursor-pointer' : ''
                }`}
            onClick={() => generation.status === 'success' && onSelect()}
        >
            <div className="flex gap-4">
                {/* Thumbnail */}
                <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-stone-200">
                    <img
                        src={generation.after_image_url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                    />
                    {generation.status === 'success' && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <Play size={24} className="text-white fill-white" />
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        {getStatusIcon(generation.status)}
                        <span className="text-sm font-medium text-stone-700">
                            {getStatusLabel(generation.status)}
                        </span>
                    </div>

                    <p className="text-xs text-stone-500 truncate mb-2">
                        {generation.hook_type || 'Custom prompt'} • {generation.aspect_ratio} • {generation.duration}s
                    </p>

                    <div className="flex items-center gap-2 text-xs text-stone-400">
                        <Clock size={12} />
                        <span>{formatDate(generation.created_at)}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2" onClick={e => e.stopPropagation()}>
                    {generation.status === 'success' && generation.result_url && (
                        <a
                            href={generation.result_url}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-stone-200 hover:bg-stone-300 rounded-lg transition-colors"
                            title="Download"
                        >
                            <Download size={16} className="text-stone-600" />
                        </a>
                    )}

                    {isDeleting ? (
                        <div className="flex flex-col gap-1">
                            <button
                                onClick={onConfirmDelete}
                                className="p-2 bg-rose-500 hover:bg-rose-600 rounded-lg transition-colors"
                                title="Confirm delete"
                            >
                                <Trash2 size={14} className="text-white" />
                            </button>
                            <button
                                onClick={onCancelDelete}
                                className="p-2 bg-stone-200 hover:bg-stone-300 rounded-lg transition-colors"
                                title="Cancel"
                            >
                                <X size={14} className="text-stone-600" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={onDelete}
                            className="p-2 bg-stone-200 hover:bg-rose-100 rounded-lg transition-colors group"
                            title="Delete"
                        >
                            <Trash2 size={16} className="text-stone-400 group-hover:text-rose-500" />
                        </button>
                    )}
                </div>
            </div>

            {/* Error message for failed generations */}
            {generation.status === 'fail' && generation.error_message && (
                <p className="mt-3 text-xs text-rose-500 bg-rose-50 p-2 rounded-lg">
                    {generation.error_message}
                </p>
            )}
        </div>
    );
};
