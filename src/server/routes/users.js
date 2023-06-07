const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.send("Hello World");
});

router.get("/:id", async (req, res) => {
  let id = req.params.id;

  try {
    let fetcheduser = await client.users.fetch(id);
    if (!fetcheduser) {
      let user = await userModel.findOne({ revoltId: req.session.userAccountId });
      if (user) {
        let userRaw = await client.users.fetch(user.revoltId);
        user.username = userRaw.username;
        user.avatar = userRaw.avatar;
      }
      return res.render("error.ejs", {
        user,
        code: 404,
        message: "This user could not be found on Revolt, might be due to the bot's cache.",
      })
    }
  } catch (err) {
    let user = await userModel.findOne({ revoltId: req.session.userAccountId });
    if (user) {
      let userRaw = await client.users.fetch(user.revoltId);
      user.username = userRaw.username; 
      user.avatar = userRaw.avatar;
    }
    return res.render("error.ejs", {
      user,
      code: 404,
      message: "This user could not be found on Revolt, might be due to the bot's cache."
    })
  }

  let fetched_user = await userModel.findOne({ revoltId: id });
  if (!fetched_user) fetched_user = await userModel.create({
    revoltId: id,
    verified: false,
    createdAt: Date.now(),
  })
  if (fetched_user) {
    try {
      let userRaw = await client.users.fetch(fetched_user.revoltId);
      fetched_user.name = userRaw.username;
      fetched_user.avatar = userRaw.avatar;
      fetched_user.submittedOn = userRaw.submittedOn;
      const marked = require("marked");
      const description = marked.parse(fetched_user.description);
      fetched_user.description = description;
      if (!fetched_user.bio) fetched_user.bio = "This user does not have a bio.";
    } catch (err) {
      res.render("error.ejs", {
        user,
        code: 404,
        message: err.message
      })
    }
  }

  let bots = await botModel.find({ owners: { $all: [id] } });

  let user = await userModel.findOne({ revoltId: req.session.userAccountId });
  if (user) {
    let userRaw = await client.users.fetch(user.revoltId);
    user.username = userRaw.username;
    user.avatar = userRaw.avatar;
  }
  res.render("users/user.ejs", { fetched_user, user, bots });
});

router.get("/:id/edit", checkAuth, async (req, res) => {
  if (!req.params.id === req.session.userAccountId) return res.status(403).json({ message: "You are not authorized to perform this action." });
  let user = await userModel.findOne({ revoltId: req.session.userAccountId });
  if (user) {
    let userRaw = await client.users.fetch(user.revoltId);
    user.username = userRaw.username;
    user.avatar = userRaw.avatar;
  }
  res.render("users/edit.ejs", { user });
})

router.post("/:id/edit", checkAuth, async (req, res) => {
  if (!req.params.id === req.session.userAccountId) return res.status(403).json({ message: "You are not authorized to perform this action." });
  const data = req.body;
  if (!data) return res.status(400).json("No data was changed within your profile!");

  const user = await userModel.findOne({ revoltId: req.session.userAccountId });
  user.bio = data.bio || null;
  user.description = data.desc || null;
  user.website = data.website || null;
  user.github = data.github || null;
  user.twitter = data.twitter || null;
  // user.truth = data.social || null; :trol:
  await user.save().then(async () => {
    res.status(201).redirect(`/users/${req.session.userAccountId}?message=Success`)
    let logs = client.channels.get(config.channels.weblogs);
    logs.sendMessage(
      `<\\@${req.session.userAccountId}> edited their profile.\n<https://revoltbots.org/users/${req.session.userAccountId}>`
    );
  });
});

function checkAuth(req, res, next) {
  if (req.session.userAccountId) {
    userModel.findOne(
      { revoltId: req.session.userAccountId },
      (error, userAccount) => {
        if (error) {
          res.status(500).send(error);
        } else if (userAccount) {
          next();
        } else {
          res.redirect("/login");
        }
      }
    );
  } else {
    res.redirect("/login");
  }
}

module.exports = router;
