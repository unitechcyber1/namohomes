//imports
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/initdb");
const compression = require("compression");

//database
connectDB();

//express
const app=express()
app.use(express.urlencoded({ extended: false }));
app.use(compression());
app.use(express.json());
app.use(express.static('public'));

/*  CORS MIDDLEWARE */
app.use(cors({
  origin: "http://localhost:4028", // React URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


app.get("/api/test", (req, res) => {
  res.json({ message: "Backend connected" });
});

//listen
app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});