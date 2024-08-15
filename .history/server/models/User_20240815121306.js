const mongoose = require("mongoose");
const Schema = mongoose.Schema;
console.log("BWAAAA");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
console.log("PROBLEM AREA");

const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Email is invalid",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    first_name: {
      type: String,
      required: [true, "Firstname is required"],
      minLength: [3, "firstname must be at least 3 characters"],
      maxLength: [25, "firstname must be at most 25 characters"],
    },
    last_name: {
      type: String,
      required: [true, "Lastname is required"],
      minLength: [3, "lastname must be at least 3 characters"],
      maxLength: [25, "lastname must be at most 25 characters"],
    },
    phone: {
      type: String,
      default: "",
    },
    sessionToken: {
      type: String,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to hash the password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to check if the entered password is correct
UserSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Method to generate an access token
UserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      user: { _id: this._id.toString(), email: this.email },
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
    }
  );
};

// Method to generate a refresh token
UserSchema.methods.generateSessionToken = function (accessToken) {
  return jwt.sign(
    {
      user: { _id: this._id.toString(), email: this.email },
      accessToken,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "15d",
    }
  );
};

module.exports = User = mongoose.model("users", UserSchema);
