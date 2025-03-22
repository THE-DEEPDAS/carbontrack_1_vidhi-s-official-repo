import React, { useState, useEffect } from "react";
import axios from "axios";

const Form = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    gender: "",
    ageGroup: "",
    city: "",
    country: "",
    transport: {
      primaryMode: "",
      otherModes: [],
      weeklyDistance: 0,
      carFuelType: "",
      carFuelEfficiency: 0,
      flightTravel: "",
    },
    energy: {
      electricity: 0,
      primarySource: "",
      ledLights: false,
    },
    water: {
      usage: 0,
    },
    fuel: {
      gasUsage: 0,
      cookingFuelType: "",
    },
    lifestyle: {
      compostRecycle: false,
    },
  });

  useEffect(() => {
    // Fetch existing user data to prefill the form
    axios
      .get("/api/user-data", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setFormData(response.data);
      })
      .catch((err) => {
        console.error("Error fetching user data for form:", err.message);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value || "", // Ensure empty string for undefined/null
      }));
    }
  };

  const handleNestedChange = (e, section) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: type === "checkbox" ? checked : value || "", // Ensure empty string for undefined/null
      },
    }));
  };

  const handleSubmit = async () => {
    await axios.post("/api/user-data", formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    onComplete();
  };

  return (
    <div className="container mx-auto p-6">
      {step === 1 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Step 1: Personal Details
          </h2>
          <div className="mb-4">
            <label className="block text-gray-700">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full border rounded p-2 bg-gray-100"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Non-binary">Non-binary</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Age Group</label>
            <select
              name="ageGroup"
              value={formData.ageGroup}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option value="">Select</option>
              <option value="<18">Under 18</option>
              <option value="18-25">18-25</option>
              <option value="26-35">26-35</option>
              <option value="36-50">36-50</option>
              <option value="51+">51+</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <button
            onClick={() => setStep(2)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Next
          </button>
        </div>
      )}
      {step === 2 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Step 2: Transportation Habits
          </h2>
          <div className="mb-4">
            <label className="block text-gray-700">
              Primary Mode of Transport
            </label>
            <select
              name="primaryMode"
              value={formData.transport.primaryMode}
              onChange={(e) => handleNestedChange(e, "transport")}
              className="w-full border rounded p-2"
            >
              <option value="">Select</option>
              <option value="Car">Car</option>
              <option value="Motorcycle">Motorcycle</option>
              <option value="Bicycle">Bicycle</option>
              <option value="Public Transport">Public Transport</option>
              <option value="Walking">Walking</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Weekly Distance (km)</label>
            <input
              type="number"
              name="weeklyDistance"
              value={formData.transport.weeklyDistance}
              onChange={(e) => handleNestedChange(e, "transport")}
              className="w-full border rounded p-2"
            />
          </div>
          <button
            onClick={() => setStep(3)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Next
          </button>
        </div>
      )}
      {step === 3 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Step 3: Energy Usage</h2>
          <div className="mb-4">
            <label className="block text-gray-700">
              Electricity Consumption (kWh/month)
            </label>
            <input
              type="number"
              name="electricity"
              value={formData.energy.electricity}
              onChange={(e) => handleNestedChange(e, "energy")}
              className="w-full border rounded p-2"
            />
          </div>
          <button
            onClick={() => setStep(4)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Next
          </button>
        </div>
      )}
      {step === 4 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Step 4: Lifestyle</h2>
          <div className="mb-4">
            <label className="block text-gray-700">
              Do you compost or recycle?
            </label>
            <input
              type="checkbox"
              name="compostRecycle"
              checked={formData.lifestyle.compostRecycle}
              onChange={(e) => handleNestedChange(e, "lifestyle")}
              className="mr-2"
            />
            Yes
          </div>
          <button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default Form;
