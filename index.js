const express = require("express");
const cors = require("cors");

require('dotenv').config();

const app = express();
const PORT = 8000;

const db = require("./config/db");
const authRoute = require("./routes/authRoute");
const moviesRoute = require('./routes/movieRoutes');

db();

const corsOptions = {
  origin: true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "pug");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Welcome to the MMA🚀");
});

// Use Routes
app.use("/api/v1/auth", authRoute);
app.use('/api/movies', moviesRoute);

// 404 handler, usually okay for testing on postman
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
