const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const DBConnection = require("./utils/DBConnection");
const discussionRoutes = require("./routes/Discussion");
const commentRoutes = require("./routes/Comment");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
const {ErrorMessage,tokenErrorMessage} = require("./utils/handler");
const {getToken} = require("./validators/token")

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

require("./models/User");
require("./models/comment");
require("./models/Discussion");

app.use("/api/auth", authRoutes);

app.use((req, res, next) => {
  try {
    const token = getToken(req);

    if (!token) return tokenErrorMessage(res);

    res.locals.data = token;

    next();
  } catch (err) {
    return ErrorMessage(err.message, res);
  }
});

app.use("/api/discussion", discussionRoutes);
app.use("/api/comment", commentRoutes);

app.listen(3000, (err) => {
  if (!err) console.log("Server Started ", 3000);
});
