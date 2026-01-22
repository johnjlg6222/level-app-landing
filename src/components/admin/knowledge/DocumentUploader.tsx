'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Upload, FileText, Loader2, X, AlertCircle } from 'lucide-react';
import { SUPPORTED_EXTENSIONS, formatFileSize, validateFile } from '@/lib/file-utils';
import type { KnowledgeSection, KnowledgeDocument } from '@/types/knowledge';

interface DocumentUploaderProps {
  section: KnowledgeSection;
  onUploadComplete: (document: KnowledgeDocument) => void;
  onReviewNeeded: (document: KnowledgeDocument) => void;
}

export function DocumentUploader({
  section,
  onUploadComplete,
  onReviewNeeded,
}: DocumentUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{
    filename: string;
    status: 'uploading' | 'parsing' | 'complete' | 'error';
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(async (file: File) => {
    setError(null);
    setUploadProgress({ filename: file.name, status: 'uploading' });

    // Validate file
    const validation = validateFile({
      size: file.size,
      type: file.type,
      name: file.name,
    });

    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      setUploadProgress(null);
      return;
    }

    setIsUploading(true);

    try {
      setUploadProgress({ filename: file.name, status: 'parsing' });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('section', section);

      const response = await fetch('/api/admin/knowledge/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      setUploadProgress({ filename: file.name, status: 'complete' });

      // Determine if review is needed (PDF/Word documents)
      const needsReview = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        .includes(file.type);

      if (needsReview) {
        onReviewNeeded(result.data);
      } else {
        // Auto-approve simple text files
        await fetch('/api/admin/knowledge/documents', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: result.data.id,
            status: 'active',
          }),
        });
        onUploadComplete({ ...result.data, status: 'active' });
      }

      // Clear progress after a delay
      setTimeout(() => setUploadProgress(null), 2000);
    } catch (err) {
      setUploadProgress({ filename: file.name, status: 'error' });
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  }, [section, onUploadComplete, onReviewNeeded]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleUpload(file);
    }
  }, [handleUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [handleUpload]);

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-xl p-6 text-center
          transition-all cursor-pointer
          ${isDragging
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-white/10 hover:border-white/20 hover:bg-white/5'
          }
          ${isUploading ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={SUPPORTED_EXTENSIONS.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 size={32} className="text-blue-400 animate-spin" />
            <p className="text-sm text-gray-400">
              {uploadProgress?.status === 'uploading' && 'Envoi en cours...'}
              {uploadProgress?.status === 'parsing' && 'Extraction du texte...'}
            </p>
          </div>
        ) : (
          <>
            <Upload size={32} className="mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-300 mb-1">
              Glissez-deposez un fichier ou cliquez pour parcourir
            </p>
            <p className="text-xs text-gray-500">
              Formats acceptes: {SUPPORTED_EXTENSIONS.join(', ')} (max 10MB)
            </p>
          </>
        )}
      </div>

      {/* Upload progress indicator */}
      {uploadProgress && uploadProgress.status === 'complete' && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
          <FileText size={16} className="text-green-400" />
          <span className="text-sm text-green-400 flex-1 truncate">
            {uploadProgress.filename}
          </span>
          <span className="text-xs text-green-400">Termine!</span>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
          <span className="text-sm text-red-400 flex-1">{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-300"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

export default DocumentUploader;
