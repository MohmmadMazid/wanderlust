if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
// console.log(process.env.CLOUDE_NAME)
// console.log(process.env.CLOUDE_KEY)
// console.log(process.env.CLOUDE_API_SECRET)

const express = require("express");
const app = express();
const port = 3000;
let path = require("path");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
// var methodOverride = require('method-override')
// app.use(methodOverride('_method'))
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

let wrapAsync = require("./utils/wrapAsync.js"); //not working in this file
app.use(express.static(path.join(__dirname, "/public")));
const ExpressError = require("./utils/ExpresError.js");

let { listingSchema, reviewSchema } = require("./schema.js"); //not working in this  file

const session = require("express-session"); //session require
const MongoStore = require("connect-mongo");

const flash = require("connect-flash");
//authentication
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const mongoURL = process.env.ATLAS_MONGO_URL;
const store = MongoStore.create({
  mongoUrl: mongoURL,
  crypto: {
    secret: process.env.SESSION_SECRET,
  },
  touchAfter: 24 * 60 * 60,
});

store.on("error", () => {
  console.log("error in mongo URL means MONGO_URL", error);
});

main()
  .then((res) => {
    console.log("set up done");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(mongoURL);
  //   await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const sessionOptions = {
  store: store,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

// app.get("/", (req, res) => {
//     res.send("Hi I am root");
//     })

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;

  // console.log(res.locals.success);
  next();
});

app.get("/demouser", async (req, res) => {
  let fakeUser = new User({
    email: "student@gmail.com",
    username: "delta-student",
  });
  let registeredUser = await User.register(fakeUser, "helloworld");
  res.send(registeredUser);
});

app.use("/listing", listingsRouter);
app.use("/listing/:id/review", reviewsRouter);
app.use("/", userRouter);

//error handler
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found Or something went worong"));
});

// app.use((err,req,res,next)=>{
//     res.send("something went wrong")
// })

app.use((err, req, res, next) => {
  let { statuscode = 500, message } = err;
  //    res.status(statuscode).send(message);
  res.status(statuscode).render("error.ejs", { err, message });
});

app.listen(port, () => {
  console.log("app is workig using port 3000");
});
