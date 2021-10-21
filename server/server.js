require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const DIR = "dist";
const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.static(DIR));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/api/test", function(req, res) {
  console.log("Received request");
  res.send("Test successful!");
});

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
