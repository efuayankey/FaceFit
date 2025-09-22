import React, { useState } from 'react';
import { analyzeImage } from './services/api';
import { AnalysisState } from './types';

function App() {
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    isLoading: false,
    result: null,
    error: null,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      handleImageSelect(file);
    }
  };

  const handleStartOver = () => {
    setAnalysisState({ isLoading: false, result: null, error: null });
    setSelectedFile(null);
  };

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white', 
        padding: '20px', 
        textAlign: 'center' 
      }}>
        <h1 style={{ margin: 0, fontSize: '2.5rem' }}>👓 FaceFit</h1>
        <p style={{ margin: '10px 0 0 0', fontSize: '1.2rem' }}>AI-Powered Face Shape & Glasses Recommender</p>
      </header>

      <main style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
        {analysisState.error && (
          <div style={{ 
            background: '#f8d7da', 
            border: '1px solid #f5c6cb', 
            borderRadius: '8px', 
            padding: '20px', 
            marginBottom: '20px',
            color: '#721c24'
          }}>
            <h3>Analysis Failed</h3>
            <p>{analysisState.error}</p>
            <button onClick={handleStartOver} style={{ 
              background: '#dc3545', 
              color: 'white', 
              border: 'none', 
              padding: '8px 16px', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Try Again
            </button>
          </div>
        )}

        {analysisState.result ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>Your Results</h2>
              <button onClick={handleStartOver} style={{ 
                background: '#6c757d', 
                color: 'white', 
                border: 'none', 
                padding: '10px 20px', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                🔄 Analyze Another Photo
              </button>
            </div>

            <div style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              color: 'white', 
              padding: '30px', 
              borderRadius: '12px', 
              marginBottom: '30px',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 10px 0' }}>Your Face Shape</h3>
              <h2 style={{ margin: '0 0 10px 0', fontSize: '2.5rem', textTransform: 'capitalize' }}>
                {analysisState.result.face_shape}
              </h2>
              <p style={{ margin: 0, opacity: 0.9 }}>
                Analyzed using {analysisState.result.landmarks_detected} facial landmarks
              </p>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h3>Recommended Glasses</h3>
              <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                {analysisState.result.recommendations.map((rec, index) => (
                  <div key={index} style={{ 
                    background: 'white', 
                    border: '1px solid #ddd', 
                    borderRadius: '8px', 
                    padding: '20px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>{rec.name}</h4>
                    <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>{rec.description}</p>
                    <p style={{ margin: '0 0 15px 0', color: '#555', fontSize: '13px' }}>
                      <strong>Why it works:</strong> {rec.reason}
                    </p>
                    <div style={{ 
                      background: '#f8f9fa', 
                      padding: '10px', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      Confidence: {Math.round(rec.confidence * 100)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <h2>Upload Your Photo</h2>
            <p style={{ color: '#666', marginBottom: '30px' }}>
              Take a clear front-facing photo or upload an existing image
            </p>
            
            <div style={{ marginBottom: '20px' }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={analysisState.isLoading}
                style={{ 
                  padding: '10px', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px',
                  marginBottom: '20px'
                }}
              />
            </div>

            {analysisState.isLoading && (
              <div style={{ color: '#666', fontSize: '18px' }}>
                <div style={{ 
                  border: '4px solid #f3f3f3',
                  borderTop: '4px solid #007bff',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 20px'
                }}></div>
                Analyzing your face shape...
              </div>
            )}
          </div>
        )}
      </main>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default App;