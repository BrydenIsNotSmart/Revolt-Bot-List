const express = require('express');
const path = require('node:path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const fs = require('node:fs');
const CleanCSS = require('clean-css');
const session = require('express-session');
const bodyParser = require('body-parser');
const MongoStore = require('connect-mongo')(session);

//-Webserver-//
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/pages'))
app.disable("x-powered-by")
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false, 
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));
app.get('/css/main.css', (req, res) => {
  const originalCSS = fs.readFileSync('src/server/static/css/main.css', 'utf8');
  var options = { };
  const minifiedCSS = new CleanCSS(options).minify(originalCSS);
  res.set('Content-Type', 'text/css');
  res.send(minifiedCSS.styles);
})

app.get("/register", function (req, res) { res.render('auth/register.ejs') });
  
  app.post('/register', async (req, res) => {
    let model = require("../database/models/user.js")
    const revoltUser = client.users.get(req.body.revoltId);
    if (!revoltUser) return res.status(400).json({ message: "The revolt Id does not belong to an account."})
    if (await model.findOne({ revoltId: req.body.revoltId})) return res.status(409).json({ message: "This revolt account has already been registered on Revolt Bot List. Think someone else registered your account? Contact support"})
    const userAccount = await model.create({
      revoltId: req.body.revoltId,
      password: req.body.password,
      createdAt: Date.now(),
    });
    userAccount.save((error) => {
      if (error) {
        res.status(500).send(error);
      } else {
        req.session.userAccountId = userAccount.revoltId;
        res.redirect("/")
      }
    });
  });
  
  app.get("/login", function (req, res) { res.render('auth/login.ejs', { user: null }) });
  
  app.post('/login', (req, res) => {
    let model = require("../database/models/user.js")
    model.findOne({ revoltId: req.body.revoltId 
    }, (error, userAccount) => {
        if (error) {
          res.status(500).send(error);
        } else if (userAccount) {
          bcrypt.compare(req.body.password, userAccount.password, (error, result) => {
            if (error) {
              res.status(500).send(error);
            } else if (result) {
              req.session.userAccountId = userAccount.revoltId;
              res.redirect("/")
            } else {
              res.send('Invalid password.');
            }
          });
        } else {
          res.send('Invalid Revolt ID.');
        }
      });
  });
  
  app.get('/session', checkAuth, async (req, res) => {
    let model = require("../database/models/user.js")
    const data = await model.findOne({ revoltId: req.session.userAccountId });
    res.json({
      revoltId: data.revoltId,
      createdAt: data.createdAt
    })
  })

  app.get('/logout', (req, res) => {
    req.session.destroy((error) => {
      if (error) {
        res.status(500).send(error);
      } else {
        res.redirect("/")
      }
    });
  });

//-Routers-//
const indexRouter = require("./routes/index.js")
app.use("/", indexRouter)
const botsRouter = require("./routes/bots.js");
app.use("/bots", botsRouter)
app.use("/bot", botsRouter)

app.listen(config.port, () => {
    console.info(`[INFO] Running on port `+config.port)
})

function checkAuth(req, res, next) {
    if (req.session.userAccountId) {
        let model = require("../database/models/user.js")
        model.findOne({ revoltId: req.session.userAccountId }, (error, userAccount) => {
        if (error) {
          res.status(500).send(error);
        } else if (userAccount) {
          next();
        } else {
          res.redirect("/login")
        }
      });
    } else {
      res.redirect("/login")
    }
  }