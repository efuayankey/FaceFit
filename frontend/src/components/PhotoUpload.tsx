import React, { useState, useRef } from 'react';

interface PhotoUploadProps {
  onImageSelect: (file: File) => void;
  isLoading: boolean;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ onImageSelect, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      onImageSelect(file);
    } else {
      alert('Please select an image file.');
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      setStream(mediaStream);
      setShowCamera(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access camera. Please check permissions.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      ctx?.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
          handleFile(file);
          stopCamera();
        }
      }, 'image/jpeg', 0.8);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-5">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-3">Upload Your Photo</h2>
      <p className="text-center text-gray-600 mb-8">Take a clear front-facing photo or upload an existing image</p>
      
      {showCamera ? (
        <div className="text-center mb-5">
          <video ref={videoRef} autoPlay playsInline className="w-full max-w-md mx-auto rounded-xl mb-4" />
          <canvas ref={canvasRef} className="hidden" />
          <div className="flex gap-4 justify-center">
            <button 
              onClick={capturePhoto} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              📸 Capture
            </button>
            <button 
              onClick={stopCamera} 
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : selectedImage ? (
        <div className="text-center mb-5">
          <img src={selectedImage} alt="Selected" className="w-full max-h-96 object-contain rounded-xl shadow-lg mx-auto mb-4" />
          <button 
            onClick={() => {
              setSelectedImage(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }} 
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            ✕ Remove
          </button>
        </div>
      ) : (
        <div className="relative">
          <div
            className={`
              border-2 border-dashed border-gray-300 rounded-xl p-16 text-center cursor-pointer transition-all
              ${dragActive ? 'border-blue-500 bg-blue-50 scale-105' : 'hover:border-blue-400 hover:bg-gray-50'}
              ${isLoading ? 'pointer-events-none opacity-70' : ''}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={onButtonClick}
          >
            <div className="pointer-events-none">
              <div className="text-5xl mb-4">📷</div>
              <p className="text-gray-600 mb-2">Drag & drop your photo here</p>
              <p className="text-gray-500">or click to browse</p>
            </div>
          </div>
          
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center rounded-xl">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
              <p className="text-gray-700">Analyzing your face shape...</p>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleChange}
      />

      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-5">
        <button 
          onClick={onButtonClick} 
          disabled={isLoading} 
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-all hover:-translate-y-0.5"
        >
          📁 Choose File
        </button>
        <button 
          onClick={startCamera} 
          disabled={isLoading} 
          className="bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-all hover:-translate-y-0.5"
        >
          📸 Use Camera
        </button>
      </div>
    </div>
  );
};

export default PhotoUpload;