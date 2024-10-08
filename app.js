const express = require("express");
const app = express();
const cors = require("cors");
const bodyparser = require("body-parser");

app.use(cors({ origin: true, credentials: true }));
// app.use(cors());
app.use(bodyparser.json());
const authRoutes = require("./api/routes/api");
const contentRoutes = require("./api/routes/contentRoutes");
const seriesRoutes = require("./api/routes/seriesRoutes");
const categoryRoutes = require("./api/routes/categoryRoutes");
const userRoutes = require("./api/routes/userRoutes");
const adsRoutes = require("./api/routes/adsRoutes");
const profileRoutes = require("./api/routes/profileRoutes");

app.use("/api", authRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/user", userRoutes);
app.use("/api/series", seriesRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/ads", adsRoutes);
app.use("/api/profile", profileRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

module.exports = app;
