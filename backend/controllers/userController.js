import User from "../models/User.js"; // Use ES module import

const saveUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Ensure all nested properties exist
    const defaultData = {
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
    };

    const updatedData = { ...defaultData, ...req.body };

    // Update user data
    Object.assign(user, updatedData);
    await user.save();

    res.status(201).json({ message: "User data saved successfully" });
  } catch (error) {
    console.error("Error saving user data:", error.message); // Log detailed error
    res
      .status(500)
      .json({ error: "Failed to save user data", details: error.message });
  }
};

const getUserData = async (req, res) => {
  try {
    const userData = await User.findById(req.user.id).select("-password"); // Exclude password
    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    // Ensure all nested properties exist
    const defaultData = {
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
    };

    res.status(200).json({ ...defaultData, ...userData.toObject() });
  } catch (error) {
    console.error("Error fetching user data:", error.message); // Log detailed error
    res
      .status(500)
      .json({ error: "Failed to fetch user data", details: error.message });
  }
};

export { saveUserData, getUserData }; // Use ES module export
