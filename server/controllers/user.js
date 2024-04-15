const mongoose = require("mongoose");
const User = require("../models/user");
const { userSchema } = require("../schemas");
const {
  createAccessToken,
  createRefreshToken,
} = require("../utils/createSecretToken");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !password || !email)
      return res.status(400).json({
        success: false,
        message: "Name, Email and password are required.",
      });
    const { error } = await userSchema.validateAsync({
      name: name,
      email: email,
      password: password,
    });
    if (error)
      return res.status(400).json({
        success: false,
        message: "Invalid format of name, email or password",
      });
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(200)
        .json({ success: false, message: "User already exists" });
    }
    const hashedPwd = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: name,
      email: email,
      password: hashedPwd,
    });
    res.status(201).json({ message: "Signup Success", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message, success: false });
  }
};

const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(200)
        .json({ success: false, message: "Email and password are required." });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(200)
        .json({ success: false, message: "Incorrect email" });
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res
        .status(200)
        .json({ success: false, message: "Incorrect password" });
    }
    const userInfo = {
      id: user._id,
      user: user.email,
      role: 1,
    };
    // console.log(userInfo);
    const accessToken = createAccessToken(userInfo);
    const refreshToken = createRefreshToken({ user: user.email });
    user.refreshToken = refreshToken;
    const result = await user.save();
    // console.log(result);
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(201).json({
      message: "Logged in successfully",
      success: true,
      role: 1,
      accessToken: accessToken,
      user: user.email,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const refreshTokenController = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) return res.sendStatus(403); //Forbidden
  // evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.email !== decoded.user) return res.sendStatus(403);
    const userInfo = {
      id: foundUser._id,
      user: foundUser.email,
      role: 1,
    };
    // console.log(userInfo);
    const accessToken = createAccessToken(userInfo);
    res.json({
      message: "Access Token generated succesfully",
      success: true,
      role: 1,
      accessToken: accessToken,
      user: foundUser.email,
    });
  });
};

const Logout = async (req, res) => {
  // On client, also delete the accessToken

  // console.log(req);
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    console.log("No cookie found");
    return res.sendStatus(204);
  } //No content
  const refreshToken = cookies.jwt;

  // Is refreshToken in db?
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204);
  }

  // Delete refreshToken in db
  foundUser.refreshToken = "";
  const result = await foundUser.save();
  // console.log("Logout", result);

  res.clearCookie("jwt", {
    path: "/",
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  //   console.log("logged out");
  res.status(204).json({ message: "Logged Out Successfully" });
};

module.exports = {
  Signup,
  Login,
  refreshTokenController,
  Logout,
};
