import { useState, useEffect } from "react";
import RealTimeChart from "../components/RealTimeChart";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Google Generative AI library

// Load API key from .env file
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize the generative AI model
const genAI = new GoogleGenerativeAI(API_KEY);

export default function Monitoring() {
  const [chartData, setChartData] = useState({
    temperature: [],
    energy: [],
    water: [],
    co2: [],
  });

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false); // Track AI response status
  const [status, setStatus] = useState(""); // Track the status of the LLM process

  // Simulate real-time data update
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Updating chart data...");
      setChartData((prevData) => ({
        temperature: [
          ...prevData.temperature.slice(-49),
          20 + Math.random() * 10,
        ],
        energy: [...prevData.energy.slice(-49), 100 + Math.random() * 20],
        water: [...prevData.water.slice(-49), 50 + Math.random() * 10],
        co2: [...prevData.co2.slice(-49), 300 + Math.random() * 50],
      }));
    }, 5000); // Updating every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Fetch recommendations from LLM
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (chartData.co2.length === 0) return;

      console.log("Fetching recommendations...");
      setLoading(true);
      setStatus("Preparing data for AI analysis...");

      try {
        const inputData = `Analyze the following CO2 sensor data and provide recommendations:
          - CO2 Levels (last 10 values): ${chartData.co2.slice(-10).join(", ")}
          Provide insights and actionable recommendations in short log format.`;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Create proper parts array for the request
        const result = await model.generateContent([inputData]);
        const response = await result.response;
        const text = response.text();

        if (text) {
          console.log("Generated recommendations:", text);
          setRecommendations((prev) => [...prev.slice(-4), text]);
          setStatus("AI analysis completed.");
        } else {
          console.warn("LLM did not return a valid response.");
          setRecommendations((prev) => [
            ...prev.slice(-4),
            "⚠️ LLM did not return a response.",
          ]);
          setStatus("AI analysis failed.");
        }
      } catch (error) {
        console.error("Error fetching AI recommendations:", error);
        setRecommendations((prev) => [
          ...prev.slice(-4),
          "⚠️ Network or LLM error occurred.",
        ]);
        setStatus("Error occurred during AI analysis.");
      } finally {
        setLoading(false);
        console.log("Finished fetching recommendations.");
      }
    };

    fetchRecommendations();
  }, [chartData.co2]); // Trigger only when CO2 data changes

  return (
    <div>
      <h1>Monitoring Dashboard</h1>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
      >
        <RealTimeChart
          title="Temperature"
          unit="°C"
          data={chartData.temperature}
        />
        <RealTimeChart
          title="Energy Usage"
          unit="kWh"
          data={chartData.energy}
        />
        <RealTimeChart title="Water Usage" unit="L" data={chartData.water} />
        <RealTimeChart title="CO2 Levels" unit="ppm" data={chartData.co2} />
      </div>

      {/* Recommendations Section */}
      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "10px",
        }}
      >
        <h2>AI-Based Recommendations</h2>
        {status && <p className="status-message">{status}</p>}
        <div
          style={{
            height: "200px",
            overflowY: "auto",
            background: "#f7f7f7",
            padding: "10px",
          }}
        >
          {loading ? (
            <p>⏳ AI is analyzing data...</p>
          ) : recommendations.length === 0 ? (
            <p>No recommendations yet. AI will analyze data soon...</p>
          ) : (
            recommendations.map((rec, index) => (
              <p key={index}>&#8226; {rec}</p>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
