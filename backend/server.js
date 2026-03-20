
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

// 🔹 MIDDLEWARE (FIRST)
app.use(cors());
app.use(express.json());

// 🔹 ROUTES (SECOND)
const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");
const normalRoutes = require("./routes/normal");
const jokesRoutes = require("./routes/jokes");
const newsRoutes = require("./routes/news");





app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/normal", normalRoutes);
app.use("/api/jokes", jokesRoutes);
app.use("/api/news", newsRoutes);

// 🔹 ROOT TEST ROUTE (OPTIONAL)
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// 🔹 DATABASE
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch(err => console.error(err));

// 🔹 SERVER START (LAST)
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on http://localhost:${process.env.PORT || 3000}`);
});
