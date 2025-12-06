import React, { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ImageUploaderProps {
    label: string;
    value?: string;
    onChange: (url: string) => void;
    placeholder?: string;
    bucket?: string;
    folder?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
    label,
    value,
    onChange,
    placeholder = 'Drag & drop an image or click to browse',
    bucket = 'user-assets',
    folder = 'uploads',
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFile = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setError('Image must be under 10MB');
            return;
        }

        setError(null);
        setIsUploading(true);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(fileName, file, { cacheControl: '3600', upsert: false });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(fileName);

            onChange(publicUrl);
        } catch (err) {
            console.error('Upload error:', err);
            setError('Failed to upload image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    const handleRemove = () => {
        onChange('');
        setError(null);
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-bold text-stone-700 uppercase tracking-wide">
                {label}
            </label>

            {value ? (
                <div className="relative group rounded-2xl overflow-hidden border-2 border-stone-200 bg-stone-50">
                    <img
                        src={value}
                        alt={label}
                        className="w-full h-48 object-cover"
                    />
                    <button
                        onClick={handleRemove}
                        className="absolute top-3 right-3 p-2 bg-stone-900/80 hover:bg-rose-600 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                    >
                        <X size={18} />
                    </button>
                </div>
            ) : (
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`
            relative h-48 rounded-2xl border-2 border-dashed transition-all cursor-pointer
            flex flex-col items-center justify-center gap-3
            ${isDragging
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-stone-300 hover:border-stone-400 bg-stone-50 hover:bg-stone-100'
                        }
            ${isUploading ? 'pointer-events-none opacity-60' : ''}
          `}
                >
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleInputChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={isUploading}
                    />

                    {isUploading ? (
                        <>
                            <div className="w-10 h-10 rounded-full border-3 border-emerald-500 border-t-transparent animate-spin" />
                            <span className="text-sm font-medium text-stone-500">Uploading...</span>
                        </>
                    ) : (
                        <>
                            <div className={`
                p-3 rounded-2xl transition-colors
                ${isDragging ? 'bg-emerald-100 text-emerald-600' : 'bg-stone-200 text-stone-500'}
              `}>
                                {isDragging ? <ImageIcon size={24} /> : <Upload size={24} />}
                            </div>
                            <span className="text-sm text-stone-500 text-center px-4">
                                {placeholder}
                            </span>
                        </>
                    )}
                </div>
            )}

            {error && (
                <p className="text-sm text-rose-600 font-medium">{error}</p>
            )}
        </div>
    );
};
