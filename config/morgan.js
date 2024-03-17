const express = require("express");
const morgan = require("morgan");
const app = express();
app.use(express.json());
const morganDev = () => {
  if (app.get("env") === "development") {
    app.use(morgan("dev"));
  }
};
module.exports = { morganDev };
