import React, { useState } from "react";
import axios from "axios";

const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const Analysis = () => {
  const [formData, setFormData] = useState({
    productType: "",
    material: "",
    manufacturingLocation: "",
    usageFrequency: "",
  });
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const parseLLMResponse = (text) => {
    // Remove markdown wrappers if present
    const cleanedText = text.replace(/```(?:json)?/gi, "").trim();
    let parsedData;

    try {
      parsedData = JSON.parse(cleanedText);
    } catch (error) {
      console.error("Failed to parse JSON response:", error);
      // Fallback to text parsing if JSON parsing fails
      const carbonFootprintMatch = cleanedText.match(
        /carbon footprint.*?(\d+\.?\d*(\s*-\s*\d+\.?\d*)?)\s*kg/i
      );
      const recommendationsMatch = cleanedText.match(/recommendations:(.+)/is);

      return {
        carbonFootprint: carbonFootprintMatch
          ? carbonFootprintMatch[1]
          : "10-100", // Store only the numeric value/range
        carbonFootprintNote:
          "Estimated range based on typical product lifecycle if specific data unavailable.",
        recommendations: recommendationsMatch
          ? recommendationsMatch[1]
              .split("\n")
              .filter(Boolean)
              .map((item) => item.trim())
          : [cleanedText],
        description: cleanedText,
      };
    }

    // Handle nested environmental_impact structure
    if (parsedData.environmental_impact) {
      const envImpact = parsedData.environmental_impact;
      // Strip units from estimate if present, store only the numeric value/range
      const carbonFootprintEstimate = envImpact.carbon_footprint?.estimate
        ? envImpact.carbon_footprint.estimate
            .replace(/\s*kg\s*CO2e/i, "")
            .trim()
        : "10-100";
      return {
        carbonFootprint: carbonFootprintEstimate,
        carbonFootprintNote:
          envImpact.carbon_footprint?.note ||
          "Estimated range based on typical product lifecycle if specific data unavailable.",
        recommendations: Array.isArray(envImpact.recommendations)
          ? envImpact.recommendations
          : [envImpact.recommendations || "No recommendations provided"],
        description: envImpact.description || cleanedText,
        additionalMetrics: envImpact.additional_metrics || {},
      };
    }

    // Fallback for unexpected JSON structure
    const carbonFootprintValue = parsedData.carbon_footprint
      ? parsedData.carbon_footprint.replace(/\s*kg\s*CO2e/i, "").trim()
      : "10-100";
    return {
      carbonFootprint: carbonFootprintValue,
      carbonFootprintNote:
        "Estimated range based on typical product lifecycle if specific data unavailable.",
      recommendations: Array.isArray(parsedData.recommendations)
        ? parsedData.recommendations
        : [parsedData.recommendations || cleanedText],
      description: parsedData.description || cleanedText,
      additionalMetrics: parsedData.additional_metrics || {},
    };
  };

  const analyzeProduct = async (e) => {
    e.preventDefault();

    if (!formData.productType) {
      setError("Please specify a product type");
      return;
    }

    setLoading(true);
    setError(null);

    const query = `
      Provide a detailed description of the environmental impact of a ${
        formData.productType
      } 
      made of ${formData.material || "unspecified material"} 
      manufactured in ${formData.manufacturingLocation || "unknown location"} 
      with ${formData.usageFrequency || "average"} usage frequency. 
      Quantify the impact with specific numbers where possible, including:
      - Estimated carbon footprint in kg CO2e (provide a range if exact value unavailable).
      - Additional metrics like energy consumption (in kWh), water usage (in liters), or waste generation (in kg) if applicable.
      Include recommendations to reduce the impact with potential reduction estimates (e.g., percentage or kg CO2e saved).
      Return the response in JSON format with an "environmental_impact" object containing:
      - "description" (string),
      - "carbon_footprint" (object with "estimate" (string, e.g., "50-100") and "note" (string)),
      - "additional_metrics" (object with quantified metrics like "energy_consumption", "water_usage", etc.),
      - "recommendations" (array of strings with quantified reductions where possible).
    `;

    try {
      const response = await axios.post(
        `${API_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [{ text: query }],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Raw Gemini API Response:", response.data);

      const result = response.data;

      if (!result.candidates || result.candidates.length === 0) {
        setError("No analysis available. The API did not return a response.");
        setAnalysis(null);
        return;
      }

      const generatedText =
        result.candidates[0]?.content?.parts?.[0]?.text ||
        "No analysis available.";
      const parsedResult = parseLLMResponse(generatedText);

      setAnalysis(parsedResult);
    } catch (err) {
      setError(
        err.response?.data?.error?.message || "Failed to analyze product"
      );
      console.error("API Error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Product Impact Analysis
        </h1>

        <form onSubmit={analyzeProduct} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Type*
            </label>
            <input
              type="text"
              name="productType"
              value={formData.productType}
              onChange={handleInputChange}
              placeholder="e.g., shirt, phone"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Primary Material
            </label>
            <input
              type="text"
              name="material"
              value={formData.material}
              onChange={handleInputChange}
              placeholder="e.g., cotton, plastic"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Manufacturing Location
            </label>
            <input
              type="text"
              name="manufacturingLocation"
              value={formData.manufacturingLocation}
              onChange={handleInputChange}
              placeholder="e.g., China, USA"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Usage Frequency
            </label>
            <select
              name="usageFrequency"
              value={formData.usageFrequency}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select frequency</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
          >
            {loading ? "Analyzing..." : "Analyze Product"}
          </button>
        </form>

        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}

        {analysis && (
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Analysis Results
            </h2>
            <p className="text-gray-700">
              <strong>Carbon Footprint:</strong> {analysis.carbonFootprint} kg
              CO2e
              {analysis.carbonFootprintNote && (
                <span className="text-sm text-gray-500 block">
                  ({analysis.carbonFootprintNote})
                </span>
              )}
            </p>
            {Object.keys(analysis.additionalMetrics).length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-800">
                  Additional Metrics
                </h3>
                <ul className="mt-2 space-y-1">
                  {Object.entries(analysis.additionalMetrics).map(
                    ([key, value]) => (
                      <li key={key} className="text-gray-600">
                        <strong>
                          {key
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (c) => c.toUpperCase())}
                          :
                        </strong>{" "}
                        {value}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-800">Description</h3>
              <p className="text-gray-600">{analysis.description}</p>
            </div>
            {analysis.recommendations.length > 0 && (
              <>
                <h3 className="text-lg font-medium text-gray-800 mt-4">
                  Recommendations
                </h3>
                <ul className="mt-2 space-y-2 list-disc pl-5">
                  {analysis.recommendations.map((rec, index) => (
                    <li key={index} className="text-gray-600">
                      {rec}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export { Analysis };
