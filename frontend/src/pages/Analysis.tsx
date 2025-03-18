import React, { useState } from 'react';
import { Upload, AlertTriangle, Leaf } from 'lucide-react';

export const Analysis = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<any | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      // Simulate analysis result
      setAnalysis({
        impact_score: 7.5,
        carbon_footprint: 125,
        recommendations: [
          {
            title: 'Use Recycled Materials',
            description: 'Switch to recycled packaging materials to reduce environmental impact',
            potential_reduction: 30
          },
          {
            title: 'Optimize Transportation',
            description: 'Use local suppliers to reduce transportation emissions',
            potential_reduction: 25
          },
          {
            title: 'Energy Efficient Production',
            description: 'Implement energy-saving measures in the production process',
            potential_reduction: 20
          }
        ]
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Product Analysis</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="text-center p-6">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-xl font-medium">Upload Product Image</h2>
          <p className="mt-2 text-gray-500">Upload an image of your product for environmental impact analysis</p>
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-green-50 file:text-green-700
            hover:file:bg-green-100"
        />
      </div>

      {analysis && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Environmental Impact Analysis</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <AlertTriangle className="text-red-500" />
                  <span className="text-2xl font-bold text-red-500">{analysis.impact_score}/10</span>
                </div>
                <p className="mt-2 text-sm text-red-700">Impact Score</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <Leaf className="text-green-500" />
                  <span className="text-2xl font-bold text-green-500">{analysis.carbon_footprint}kg</span>
                </div>
                <p className="mt-2 text-sm text-green-700">Carbon Footprint</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <Upload className="text-blue-500" />
                  <span className="text-2xl font-bold text-blue-500">75%</span>
                </div>
                <p className="mt-2 text-sm text-blue-700">Improvement Potential</p>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
            <div className="space-y-4">
              {analysis.recommendations.map((rec: any, index: number) => (
                <div key={index} className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
                  <h4 className="font-medium">{rec.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                  <p className="text-sm text-green-700 mt-2">
                    Potential reduction: {rec.potential_reduction}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};