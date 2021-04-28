const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

const contactsRouter = require("./api/router");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ status: "error", code: 404, message: "Not found" });
});

app.use((err, _, res, __) => {
  const code = err.code || 500;
  res.status(code).json({
    status: err.status || "fail",
    code: code,
    message: err.message,
  });
});

const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI;

const connection = mongoose.connect(DB_URI, {
  // promiseLibrary: global.Promise,
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  poolSize: 5,
});

mongoose.connection.on("error", (err) => {
  console.log(`Mongoose error: ${err.message}`);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected.");
});

process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.log("Connection to DB closed and app terminated");
    process.exit(1);
  });
});

connection
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Server not running. Error message: ${err.message}`);
  });
