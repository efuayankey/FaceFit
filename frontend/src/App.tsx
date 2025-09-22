import React, { useState } from 'react';
import PhotoUpload from './components/PhotoUpload';
import Results from './components/Results';
import { analyzeImage } from './services/api';
import { AnalysisState } from './types';

function App() {
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    isLoading: false,
    result: null,
    error: null,
  });

  const handleImageSelect = async (file: File) => {
    setAnalysisState({ isLoading: true, result: null, error: null });

    try {
      const result = await analyzeImage(file);
      setAnalysisState({ isLoading: false, result, error: null });
    } catch (error) {
      console.error('Analysis failed:', error);
      setAnalysisState({
        isLoading: false,
        result: null,
        error: error instanceof Error ? error.message : 'Analysis failed. Please try again.',
      });
    }
  };

  const handleStartOver = () => {
    setAnalysisState({ isLoading: false, result: null, error: null });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-5 py-5 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 flex items-center justify-center gap-4">
            <span className="text-4xl md:text-5xl">👓</span>
            FaceFit
          </h1>
          <p className="text-xl opacity-90 font-light">AI-Powered Face Shape & Glasses Recommender</p>
        </div>
      </header>

      <main className="flex-1 py-10 px-5 max-w-6xl mx-auto w-full">
        {analysisState.error && (
          <div className="bg-red-100 border border-red-300 rounded-xl p-5 mb-8 max-w-2xl mx-auto">
            <div className="flex items-start gap-4">
              <span className="text-2xl mt-1">⚠️</span>
              <div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">Analysis Failed</h3>
                <p className="text-red-700 mb-4 leading-relaxed">{analysisState.error}</p>
                <button 
                  onClick={handleStartOver} 
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {analysisState.result ? (
          <Results result={analysisState.result} onStartOver={handleStartOver} />
        ) : (
          <PhotoUpload 
            onImageSelect={handleImageSelect} 
            isLoading={analysisState.isLoading} 
          />
        )}
      </main>

      <footer className="bg-gray-800 text-white py-5">
        <div className="max-w-6xl mx-auto px-5 text-center">
          <p className="mb-2 text-sm">
            Powered by MediaPipe face detection technology
          </p>
          <div className="text-xs opacity-80">
            <span>Privacy-focused • No data stored</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
