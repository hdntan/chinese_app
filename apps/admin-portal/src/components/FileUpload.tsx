import { useState, useRef } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Upload, X, FileAudio } from 'lucide-react';

interface FileUploadProps {
  label: string;
  accept: string;
  value?: string;
  onChange: (url: string) => void;
  type?: 'image' | 'audio';
}

export function FileUpload({ label, accept, value, onChange, type = 'image' }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    try {
      const response = await api.post('/uploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onChange(response.data.url);
      toast.success('File uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
      // Reset input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const clearFile = () => {
    onChange('');
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      
      {!value ? (
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
          ) : (
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
          )}
          <span className="text-sm text-gray-500">
            {isUploading ? 'Uploading...' : 'Click to upload'}
          </span>
          <span className="text-xs text-gray-400 mt-1">Max 5MB</span>
        </div>
      ) : (
        <div className="relative border rounded-lg p-2 flex items-center gap-3 bg-gray-50">
          {type === 'image' ? (
            <img 
              src={value} 
              alt="Preview" 
              className="h-16 w-16 object-cover rounded bg-white border" 
            />
          ) : (
            <div className="h-16 w-16 flex items-center justify-center bg-blue-100 rounded text-blue-600">
              <FileAudio className="h-8 w-8" />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{value.split('/').pop()}</p>
            <a 
              href={value} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:underline"
            >
              View file
            </a>
          </div>

          <button
            type="button"
            onClick={clearFile}
            className="p-1 hover:bg-gray-200 rounded-full text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
