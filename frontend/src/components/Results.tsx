import React from 'react';
import { FaceAnalysisResult } from '../types';

interface ResultsProps {
  result: FaceAnalysisResult;
  onStartOver: () => void;
}

const Results: React.FC<ResultsProps> = ({ result, onStartOver }) => {
  const getFaceShapeIcon = (shape: string) => {
    const icons: { [key: string]: string } = {
      oval: '⭕',
      round: '🔴',
      square: '⬜',
      heart: '💖',
      oblong: '📏',
      diamond: '💎'
    };
    return icons[shape] || '👤';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return '#28a745';
    if (confidence >= 0.6) return '#ffc107';
    return '#dc3545';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.9) return 'Excellent Match';
    if (confidence >= 0.8) return 'Great Match';
    if (confidence >= 0.7) return 'Good Match';
    if (confidence >= 0.6) return 'Fair Match';
    return 'Poor Match';
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold text-gray-800">Your Face Analysis Results</h2>
        <button 
          onClick={onStartOver} 
          className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all hover:-translate-y-0.5"
        >
          🔄 Analyze Another Photo
        </button>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-8 rounded-2xl flex flex-col sm:flex-row items-center gap-6 mb-8 shadow-xl">
        <div className="text-6xl sm:text-7xl opacity-90">
          {getFaceShapeIcon(result.face_shape)}
        </div>
        <div className="text-center sm:text-left">
          <h3 className="text-lg opacity-90 mb-1">Your Face Shape</h3>
          <p className="text-3xl sm:text-4xl font-bold mb-2 capitalize">{result.face_shape}</p>
          <p className="text-sm opacity-80">
            Analyzed using {result.landmarks_detected} facial landmarks
          </p>
        </div>
      </div>

      {result.analysis_details && (
        <div className="bg-gray-50 p-6 rounded-xl mb-8">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Face Measurements</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500 flex justify-between items-center">
              <span className="font-medium text-gray-600">Face Ratio:</span>
              <span className="text-xl font-bold text-gray-800">{result.analysis_details.ratios.face_ratio.toFixed(2)}</span>
            </div>
            <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500 flex justify-between items-center">
              <span className="font-medium text-gray-600">Jaw to Cheek:</span>
              <span className="text-xl font-bold text-gray-800">{result.analysis_details.ratios.jaw_to_cheek.toFixed(2)}</span>
            </div>
            <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500 flex justify-between items-center">
              <span className="font-medium text-gray-600">Forehead to Cheek:</span>
              <span className="text-xl font-bold text-gray-800">{result.analysis_details.ratios.forehead_to_cheek.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Recommended Glasses for You</h3>
        <p className="text-gray-600 mb-6">
          Based on your {result.face_shape} face shape, here are the best glasses styles:
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {result.recommendations.map((rec, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4 flex-wrap gap-3">
                <h4 className="text-xl font-semibold text-gray-800">{rec.name}</h4>
                <div 
                  className="px-3 py-1 rounded-full text-white text-xs font-bold uppercase tracking-wide"
                  style={{ backgroundColor: getConfidenceColor(rec.confidence) }}
                >
                  {getConfidenceText(rec.confidence)}
                </div>
              </div>
              
              <div className="mb-4">
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide">
                  {rec.style}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4 leading-relaxed">{rec.description}</p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <strong className="text-gray-800 block mb-2">Why it works:</strong>
                <p className="text-gray-700 text-sm leading-relaxed">{rec.reason}</p>
              </div>
              
              <div>
                <div className="text-xs text-gray-600 mb-2 font-medium">
                  Match Confidence: {Math.round(rec.confidence * 100)}%
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ 
                      width: `${rec.confidence * 100}%`,
                      backgroundColor: getConfidenceColor(rec.confidence)
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-yellow-800 mb-4">💡 Shopping Tips</h4>
        <ul className="space-y-2 text-yellow-800">
          <li className="flex items-start gap-2">
            <span className="text-yellow-600 mt-1">•</span>
            <span>Try on glasses virtually or in-store before purchasing</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-600 mt-1">•</span>
            <span>Consider your lifestyle and comfort preferences</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-600 mt-1">•</span>
            <span>Frame size should complement your face size</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-600 mt-1">•</span>
            <span>Don't be afraid to try different colors and materials</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-600 mt-1">•</span>
            <span>Higher confidence recommendations are more likely to suit you</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Results;