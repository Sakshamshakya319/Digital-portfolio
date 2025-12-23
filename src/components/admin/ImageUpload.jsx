import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';

const ImageUpload = ({ onImageUpload, currentImage, label = "Upload Image" }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || '');
  const fileInputRef = useRef(null);
  const { isDark } = useTheme();

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // For now, we'll use a placeholder upload service
      // In a real app, you'd upload to your server or cloud storage
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate upload

      // Generate a mock URL (in real app, this would come from your upload service)
      const mockUrl = `https://picsum.photos/800/600?random=${Date.now()}`;
      
      onImageUpload(mockUrl);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
      setPreview(currentImage || '');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview('');
    onImageUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const event = { target: { files } };
      handleFileSelect(event);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-3">
      <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'} transition-colors`}>
        {label}
      </label>
      
      {preview ? (
        <div className="relative group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border-2 border-dashed border-transparent"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                disabled={uploading}
              >
                <Upload className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                disabled={uploading}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
              <div className="flex items-center space-x-2 text-white">
                <Loader className="w-5 h-5 animate-spin" />
                <span>Uploading...</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
            isDark 
              ? 'border-slate-600 hover:border-slate-500 bg-slate-800/50 hover:bg-slate-800' 
              : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100'
          } ${uploading ? 'pointer-events-none' : ''}`}
        >
          {uploading ? (
            <div className="flex flex-col items-center space-y-3">
              <Loader className={`w-8 h-8 animate-spin ${isDark ? 'text-slate-400' : 'text-gray-400'}`} />
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                Uploading image...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-3">
              <ImageIcon className={`w-12 h-12 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} />
              <div>
                <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                  Click to upload or drag and drop
                </p>
                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;