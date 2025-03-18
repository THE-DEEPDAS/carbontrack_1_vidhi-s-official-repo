import React from 'react';
import { Award, Check, Clock } from 'lucide-react';

export const Certificates = () => {
  const certificates = [
    {
      id: 1,
      name: 'Carbon Neutral Certification',
      description: 'Achieved net-zero carbon emissions through reduction and offsetting',
      eligible: true,
      requirements: ['Net-zero emissions', 'Verified carbon offsets', 'Annual audit'],
      progress: 100
    },
    {
      id: 2,
      name: 'Energy Efficiency Excellence',
      description: 'Recognition for implementing energy-saving measures',
      eligible: true,
      requirements: ['25% energy reduction', 'Smart meter installation', 'Energy audit'],
      progress: 85
    },
    {
      id: 3,
      name: 'Sustainable Supply Chain',
      description: 'Certification for sustainable procurement practices',
      eligible: false,
      requirements: ['80% sustainable suppliers', 'Waste reduction plan', 'Regular audits'],
      progress: 45
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Certifications</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
              cert.eligible ? 'border-green-500' : 'border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{cert.name}</h2>
              {cert.eligible ? (
                <Check className="text-green-500" />
              ) : (
                <Clock className="text-gray-400" />
              )}
            </div>

            <p className="text-gray-600 mb-4">{cert.description}</p>

            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm font-medium">{cert.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    cert.eligible ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                  style={{ width: `${cert.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Requirements:</h3>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {cert.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>

            <button
              className={`mt-4 w-full py-2 px-4 rounded ${
                cert.eligible
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-100 text-gray-500 cursor-not-allowed'
              }`}
            >
              {cert.eligible ? 'Apply Now' : 'Not Eligible'}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <Award className="text-green-500 mr-2" />
          <h2 className="text-xl font-semibold">Your Achievements</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded p-4">
            <h3 className="font-medium mb-2">Completed Certifications</h3>
            <p className="text-3xl font-bold text-green-500">2</p>
          </div>
          <div className="border rounded p-4">
            <h3 className="font-medium mb-2">In Progress</h3>
            <p className="text-3xl font-bold text-blue-500">1</p>
          </div>
        </div>
      </div>
    </div>
  );
};