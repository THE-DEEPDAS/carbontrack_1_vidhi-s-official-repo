import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: String,
  organizationName: String,
  gender: String,
  ageGroup: String,
  city: String,
  country: String,
  transport: {
    primaryMode: String,
    otherModes: [String],
    weeklyDistance: Number,
    carFuelType: String,
    carFuelEfficiency: Number,
    flightTravel: String,
  },
  energy: {
    electricity: Number,
    primarySource: String,
    ledLights: Boolean,
  },
  water: {
    usage: Number,
  },
  fuel: {
    gasUsage: Number,
    cookingFuelType: String,
  },
  lifestyle: {
    compostRecycle: Boolean,
  },
  vouchers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Voucher" }],
  wallet: { type: Number, default: 0 },
  certificates: [
    {
      name: String,
      status: {
        type: String,
        enum: ["completed", "in-progress"],
        default: "in-progress",
      },
      eligible: { type: Boolean, default: false }, // Add eligible field
    },
  ],
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
