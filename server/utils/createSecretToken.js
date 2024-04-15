require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.createAccessToken = (id) => {
  return jwt.sign({ userInfo: id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

module.exports.createRefreshToken = (id) => {
  console.log(id);
  return jwt.sign(id, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};
