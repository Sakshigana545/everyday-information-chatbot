const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");
const normalRoutes = require("./routes/normal");

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/normal", normalRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Server is running! Go to /api/auth or /api/chat");
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch(err => console.error(err));

app.listen(process.env.PORT || 3000, () =>
  console.log(`Server running on http://localhost:${process.env.PORT || 3000}`)
);
