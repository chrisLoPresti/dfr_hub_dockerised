const User = require("../../../models/User");
const jwt = require("jsonwebtoken");
const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production" ? true : false,
  sameSite: "Strict",
};

const generateSessionToken = async (userId) => {
  try {
    // Find the user by ID in the database
    const user = await User.findById(userId);

    // Generate an access token and a refresh token
    const accessToken = user.generateAccessToken();
    const sessionToken = user.generateSessionToken(accessToken);

    // Save the refresh token to the user in the database
    user.sessionToken = sessionToken;
    await user.save({ validateBeforeSave: false });

    // Return the generated tokens
    return { sessionToken };
  } catch (error) {
    // Handle any errors that occur during the process
    throw new Error(error.message);
  }
};

exports.register = async (req, res, next) => {
  const { first_name, last_name, email, phone, password } = req.body;
  if (password.length < 6) {
    return res.status(400).json({ message: "Password less than 6 characters" });
  }

  try {
    await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      phone,
      password,
    }).then(({ _doc: { password, refreshToken, ...user } }) =>
      res.status(200).json({
        message: "User successfully created",
        user,
      })
    );
  } catch ({ errorResponse }) {
    let error = "";
    if (errorResponse.code === 11000) {
      error = "An account with this email already exists!";
    }
    res.status(400).json({
      message: "User not successful created",
      error,
    });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found matching these credentials" });
    }
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Invalid username and password combination" });
    }

    const { sessionToken } = await generateSessionToken(user._id);

    delete user._doc.password;
    delete user._doc.sessionToken;

    res.status(200).cookie("dfr_hub_session", sessionToken, options).json(user);
  } catch (e) {
    res.status(400).json({
      message: e,
    });
  }
};

exports.logout = async (req, res, next) => {
  // Remove the refresh token from the user's information
  const { _id } = req.body;
  await User.findByIdAndUpdate(
    _id,
    {
      $set: { sessionToken: undefined },
    },
    { new: true }
  );

  // Clear the access and refresh tokens in cookies
  return res.status(200).clearCookie("dfr_hub_session").json();
};

exports.refreshtoken = async (req, res, next) => {
  // Retrieve the refresh token from cookies or request body

  const incomingSessionToken = req.cookies["dfr_hub_session"];
  // If no refresh token is present, deny access with a 401 Unauthorized status
  if (!incomingSessionToken) {
    return res.status(401).json({ message: "Session token not found" });
  }
  try {
    res.clearCookie("dfr_hub_session");
    // Verify the incoming refresh token using the secret key
    const decodedSessionToken = jwt.verify(
      incomingSessionToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // Find the user associated with the refresh token
    const user = await User.findById(decodedSessionToken?.user?._id);

    // If the user isn't found, deny access with a 404 Not Found status
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If the stored refresh token doesn't match the incoming one, deny access with a 401 Unauthorized status
    if (user?.sessionToken !== incomingSessionToken) {
      return res.status(401).json({ message: "Session token is incorrect" });
    }

    // Generate new access and refresh tokens for the user
    const { sessionToken } = await generateSessionToken(user._id);

    // Set the new tokens in cookies
    return res
      .status(200)
      .cookie("dfr_hub_session", sessionToken, options)
      .json(user);
  } catch (error) {
    // Handle any errors during token refresh with a 500 Internal Server Error status
    return res.status(500).json({ message: error.message });
  }
};

exports.loaduserfromsession = async (req, res, next) => {
  // Retrieve the refresh token from cookies or request body
  const incomingSessionToken = req.cookies["dfr_hub_session"];
  // If no refresh token is present, deny access with a 401 Unauthorized status
  if (!incomingSessionToken) {
    return res.status(401).json({ message: "Session token not found" });
  }
  try {
    // Verify the incoming refresh token using the secret key
    const decodedSessionToken = jwt.verify(
      incomingSessionToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // Find the user associated with the refresh token
    const user = await User.findById(decodedSessionToken?.user?._id);
    // If the user isn't found, deny access with a 404 Not Found status
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If the stored refresh token doesn't match the incoming one, deny access with a 401 Unauthorized status
    if (user?.sessionToken !== incomingSessionToken) {
      return res.status(401).json({ message: "Session token is incorrect" });
    }

    // Set the new tokens in cookies
    return res
      .status(200)
      .cookie("dfr_hub_session", incomingSessionToken, options)
      .json(user);
  } catch (error) {
    // Handle any errors during token refresh with a 500 Internal Server Error status
    return res.status(500).json({ message: error.message });
  }
};
