"use strict";

/** Express app for jobly. */

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.js")
const usersRoutes = require("./routes/users.js")
const chordsRoutes = require("./routes/chords.js")
const songRoutes = require("./routes/songs.js")
const { NotFoundError } = require("./expressError");

const { authenticateJWT } = require("./middleware/auth");
// routes here

const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

app.get('/', (req, res) => {
  res.send('Welcome to the Speller Backend!');
});

app.use("/auth", authRoutes);
app.use("/chords", chordsRoutes);
app.use("/users", usersRoutes);
app.use("/songs", songRoutes);


/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
