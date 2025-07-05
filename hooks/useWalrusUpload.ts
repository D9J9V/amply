'use client';

import { useState, useCallback } from 'react';

interface UploadProgress {
  isUploading: boolean;
  progress: number;
  error: string | null;
}

interface UploadResult {
  success: boolean;
  blobId?: string;
  error?: string;
}

export function useWalrusUpload() {
  const [uploadState, setUploadState] = useState<UploadProgress>({
    isUploading: false,
    progress: 0,
    error: null,
  });

  const uploadFile = useCallback(async (
    file: File,
    options?: {
      isDraft?: boolean;
      worldIdToken?: string;
      onProgress?: (progress: number) => void;
    }
  ): Promise<UploadResult> => {
    setUploadState({
      isUploading: true,
      progress: 0,
      error: null,
    });

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (options?.isDraft) {
        formData.append('draft', 'true');
      }

      // TODO: Replace with actual progress tracking using XMLHttpRequest
      // For now, we'll simulate progress
      const progressInterval = setInterval(() => {
        setUploadState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90),
        }));
      }, 100);

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          // Add World ID token if provided
          ...(options?.worldIdToken && {
            'x-world-id-token': options.worldIdToken,
          }),
        },
        body: formData,
      });

      clearInterval(progressInterval);

      const result: UploadResult = await response.json();

      if (result.success) {
        setUploadState({
          isUploading: false,
          progress: 100,
          error: null,
        });
        return result;
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setUploadState({
        isUploading: false,
        progress: 0,
        error: errorMessage,
      });
      return {
        success: false,
        error: errorMessage,
      };
    }
  }, []);

  const resetUpload = useCallback(() => {
    setUploadState({
      isUploading: false,
      progress: 0,
      error: null,
    });
  }, []);

  return {
    uploadFile,
    resetUpload,
    ...uploadState,
  };
}