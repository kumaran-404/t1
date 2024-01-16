const bcrypt = require("bcrypt");
const User = require("../models/User");
const {
  ErrorMessage,
  SuccessMessage,
  tokenErrorMessage,
} = require("../utils/handler");
const { createToken, getToken } = require("../validators/token");
const router = require("express").Router();

router.post("/signup", async (req, res) => {
  try {
    const { email, password, isModerator, name } = req.body;

    console.log(req.body);

    const newUser = await User.create({
      email,
      password,
      isModerator,
      name,
    });

    await newUser.save();

    return SuccessMessage({ status: "Success" }, res);
  } catch (err) {
    if (err.message === "Validation error") {
      return SuccessMessage({
        status: "Failure",
        message: "User already Found",
      },res);
    }
    return ErrorMessage(err.message, res);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    console.log("Login");

    if (!user) {
      return SuccessMessage(
        { status: "Failure", message: "User not Found" },
        res
      );
    }

    const result = password === user.getDataValue("password");

    if (result) {
      const token = createToken({
        name: user.getDataValue("name"),
        email: user.getDataValue("email"),
        id: user.getDataValue("id"),
        isModerator: user.getDataValue("isModerator"),
      });
      return SuccessMessage({ status: "Success", token }, res);
    }

    return SuccessMessage(
      { status: "Failure", message: "Password is wrong" },
      res
    );
  } catch (err) {
    return ErrorMessage(err.message, res);
  }
});

router.post("/verifyJWT", async (req, res) => {
  try {
    const token = getToken(req);

    if (!token) return tokenErrorMessage(res);

    return SuccessMessage(token, res);
  } catch (err) {
    return tokenErrorMessage(res);
  }
});

module.exports = router;
