import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Download, RotateCcw, Play } from 'lucide-react';

const PhotoboothSystem = () => {
  const [currentStep, setCurrentStep] = useState('camera'); // camera, preview, result
  const [photos, setPhotos] = useState([]);
  const [countdown, setCountdown] = useState(0);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [stream, setStream] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const finalCanvasRef = useRef(null);

  // Akses kamera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        }
      });
      
      setStream(mediaStream);
      setCameraPermission(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan.');
    }
  };

  // Stop kamera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // Fungsi countdown
  const startCountdown = useCallback(() => {
    setIsCountingDown(true);
    setCountdown(3);
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeout(() => {
            capturePhoto();
            setIsCountingDown(false);
          }, 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // Ambil foto
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      
      context.drawImage(videoRef.current, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg', 0.9);
      
      setPhotos(prev => [...prev, imageData]);
    }
  };

  // Generate final strip photo
  const generateFinalPhoto = () => {
    if (photos.length >= 3 && finalCanvasRef.current) {
      const canvas = finalCanvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Set ukuran canvas untuk strip (3 foto vertikal + border)
      const photoWidth = 300;
      const photoHeight = 200;
      const borderWidth = 20;
      const spacing = 10;
      
      canvas.width = photoWidth + (borderWidth * 2);
      canvas.height = (photoHeight * 3) + (spacing * 2) + (borderWidth * 2);
      
      // Background putih
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add title
      ctx.fillStyle = '#333333';
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('PHOTOBOOTH STRIP', canvas.width / 2, 35);
      
      // Load dan gambar setiap foto
      photos.slice(0, 3).forEach((photo, index) => {
        const img = new Image();
        img.onload = () => {
          const y = borderWidth + 30 + (index * (photoHeight + spacing));
          
          // Border foto
          ctx.fillStyle = '#e5e5e5';
          ctx.fillRect(borderWidth - 2, y - 2, photoWidth + 4, photoHeight + 4);
          
          // Gambar foto
          ctx.drawImage(img, borderWidth, y, photoWidth, photoHeight);
          
          // Add photo number
          ctx.fillStyle = '#666666';
          ctx.font = '12px Arial';
          ctx.fillText(`Photo ${index + 1}`, borderWidth + 10, y + photoHeight - 10);
        };
        img.src = photo;
      });
      
      // Add footer
      ctx.fillStyle = '#666666';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Made with React Photobooth', canvas.width / 2, canvas.height - 10);
    }
  };

  // Download foto
  const downloadPhoto = () => {
    if (finalCanvasRef.current) {
      const link = document.createElement('a');
      link.download = `photobooth-strip-${Date.now()}.png`;
      link.href = finalCanvasRef.current.toDataURL();
      link.click();
    }
  };

  // Reset sistem
  const resetSystem = () => {
    setPhotos([]);
    setCurrentStep('camera');
    setCountdown(0);
    setIsCountingDown(false);
  };

  // Effect untuk generate final photo ketika ada 3 foto
  useEffect(() => {
    if (photos.length === 3) {
      setCurrentStep('result');
      setTimeout(generateFinalPhoto, 500);
    }
  }, [photos]);

  // Cleanup saat unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 text-center">
            <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
              <Camera size={36} />
              React Photobooth
            </h1>
            <p className="mt-2 opacity-90">Ambil 3 foto dan dapatkan strip photobooth yang keren!</p>
          </div>

          {/* Main Content */}
          <div className="p-6">
            {currentStep === 'camera' && (
              <div className="text-center space-y-6">
                {!cameraPermission ? (
                  <div className="space-y-4">
                    <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                      <Camera size={48} className="text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Akses Kamera</h2>
                    <p className="text-gray-600">Klik tombol di bawah untuk mengizinkan akses kamera</p>
                    <button
                      onClick={startCamera}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <Play className="inline-block mr-2" size={20} />
                      Mulai Kamera
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Live Preview */}
                    <div className="relative mx-auto max-w-lg">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full rounded-2xl shadow-lg border-4 border-white"
                      />
                      
                      {/* Countdown Overlay */}
                      {isCountingDown && countdown > 0 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-2xl">
                          <div className="text-6xl font-bold text-white animate-pulse">
                            {countdown}
                          </div>
                        </div>
                      )}
                      
                      {/* Flash Effect */}
                      {isCountingDown && countdown === 0 && (
                        <div className="absolute inset-0 bg-white rounded-2xl animate-ping"></div>
                      )}
                    </div>

                    {/* Status */}
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-700">
                        Foto ke-{photos.length + 1} dari 3
                      </p>
                      <div className="flex justify-center gap-2 mt-2">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                              i <= photos.length 
                                ? 'bg-green-500' 
                                : i === photos.length + 1 
                                ? 'bg-yellow-500 animate-pulse' 
                                : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Tombol Ambil Foto */}
                    <button
                      onClick={startCountdown}
                      disabled={isCountingDown}
                      className={`bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
                        isCountingDown ? 'opacity-50 cursor-not-allowed' : 'hover:from-green-600 hover:to-blue-600'
                      }`}
                    >
                      <Camera className="inline-block mr-2" size={24} />
                      {isCountingDown ? 'Bersiap...' : 'Ambil Foto'}
                    </button>

                    {/* Foto yang sudah diambil */}
                    {photos.length > 0 && (
                      <div className="mt-8">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Foto yang telah diambil:</h3>
                        <div className="flex flex-wrap justify-center gap-4">
                          {photos.map((photo, index) => (
                            <div key={index} className="relative">
                              <img
                                src={photo}
                                alt={`Foto ${index + 1}`}
                                className="w-24 h-18 object-cover rounded-lg shadow-md border-2 border-white"
                              />
                              <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                                {index + 1}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {currentStep === 'result' && (
              <div className="text-center space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Strip Photobooth Anda Siap!</h2>
                
                {/* Final Result */}
                <div className="flex justify-center">
                  <canvas
                    ref={finalCanvasRef}
                    className="border-4 border-gray-300 rounded-2xl shadow-2xl max-w-full h-auto"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    onClick={downloadPhoto}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <Download className="inline-block mr-2" size={20} />
                    Download
                  </button>
                  
                  <button
                    onClick={resetSystem}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <RotateCcw className="inline-block mr-2" size={20} />
                    Ambil Lagi
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hidden Canvas untuk capture */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default PhotoboothSystem;
