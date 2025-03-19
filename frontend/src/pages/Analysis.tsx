import React, { useState, useEffect } from "react";
import axios from "axios";
import { Upload, AlertTriangle, Leaf } from "lucide-react";

interface AnalysisResult {
  impact_score: number;
  carbon_footprint: number;
  recommendations: Array<{
    title: string;
    description: string;
    potential_reduction: number;
  }>;
}

interface HistoryItem {
  _id: string;
  product_description: string;
  image_url: string;
  created_at: string;
  analysis_result: AnalysisResult;
}

export const Analysis = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysis, setAnalysis] = useState(null as AnalysisResult | null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to view history.");
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/analysis/history",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setHistory(response.data.history);
    } catch (err) {
      setError("Failed to fetch history.");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setAnalysis(null);
      setError(null);
    }
  };

  const analyzeProduct = async () => {
    if (!selectedFile) {
      setError("Please select a file to analyze.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to analyze products.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/analysis/product",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAnalysis(response.data.analysis);
      fetchHistory(); // Refresh history after analysis
    } catch (err) {
      setError("Failed to analyze product.");
    } finally {
      setLoading(false);
    }
  };

  const loadHistoryItem = (item: HistoryItem) => {
    setAnalysis(item.analysis_result);
    setShowHistory(false);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Product Analysis</h1>

      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          {showHistory ? "New Analysis" : "View History"}
        </button>
      </div>

      {showHistory ? (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Analysis History</h2>
          {history.length === 0 ? (
            <p className="text-gray-500">No history available.</p>
          ) : (
            <ul className="space-y-4">
              {history.map((item) => (
                <li
                  key={item._id}
                  className="p-4 border rounded-lg cursor-pointer hover:bg-gray-100"
                  onClick={() => loadHistoryItem(item)}
                >
                  <p className="font-medium">{item.product_description}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Upload Product Image</h2>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <button
              onClick={analyzeProduct}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg"
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </div>

          {error && <p className="text-red-500">{error}</p>}

          {analysis && (
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
              <p className="mb-4">
                <strong>Impact Score:</strong> {analysis.impact_score}/10
              </p>
              <p className="mb-4">
                <strong>Carbon Footprint:</strong> {analysis.carbon_footprint}{" "}
                kg
              </p>
              <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, index) => (
                  <li key={index} className="p-2 border rounded-lg">
                    <p className="font-medium">{rec.title}</p>
                    <p className="text-sm text-gray-500">{rec.description}</p>
                    <p className="text-sm text-green-500">
                      Potential Reduction: {rec.potential_reduction}%
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
