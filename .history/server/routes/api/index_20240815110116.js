const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  refreshtoken,
  loaduserfromsession,
} = require("./api/auth");
const {
  getmarkers,
  createmarker,
  deletemarker,
  updatemarker,
} = require("./api/markers");
const { verifyJWT } = require("../middleware/authmiddleware");

//post requests
router.route("/api/auth/sign-up").post(register);
router.route("/api/auth/login").post(login);
router.route("/api/auth/logout").post(logout);
router.route("/api/markers/createmarker").post(verifyJWT, createmarker);

//get requests
router.route("/api/auth/refreshtoken").get(refreshtoken);
router.route("/api/markers/getmarkers").get(verifyJWT, getmarkers);
router
  .route("/api/auth/loaduserfromsession")
  .get(verifyJWT, loaduserfromsession);
//put requests
router.route("/api/markers/updatemarker").put(verifyJWT, updatemarker);

//delete requests
router.route("/api/markers/deletemarker").delete(verifyJWT, deletemarker);

module.exports = router;
