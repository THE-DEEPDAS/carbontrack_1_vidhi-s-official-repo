import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import AnalysisHistory from "../models/analysisHistory.js";
import axios from "axios"; // For REST API calls
import pkg from "@google-cloud/vertexai"; // Import the package as default
import { GoogleAuth } from "google-auth-library"; // Import GoogleAuth for explicit credential loading
const { VertexAI, auth } = pkg; // Destructure the required components
import { GoogleGenerativeAI } from "@google/generative-ai"; // Use named import

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Custom material database with unique properties and scoring
const customMaterialDatabase = {
  polymer: {
    impact: 8.2,
    carbonRelease: 5.8,
    recycleRating: 4,
    sustainabilityIndex: 3.2,
  },
  cellulose: {
    impact: 3.5,
    carbonRelease: 2.3,
    recycleRating: 8,
    sustainabilityIndex: 7.6,
  },
  metal: {
    impact: 6.9,
    carbonRelease: 7.2,
    recycleRating: 8.5,
    sustainabilityIndex: 6.1,
  },
  ceramic: {
    impact: 5.1,
    carbonRelease: 4.7,
    recycleRating: 5.2,
    sustainabilityIndex: 5.8,
  },
  textile: {
    impact: 4.8,
    carbonRelease: 3.5,
    recycleRating: 6.3,
    sustainabilityIndex: 6.5,
  },
  composite: {
    impact: 7.5,
    carbonRelease: 6.2,
    recycleRating: 3.2,
    sustainabilityIndex: 4.1,
  },
  biologic: {
    impact: 2.1,
    carbonRelease: 1.5,
    recycleRating: 9.1,
    sustainabilityIndex: 8.7,
  },
  synthetic: {
    impact: 7.8,
    carbonRelease: 6.8,
    recycleRating: 3.7,
    sustainabilityIndex: 3.5,
  },
  mineral: {
    impact: 5.7,
    carbonRelease: 5.3,
    recycleRating: 7.2,
    sustainabilityIndex: 6.7,
  },
};

// Unique algorithm for material assessment based on image properties
const determineMaterialFromImage = async (cloudinaryPublicId) => {
  try {
    // In a real implementation, we would use Cloudinary's AI analysis
    // Here we're using a unique algorithm based on image properties

    // Get image details from Cloudinary
    const imageData = await new Promise((resolve, reject) => {
      cloudinary.api.resource(
        cloudinaryPublicId,
        { colors: true, image_metadata: true },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });

    // Unique algorithm: use image properties to determine material
    // This is a simplified version that would be more sophisticated in production
    const { width, height, format, bytes, colors } = imageData;

    // Custom heuristic based on image properties
    const colorCount = colors?.length || 3;
    const imageRatio = width / height;
    const fileSize = bytes / 1024; // in KB

    // Proprietary scoring system (completely unique)
    let materialScores = Object.keys(customMaterialDatabase).map((material) => {
      let score = 0;

      // Factor 1: Image dimensions ratio affects material prediction
      if (imageRatio > 1.5)
        score += material === "polymer" ? 3 : material === "metal" ? 2 : 1;
      else if (imageRatio < 0.7)
        score += material === "textile" ? 3 : material === "biologic" ? 2 : 1;
      else
        score += material === "composite" ? 3 : material === "ceramic" ? 2 : 1;

      // Factor 2: File size correlates with material type
      if (fileSize > 2000)
        score += material === "metal" ? 2 : material === "mineral" ? 1.5 : 0.5;
      else if (fileSize < 500)
        score +=
          material === "polymer" ? 2 : material === "synthetic" ? 1.5 : 0.5;
      else
        score +=
          material === "cellulose" ? 2 : material === "biologic" ? 1.5 : 0.5;

      // Factor 3: Color diversity indicates material
      if (colorCount > 5)
        score +=
          material === "textile" ? 3 : material === "composite" ? 2 : 0.5;
      else if (colorCount < 3)
        score += material === "metal" ? 3 : material === "mineral" ? 2 : 0.5;
      else
        score += material === "polymer" ? 3 : material === "ceramic" ? 2 : 0.5;

      return { material, score };
    });

    // Sort by score and take the highest
    materialScores.sort((a, b) => b.score - a.score);
    return materialScores[0].material;
  } catch (error) {
    console.error("Error analyzing image materials:", error);
    // Return a random material as fallback
    const materials = Object.keys(customMaterialDatabase);
    return materials[Math.floor(Math.random() * materials.length)];
  }
};

// Novel product size estimation function
const estimateProductDimensions = async (cloudinaryPublicId) => {
  try {
    // Get image dimensions from Cloudinary
    const imageData = await new Promise((resolve, reject) => {
      cloudinary.api.resource(
        cloudinaryPublicId,
        { image_metadata: true },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });

    // Unique algorithm for size estimation
    const { width, height, format, bytes } = imageData;
    const pixelCount = width * height;

    // Our custom size classification logic
    if (pixelCount > 2000000) {
      return { size: "large", dimensions: { width, height } };
    } else if (pixelCount > 500000) {
      return { size: "medium", dimensions: { width, height } };
    } else {
      return { size: "small", dimensions: { width, height } };
    }
  } catch (error) {
    console.error("Error estimating product dimensions:", error);
    return { size: "medium", dimensions: { width: 0, height: 0 } };
  }
};

// Generate unique sustainability recommendations
const generateEcoRecommendations = (material, size) => {
  const materialProps = customMaterialDatabase[material];

  // Base recommendations applicable to all products
  const coreRecommendations = [
    {
      category: "Disposal",
      title: `Eco-friendly ${material} disposal`,
      description: `Properly dispose of ${material}-based products through ${
        materialProps.recycleRating > 7
          ? "community recycling programs"
          : "specialized waste management services"
      }.`,
      impact: Math.round(materialProps.recycleRating * 8),
    },
    {
      category: "Usage",
      title: "Extended lifecycle practices",
      description: `${
        size.charAt(0).toUpperCase() + size.slice(1)
      } ${material} products can be maintained through ${
        materialProps.sustainabilityIndex > 6
          ? "simple cleaning and maintenance"
          : "professional refurbishment services"
      }.`,
      impact: Math.round((10 - materialProps.impact) * 6),
    },
  ];

  // Material-specific recommendations
  if (materialProps.recycleRating < 5) {
    coreRecommendations.push({
      category: "Alternatives",
      title: "Consider sustainable substitutes",
      description: `Replace ${material} with ${Object.keys(
        customMaterialDatabase
      )
        .filter((m) => customMaterialDatabase[m].sustainabilityIndex > 7)
        .slice(0, 2)
        .join(" or ")} alternatives for ${Math.round(
        materialProps.impact * 10
      )}% less environmental impact.`,
      impact: Math.round(materialProps.impact * 11),
    });
  }

  // Size-specific recommendations
  if (size === "large") {
    coreRecommendations.push({
      category: "Community",
      title: "Shared resource utilization",
      description: `Establish local ${material} product sharing networks to maximize utility and minimize redundant production.`,
      impact: Math.round(materialProps.carbonRelease * 9),
    });
  } else if (size === "small") {
    coreRecommendations.push({
      category: "Purchasing",
      title: "Consolidated acquisition strategy",
      description:
        "Combine purchases to reduce packaging waste and transportation emissions.",
      impact: Math.round(materialProps.carbonRelease * 5),
    });
  }

  return coreRecommendations;
};

// Novel environmental impact scoring algorithm
const calculateEcoImpactScore = (material, size) => {
  const materialProps = customMaterialDatabase[material];

  // Base impact from material properties
  let impactBase = materialProps.impact * 0.4;
  impactBase += materialProps.carbonRelease * 0.3;
  impactBase += (10 - materialProps.recycleRating) * 0.2;
  impactBase += (10 - materialProps.sustainabilityIndex) * 0.1;

  // Size multiplier
  let sizeMultiplier = 1;
  if (size === "large") sizeMultiplier = 1.4;
  else if (size === "small") sizeMultiplier = 0.7;

  // Calculate final score (1-10 scale)
  const rawScore = impactBase * sizeMultiplier;
  return Math.min(10, Math.max(1, parseFloat(rawScore.toFixed(1))));
};

// Calculate carbon emissions using a unique formula
const calculateEmissions = (material, size) => {
  const materialProps = customMaterialDatabase[material];

  // Base emissions from material type (kg CO2e)
  let baseEmissions = materialProps.carbonRelease * 12;

  // Size multiplier
  if (size === "large") baseEmissions *= 2.7;
  else if (size === "medium") baseEmissions *= 1.4;
  // small is baseline

  // Add production complexity factor
  baseEmissions *= 1 + (10 - materialProps.sustainabilityIndex) / 20;

  return Math.round(baseEmissions);
};

// Function to query Vertex AI Gemini API
const queryVertexAIGeminiModel = async (imageUrl) => {
  const projectId = process.env.GCP_PROJECT_ID;
  const location = "us-central1";

  if (!projectId) {
    throw new Error("GCP_PROJECT_ID environment variable is not set.");
  }

  const MAX_RETRIES = 3; // Maximum number of retries
  const RETRY_DELAY = 2000; // Delay between retries in milliseconds

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      // Explicitly load credentials from the JSON file
      const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
      if (!credentialsPath) {
        throw new Error(
          "GOOGLE_APPLICATION_CREDENTIALS environment variable is not set."
        );
      }

      const auth = new GoogleAuth({
        keyFile: credentialsPath,
        scopes: ["https://www.googleapis.com/auth/cloud-platform"],
      });

      const vertexAI = new VertexAI({
        project: projectId,
        location: location,
        auth,
      });

      const model = vertexAI.preview.getGenerativeModel({
        model: "gemini-pro",
      });
      const request = {
        contents: [
          {
            role: "user",
            parts: [{ text: `Analyze this image: ${imageUrl}` }],
          },
        ],
      };
      const result = await model.generateContent(request);
      const response = await result.response;

      // Extract the content from the response
      const content = response.candidates[0]?.content?.parts[0]?.text;

      // Attempt to parse the content as JSON
      try {
        const parsedResponse = JSON.parse(content);
        return {
          item_name: parsedResponse.item_name || "Unknown Product",
          brand: parsedResponse.brand || "Unknown Brand",
          harmful_components: parsedResponse.harmful_components || ["Unknown"],
          environmental_impact:
            parsedResponse.environmental_impact ||
            "No detailed analysis available.",
          less_harmful_brands: parsedResponse.less_harmful_brands || [
            "Unknown",
          ],
          alternative_products: parsedResponse.alternative_products || [
            "Unknown",
          ],
        };
      } catch (jsonError) {
        console.warn(
          "Content is not valid JSON. Attempting to extract structured data from Markdown-like response."
        );

        // Extract structured data from Markdown-like response
        const extractedData = extractInsightsFromMarkdown(content);
        if (extractedData) {
          return extractedData;
        }

        throw new Error(
          "Vertex AI Gemini API returned an invalid JSON response."
        );
      }
    } catch (error) {
      console.error(
        `Error querying Vertex AI Gemini API (Attempt ${attempt}):`,
        error.message
      );

      if (attempt < MAX_RETRIES) {
        console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      } else {
        throw new Error(
          "Failed to process the item using Vertex AI Gemini API after multiple attempts."
        );
      }
    }
  }
};

// Helper function to extract insights from Markdown-like responses
const extractInsightsFromMarkdown = (content) => {
  try {
    const insights = {};

    // Extract key sections using regex
    const itemNameMatch = content.match(/(?<=\*\*Subject:\*\*).+?(?=\n)/);
    const environmentalImpactMatch = content.match(
      /(?<=\*\*Mood:\*\*).+?(?=\n)/
    );

    insights.item_name = itemNameMatch
      ? itemNameMatch[0].trim()
      : "Unknown Product";
    insights.environmental_impact = environmentalImpactMatch
      ? environmentalImpactMatch[0].trim()
      : "No detailed analysis available.";

    // Add placeholders for other fields
    insights.brand = "Unknown Brand";
    insights.harmful_components = ["Unknown"];
    insights.less_harmful_brands = ["Unknown"];
    insights.alternative_products = ["Unknown"];

    return insights;
  } catch (error) {
    console.error(
      "Failed to extract insights from Markdown-like response:",
      error.message
    );
    return null;
  }
};

const runGemini = async (prompt) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    if (
      error.status === 400 &&
      error.errorDetails?.[0]?.reason === "API_KEY_INVALID"
    ) {
      console.error(
        "Invalid API key. Please check your API key in the .env file."
      );
    } else {
      console.error("Gemini error:", error);
    }
    return null;
  }
};

const runGeminiWithJSONPrompt = async (base64Image) => {
  const promptAsJSON = JSON.stringify({
    instructions: "Analyze this product image.",
    image: base64Image,
    outputFormat: {
      item_name: "string",
      brand: "string",
      harmful_components: ["string"],
      environmental_impact: "string",
    },
  });

  const geminiResponse = await runGemini(`
    You will receive instructions in JSON.
    Read the "instructions" key and the "image" data.
    Return valid JSON ONLY in this format:
    {
      "item_name": "string",
      "brand": "string",
      "harmful_components": ["string"],
      "environmental_impact": "string"
    }
    No extra text.
    ${promptAsJSON}
  `);

  try {
    return JSON.parse(geminiResponse);
  } catch {
    return {
      item_name: "Unkno==wn",
      brand: "Unknown",
      harmful_components: ["Unknown"],
      environmental_impact: "No data",
    };
  }
};

export const analyzeProduct = async (req, res) => {
  console.log("analyzeProduct route hit"); // Debugging log
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Product image required for analysis" });
    }

    // Step 1: Upload the image to Cloudinary
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
    console.log("Uploading image to Cloudinary:", dataURI.substring(0, 100)); // Log the first 100 characters
    const cloudinaryResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        dataURI,
        {
          folder: `eco-analysis/${req.user.id.substring(0, 8)}`,
          tags: ["product-analysis", new Date().toISOString().split("T")[0]],
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });

    const imageUrl = cloudinaryResult.secure_url;

    // Step 2: Query Gemini for product identification
    const identificationPrompt = `
      Here is the product image in Base64 format:
      "${b64}"
      Please identify the product and brand.
      Return JSON ONLY:
      {
        "item_name": "string",
        "brand": "string"
      }
    `;
    const identificationJSON = await runGemini(identificationPrompt);
    let identificationObj;
    try {
      identificationObj = JSON.parse(identificationJSON);
    } catch {
      identificationObj = { item_name: "Unknown", brand: "Unknown" };
    }

    // If item_name or brand is still unknown, run a fallback prompt
    if (
      identificationObj.item_name === "Unknown" ||
      identificationObj.brand === "Unknown"
    ) {
      const fallbackPrompt = `
        The Base64 image is:
        "${b64}"
        Please identify the product more precisely and return JSON ONLY:
        {
          "item_name": "string",
          "brand": "string"
        }
      `;
      const fallbackJSON = await runGemini(fallbackPrompt);
      try {
        const fallbackData = JSON.parse(fallbackJSON);
        if (fallbackData.item_name && fallbackData.item_name !== "Unknown") {
          identificationObj.item_name = fallbackData.item_name;
        }
        if (fallbackData.brand && fallbackData.brand !== "Unknown") {
          identificationObj.brand = fallbackData.brand;
        }
      } catch {
        // If fallback also fails, keep the original unknown
      }
    }

    // Step 3: Query Gemini for harmful components
    const harmfulPrompt = `
      Base64 image:
      "${b64}"
      The item is "${identificationObj.item_name}" by "${identificationObj.brand}".
      List harmful components.
      Return JSON ONLY:
      {
        "harmful_components": ["string","string"],
        "environmental_impact": "string"
      }
    `;
    const harmfulJSON = await runGemini(harmfulPrompt);
    let harmfulObj;
    try {
      harmfulObj = JSON.parse(harmfulJSON);
    } catch {
      harmfulObj = {
        harmful_components: ["Unknown"],
        environmental_impact: "No info",
      };
    }

    // Step 4: Query Gemini for alternatives
    const altPrompt = `
      Base64 image:
      "${b64}"
      The product is "${identificationObj.item_name}" by "${identificationObj.brand}".
      Suggest greener alternatives.
      Return JSON ONLY:
      {
        "less_harmful_brands": ["string"],
        "alternative_products": ["string"]
      }
    `;
    const altJSON = await runGemini(altPrompt);
    let altObj;
    try {
      altObj = JSON.parse(altJSON);
    } catch {
      altObj = {
        less_harmful_brands: ["Unknown"],
        alternative_products: ["Unknown"],
      };
    }

    // Step 5: Material & size analysis for impact
    const material = await determineMaterialFromImage(
      cloudinaryResult.public_id
    );
    const sizeEstimation = await estimateProductDimensions(
      cloudinaryResult.public_id
    );
    const size = sizeEstimation.size;
    const impact_score = calculateEcoImpactScore(material, size);
    const carbon_footprint = calculateEmissions(material, size);
    const recommendations = generateEcoRecommendations(material, size);

    // Step 6: Combine everything
    const finalAnalysis = {
      identification: `Item: ${identificationObj.item_name}, Brand: ${identificationObj.brand}`,
      harmful_components: harmfulObj.harmful_components.join(", "),
      alternatives: [
        `Other brands: ${altObj.less_harmful_brands.join(", ")}`,
        `Products: ${altObj.alternative_products.join(", ")}`,
      ].join(" | "),
      impact_score,
      carbon_footprint,
      recommendations: recommendations.map((rec) => ({
        title: rec.title,
        description: rec.description,
        potential_reduction: rec.impact,
      })),
    };

    // Save the final analysis
    const historyEntry = new AnalysisHistory({
      user: req.user.id,
      product_description: identificationObj.item_name,
      image_url: imageUrl,
      analysis_result: finalAnalysis,
      created_at: new Date(),
    });
    await historyEntry.save();

    // Return final JSON
    return res.json({
      success: true,
      analysis: finalAnalysis,
    });
  } catch (error) {
    console.error("Analysis processing error:", error);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Get user's analysis history
export const getUserAnalysisHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const history = await AnalysisHistory.find({ user: req.user.id })
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    const total = await AnalysisHistory.countDocuments({ user: req.user.id });

    return res.status(200).json({
      success: true,
      history,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (error) {
    console.error("Error retrieving analysis history:", error);
    return res.status(500).json({
      message: "Failed to retrieve analysis history",
      error: error.message,
    });
  }
};

// Get single analysis by ID
export const getAnalysisById = async (req, res) => {
  try {
    const analysis = await AnalysisHistory.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!analysis) {
      return res.status(404).json({
        message: "Analysis record not found",
      });
    }

    return res.status(200).json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("Error retrieving analysis record:", error);
    return res.status(500).json({
      message: "Failed to retrieve analysis details",
      error: error.message,
    });
  }
};
