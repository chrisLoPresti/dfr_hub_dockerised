const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  refreshtoken,
  loaduserfromsession,
} = require("./api/auth");
const { verifyJWT } = require("../middleware/authmiddleware");

//post requests
router.route("/api/auth/sign-up").post(register);
router.route("/api/auth/login").post(login);
router.route("/api/auth/logout").post(logout);

//get requests
router.route("/api/auth/refreshtoken").get(refreshtoken);
router
  .route("/api/auth/loaduserfromsession")
  .get(verifyJWT, loaduserfromsession);
router.route("/api/ping").post(async (req, res, next) => {
  res.send("PING");
});
//put requests

//delete requests

module.exports = router;
