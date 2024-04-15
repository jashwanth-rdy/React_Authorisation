const express = require("express");
const router = express.Router();

const control = require("../controllers/user");
const { verifyJWT } = require("../middlewares/user");

router.route("/signup").post(control.Signup);
router.route("/login").post(control.Login);
router.route("/logout").post(control.Logout);
router.route("/refresh").get(control.refreshTokenController);

module.exports = router;
