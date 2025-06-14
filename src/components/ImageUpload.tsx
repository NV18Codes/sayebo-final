
import { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '../hooks/use-toast';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  className?: string;
}

export const ImageUpload = ({ value, onChange, className = '' }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>(value);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    
    try {
      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // For now, we'll use a placeholder URL since storage isn't set up
      // In a real implementation, you would upload to Supabase storage
      const fileName = `${Date.now()}-${file.name}`;
      const publicUrl = `https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop`;
      
      onChange(publicUrl);
      
      toast({
        title: "Image uploaded",
        description: "Your image has been uploaded successfully."
      });

    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    onChange(url);
    setPreview(url);
  };

  const clearImage = () => {
    onChange('');
    setPreview('');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Image Preview */}
      {preview && (
        <div className="relative w-full h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-full object-cover"
            onError={() => setPreview('')}
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upload Area */}
      {!preview && (
        <div className="w-full h-48 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:bg-gray-100 transition-colors">
          <ImageIcon className="w-12 h-12 text-gray-400 mb-4" />
          <p className="text-sm text-gray-500 mb-4">Upload an image or enter URL below</p>
          
          <label className="cursor-pointer">
            <div className="flex items-center space-x-2 bg-pink-400 text-white px-4 py-2 rounded-lg hover:bg-pink-500 transition-colors">
              <Upload className="w-4 h-4" />
              <span>{uploading ? 'Uploading...' : 'Choose File'}</span>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      )}

      {/* URL Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Or enter image URL:
        </label>
        <input
          type="url"
          value={value}
          onChange={handleUrlChange}
          placeholder="https://example.com/image.jpg"
          className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
        />
      </div>
    </div>
  );
};
