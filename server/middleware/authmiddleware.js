const User = require("../models/User.js");
const jwt = require("jsonwebtoken");

exports.verifyJWT = async (req, res, next) => {
  const sessionToken = req.cookies["dfr_hub_session"];
  //   const refreshToken = req.cookies["dfr_hub_refresh_token"];
  try {
    // Look for the token in cookies or headers
    // If there's no token, deny access with a 401 Unauthorized status
    if (!sessionToken) {
      return res.status(401).json({ message: "No permission" });
    }

    // Check if the token is valid using a secret key
    const decodedSessionToken = jwt.verify(
      sessionToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    jwt.verify(
      decodedSessionToken.accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    // Get the user linked to the token
    const user = await User.findById(decodedSessionToken?.user?._id).select(
      "-password -sessionToken"
    );

    // If the user isn't found, deny access with a 404 Not Found status
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Attach user info to the request for further use
    req.user = user;
    req.socket = req?.body?.socket;
    delete req?.body?.socket;
    next();
  } catch {
    // Handle any errors during token verification with a 500 Internal Server Error status
    return res.status(401).json({ message: "Permission denied" });
  }
};
