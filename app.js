var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var expressLayouts = require("express-ejs-layouts");
var connectDB = require("./config/db");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var bookmarksRouter = require("./routes/bookmarks");
var collectionsRouter = require("./routes/collections");

const expressEjsLayouts = require("express-ejs-layouts");
const useSessions = process.env.USE_SESSIONS === "true";

const session = require("express-session");
const MongoStore = require("connect-mongo");

var app = express();

connectDB();

// view engine setup
app.use(expressEjsLayouts);
app.set("layout", "layout");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//Sessions
if (useSessions) {
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        collectionName: "sessions",
      }),
      // cookie for 1 day
      cookie: { maxAge: 1000 * 60 * 60 * 24 },
    })
  );
}
// Log whether sessions are used
console.log(`Using sessions: ${useSessions ? "YES" : "NO"}`);

// default locals
app.use(function (req, res, next) {
  res.locals.title = res.locals.title || "LinkLoom";
  next();
});

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/bookmarks", bookmarksRouter);
app.use("/collections", collectionsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
