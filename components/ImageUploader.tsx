
import React, { useCallback, useState } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload]);

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-center text-gray-700">Analiza Tu Comida</h2>
      <p className="text-center text-gray-500 mt-2 mb-6">Sube una foto para empezar.</p>
      
      <label
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className={`flex justify-center w-full h-48 px-4 transition bg-white border-2 ${isDragging ? 'border-teal-500' : 'border-gray-300'} border-dashed rounded-md appearance-none cursor-pointer hover:border-teal-400 focus:outline-none`}
      >
        <span className="flex flex-col items-center justify-center space-y-2 text-gray-600">
          <UploadIcon className="w-10 h-10 text-gray-400"/>
          <span className="font-medium">
            <span className="text-teal-600">Haz clic para subir</span> o arrastra y suelta
          </span>
          <span className="text-xs text-gray-500">PNG, JPG o WEBP</span>
        </span>
        <input type="file" name="file_upload" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
      </label>
    </div>
  );
};

export default ImageUploader;