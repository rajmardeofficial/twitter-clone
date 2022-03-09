const express = require("express");
const app = express();
const session = require("express-session");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("./models/user");

mongoose.connect("mongodb://localhost:27017/twitterClone");

app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(
  session({
    secret: "this is secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  if (req.url == "/login" || req.url == "/signup") {
    next();
  } else if (req.session.username) {
    next();
  } else {
    res.redirect("/login");
  }
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/about", (req, res) => {
  res.render("about");
});

// here we render login page

app.get("/login", (req, res) => {
  res.render("login");
});

// here we post login

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.find({ email }).exec((err, foundUser) => {
    if (foundUser.length > 0) {
      const hashedPassword = foundUser[0].password;
      bcrypt.compare(password, hashedPassword, (err, result) => {
        if (result) {
          req.session.username = foundUser[0].email;
          res.redirect("/");
        } else {
          res.redirect("/login");
        }
      });
    } else {
      res.send("please enter correct details to login");
    }
  });
});

// here we render signup page

app.get("/signup", (req, res) => {
  res.render("signup");
});

// here we post signup

app.post("/signup", (req, res) => {
  const user = new User();
  const name = req.body.name;
  const birthDate = req.body.birthDate;
  const email = req.body.email;
  const password = req.body.password;

  bcrypt.hash(password, 10, (err, result) => {
    const hashedPassword = result;
    user.name = name;
    user.email = email;
    user.password = hashedPassword;
    user.birthDate = birthDate;
    user.save((err, result) => {
      req.session.username = result[0].email;
    });
  });
});

// render logout url
// destroy session

app.get("/logout", (req, res) => {
  req.session.destroy((err)=>{
    if (err){
      console.log(err);
    } else {
      res.redirect("/login")
    }
  })
});

app.listen(3000, () => console.log("server started on port 3000"));
