const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const contactsRouter = require("./routes/contactsRoutes");
const usersRouter = require("./routes/usersRoutes");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";
app.use(express.static("public"));
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);
app.use("/api/users", usersRouter);

app.use((_, res) => {
  res.status(404).json({ status: "error", code: 404, message: "Not found" });
});

app.use((err, _, res, __) => {
  const errorCode = err.code || 500;
  res.status(errorCode).json({
    Status: `${errorCode} ${err.status || "fail"}`,
    ContentType: "application/json",
    ResponseBody: { message: err.message },
  });
});

module.exports = app;
