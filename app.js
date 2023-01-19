if (!process.env.NODE_ENV !== "production") {
   require("dotenv").config()
}
const express = require("express"),
   path = require("path"),
   mongoose = require("mongoose"),
   ejsMate = require("ejs-mate"),
   session = require("express-session"),
   flash = require("connect-flash"),
   methodOverride = require("method-override"),
   passport = require("passport"),
   LocalStrategy = require("passport-local")
const ExpressError = require("./utils/ExpressError"),
   User = require("./models/user"),
   campgroundRoutes = require("./routes/campgrounds"),
   reviewRoutes = require("./routes/reviews"),
   userRoutes = require("./routes/users")

const app = express()

mongoose.set("strictQuery", false)
mongoose
   .connect("mongodb://127.0.0.1:27017/yelp-camp")
   .then(() => {
      const d = new Date()
      console.log(`Connected to MongoDB @ ${d.toLocaleTimeString()}`)
   })
   .catch((err) => {
      console.log("Error connecting to MongoDB\n", err)
   })

app.engine("ejs", ejsMate)
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname, "public")))
app.use(
   session({
      secret: "this_is_not_a_good_secret",
      resave: false,
      saveUninitialized: true,
      cookie: {
         httpOnly: true,
         expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week from now
         maxAge: 1000 * 60 * 60 * 7,
      },
   }),
)
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
   res.locals.currentUser = req.user
   res.locals.success = req.flash("success")
   res.locals.error = req.flash("error")
   next()
})

/* routes */
app.use("/", userRoutes)
app.use("/campgrounds", campgroundRoutes)
app.use("/campgrounds/:id/reviews", reviewRoutes)

app.get("/", (req, res) => res.redirect("/home"))
app.get("/home", (req, res) => res.render("home"))

/* Error handling */
app.all("*", (req, res, next) => {
   next(new ExpressError(404, "Page not found"))
})
app.use((err, req, res, next) => {
   const {
      status = 500,
      message = "No way nerd",
      stack = "(no stack trace)",
   } = err
   res.status(status).render("error", { status, stack, message })
})

app.listen(7777, () => {
   console.log("Listening on port 7777")
})
