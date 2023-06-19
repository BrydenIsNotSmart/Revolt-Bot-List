const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const Members = require("../../functions/members");
  let user = await userModel.findOne({ revoltId: req.session.userAccountId });
  if (user) {
    let userRaw = await client.users.fetch(user.revoltId);
    user.username = userRaw.username;
    user.avatar = userRaw.avatar;
  }
  const members = await Members(client, config.servers.main);
  res.render("panel/index.ejs", {
    bot: global.client ? global.client : null,
    path: req.path,
    botsdata: await botModel.find(),
    members,
    user,
    req,
  });
});

router.get("/bots", async (req, res) => {
  let user = await userModel.findOne({ revoltId: req.session.userAccountId });
  if (user) {
    let userRaw = await client.users.fetch(user.revoltId);
    user.username = userRaw.username;
    user.avatar = userRaw.avatar;
  }

  res.render("panel/bots.ejs", {
    bot: global.client ? global.client : null,
    path: req.path,
    botsdata: await botModel.find(),
    user,
    req,
  });
});

router.get("/certification", async (req, res) => {
  let user = await userModel.findOne({ revoltId: req.session.userAccountId });
  if (user) {
    let userRaw = await client.users.fetch(user.revoltId);
    user.username = userRaw.username;
    user.avatar = userRaw.avatar;
  }

  res.render("panel/certification.ejs", {
    bot: global.client ? global.client : null,
    path: req.path,
    botsdata: await botModel.find(),
    user,
    req,
  });
});

router.get("/reports", async (req, res) => {
  let user = await userModel.findOne({ revoltId: req.session.userAccountId });
  if (user) {
    let userRaw = await client.users.fetch(user.revoltId);
    user.username = userRaw.username;
    user.avatar = userRaw.avatar;
  }

  res.render("panel/reports/index.ejs", {
    bot: global.client ? global.client : null,
    path: req.path,
    reports: await reportModel.find(),
    user,
    req,
  });
});

router.get("/reports/:reporterId/:userId/:botId/:type/resolve", async (req, res) => {
  let user = await userModel.findOne({ revoltId: req.session.userAccountId });
  if (user) {
    let userRaw = await client.users.fetch(user?.revoltId);
    user.username = userRaw?.username;
    user.avatar = userRaw.avatar;
  }

  let report = await reportModel.findOne({ reporterId: req.params.reporterId, userId: req.params.userId, type: req.params.type, botId: req.params.botId, active: true });
  if (!report) res.status(404).render(
    "error.ejs", {
    user,
    code: 404,
    message: "This report couldn't be found in the database.",
  });

if (report.reporterId) {
    let reporterRaw = await client.users.fetch(report?.reporterId);
    if (!reporterRaw) return res.status(404).render(
    "error.ejs", {
    user,
    code: 404,
    message: "The reporter of this report can't be found on Revolt.",
  });
    report.reporterName = reporterRaw?.username;
    report.reporterAvatar = reporterRaw?.avatar;
} 
  res.render("panel/reports/resolve.ejs", {
    report,
    user,
    req
  })
})

router.post("/reports/resolve", async (req, res) => {
  let data = req.body;
  if(data.type == "review" || "reply") {
    let report = await reportModel.findOne({ reporterId: data.reporterId, userId: data.userId, type: data.type, botId: data.botId, active: true });
    if (!report) return res.status(404).render(
      "error.ejs", {
      user,
      code: 404,
      message: "This report couldn't be found in the database.",
   });
   report.active = false;
   report.notes = data.notes || null;
   await report.save().then(
    res.status(200).redirect("/panel/reports?success=true?message=You have successfully resolved the report.")
   )
  }
})

router.post("/bots/:id/testing", async (req, res) => {
  let bot = await botModel.findOne({ id: req.params.id });
  let client = global.client;

  if (bot.status === "approved") return res.status(400).json({ message: "This bot is already approved."});
  if (bot.status === "denied") return res.status(400).json({ message: "This bot is already denied."});
  if (bot.status === "inprogress") return res.status(400).json({ message: "This bot is already being tested."});

  if (!bot)
    return res.status(404).json({
      message: "This bot could not be found in our database.",
    });

  bot.status = "inprogress"
  bot.reviewer = req.session.userAccountId;
  await bot.save();

  selfBot.api.post(`/bots/${bot.id}/invite`, { 
    "server": config.servers.testing 
  })

  let server = client.servers.get(config.servers.testing);
   let createdChannel = await server.createChannel({
    name: `${bot.name.toLowerCase()}`,
    description: `Testing session channel to test ${bot.name}.`,
   });
  let cat = [];
  server.categories.map(d => { if (d.id === "01GX1R43Q03JF7SMBKRW71F7EF") d.channels.push(createdChannel._id); cat.push(d) });
  server.edit({ categories: cat }); 
  await client.api
      .post(`/channels/${createdChannel._id}/messages`, {
        content: `<@${req.session.userAccountId}>`,
        embeds: [
           { 
          colour: "#FF3366",
          description: `## Testing Session\nWelcome to your new testing session for <@${bot.id}>.\nYou may now begin testing this bot. Any questions? View the staff panel or ask an admin.\n\n### Prefix:\n\`${bot.prefix}\``
        }],
      })
  res.send("You may now begin to test this bot in our testing server.")
});

router.get("/bots/:id/approve", async (req, res) => {
  let bot = await botModel.findOne({ id: req.params.id });
  if (!bot || bot.deleted) return res.status(404).json({ message: "This bot could not be found on our list." });
  if (bot.status === "approved" || bot.status === "denied") return res.status(400).json({ message: "This bot has already been approved or denied." });

  let user = await userModel.findOne({ revoltId: req.session.userAccountId });
  if (user) {
    let userRaw = await client.users.fetch(user.revoltId);
    user.username = userRaw.username;
    user.avatar = userRaw.avatar;
  }

  res.render("panel/approve.ejs", {
    bot,
    user,
    req
  });
     
})

router.get("/bots/:id/deny", async (req, res) => {
  let bot = await botModel.findOne({ id: req.params.id });
  if (!bot || bot.deleted) return res.status(404).json({ message: "This bot was not found or it has been deleted" });
  if (bot.status === "approved" || bot.status === "denied") return res.status(400).json({ message: "This bot has already been approved or denied."});
  let user = await userModel.findOne({ revoltId: req.session.userAccountId });
  if (user) {
    let userRaw = await client.users.fetch(user.revoltId);
    user.username = userRaw.username;
    user.avatar = userRaw.avatar;
  }
  res.render('panel/deny.ejs', {
    bot,
    user,
    req
  });
});

router.post("/bots/:id/deny", async (req, res) => {
  let bot = await botModel.findOne({ id: req.params.id });
  if (!bot || bot.deleted) return res.status(404).json({ message: "This bot was not found or it has been deleted" });
  if (bot.status === "approved" || bot.status === "denied") return res.status(400).json({ message: "This bot has already been approved or denied."});

  bot.deniedOn = Date.now();
  bot.status = "denied";
  await bot.save().then(async () => {
    let testing = client.servers.get("01GX1QRSHEA8NE8WCGHEPN3S19");
    console.log(testing)
    let target = await testing.fetchMember(bot.id);
    console.log(target)
    let testingChannel = testing?.channels.find(c => c.name === `${bot.name.toLowerCase()}`);
    try {
      await target?.kick();
      await testingChannel?.delete();
      res.status(201).json({ message: "Successfully Denied", code: "OK" });
      let logs = client.channels.get(config.channels.weblogs);
      logs.sendMessage(
        `<\\@${bot.owners[0]}>'s bot **${bot.name}** has been **denied** by <\\@${req.session.userAccountId}>.\n<https://revoltbots.org/bots/${bot.id}>\n**Reason**: ${req.body.reason || "None provided."}`
      );
      bot.owners.forEach(async (owner) => {
        let user = await client.users.fetch(owner).catch(() => { })
        await user.openDM().then((dm) => { dm.sendMessage(`:x: Your bot **${bot.name}** has been **denied** on RevoltBots.org!\n**Reviewer**: <@${bot.reviewer}>\n**Reason**: ${req.body.reason || "None provided."}`) }).catch(() => { return });
      })
      } catch(err) {
        console.error(err);
      }
  })
})

router.post("/bots/:id/approve", async (req, res) => {
 let bot = await botModel.findOne({ id: req.params.id });
  if (!bot || bot.deleted) return res.status(404).json({ message: "This bot could not be found on our list." });
  if (bot.status === "approved" || bot.status === "denied") return res.status(400).json({ message: "This bot has already been approved or denied." });
  bot.approvedOn = Date.now();
  bot.status = "approved";
  await bot.save().then(async () => {
    let testing = client.servers.get(config.servers.testing);
    let testingBot = await testing.fetchMember(bot.id);
    let testingChannel = testing.channels.find(c => c.name === `${bot.name.toLowerCase()}`);
    try {
      await testingBot.kick();
      await testingChannel.delete();
      selfBot.api.post(`/bots/${bot.id}/invite`, { 
        "server": config.servers.main 
      })
    res.status(201).json({ message: "Successfully Approved", code: "OK" });
    let logs = client.channels.get(config.channels.weblogs);
    logs.sendMessage(
      `<\\@${bot.owners[0]}>'s bot **${bot.name}** has been **approved** by <\\@${req.session.userAccountId}>.\n<https://revoltbots.org/bots/${bot.id}>`
    );

      bot.owners.forEach(async (owner) => {
        const roles = [];
        let user = await client.users.fetch(owner).catch(() => { })
        await client.api.get(`/servers/${config.servers.main}/members/${owner}`).then(async (data) => {
          if (data.roles) data.roles.map(e => roles.push(e));
          roles.push(config.roles.developer); 
          await sleep(700)
          await client.api.patch(`/servers/${config.servers.main}/members/${owner}`, { "roles": roles }).catch(() => { return res.status(400).json({ message: `Unable to add role to this user.` }) });
        });
        await user?.openDM().then((dm) => { dm.sendMessage(`:white_check_mark: Your bot **${bot.name}** has been **approved** on RevoltBots.org!\n**Reviewer**: <@${bot.reviewer}>\n**Feedback**: ${req.body.feedback || "None provided."}`) }).catch(() => { return });
    })
    } catch(err) {
      console.error(err);
    }
  })
})

router.get("/badges", checkAdmin, async (req, res) => {
  let user = await userModel.findOne({ revoltId: req.session.userAccountId });
  if (user) {
    let userRaw = await client.users.fetch(user.revoltId);
    user.username = userRaw.username;
    user.avatar = userRaw.avatar;
  }

  res.render("panel/badges.ejs", {
    bot: global.client ? global.client : null,
    path: req.path,
    user,
    req,
  });
});

router.post("/badges/add", async (req, res) => {
  let user = await userModel.findOne({ revoltId: req.body.userId });
  if (!user) return res.status(404).json({ message: "User was not found within database." });

  const roles = [];
  if (req.body.badge === "staff") {
    if (user.isStaff) return res.status(400).json({ message: "User is already staff." });
    user.updateOne({ isStaff: true });
    client.api.get(`/servers/${config.servers.main}/members/${req.body.userId}`);
    await client.api.get(`/servers/${config.servers.main}/members/${req.body.userId}`).then(async (data) => {
      if (data.roles) data.roles.map(e => roles.push(e));
      roles.push(config.roles.staff);
      await sleep(700)
      await client.api.patch(`/servers/${config.servers.main}/members/${req.body.userId}`, { "roles": roles }).catch(() => { return res.status(400).json({ message: `Unable to add role to this user but I added them as a ${req.body.badge}.` }) });
    });
  } else if (req.body.badge === "partner") {
    if (user.badges.includes("partner")) return res.status(400).json({ message: "User is already a partner." });
    user.badges.push("partner");
    await client.api.get(`/servers/${config.servers.main}/members/${req.body.userId}`).then(async (data) => {
      if (data.roles) data.roles.map(e => roles.push(e));
      roles.push(config.roles.partner);
      await sleep(700)
      await client.api.patch(`/servers/${config.servers.main}/members/${req.body.userId}`, { "roles": roles }).catch(() => { return res.status(400).json({ message: `Unable to add role to this user but I added them as a ${req.body.badge}.` }) });
    });
  } else if (req.body.badge === "contributor") {
    if (user.badges.includes("contributor")) return res.status(400).json({ message: "User is already a contributor." });
    user.badges.push("contributor");
    await client.api.get(`/servers/${config.servers.main}/members/${req.body.userId}`).then(async (data) => {
      if (data.roles) data.roles.map(e => roles.push(e));
      roles.push(config.roles.contributor);
      await sleep(700)
      await client.api.patch(`/servers/${config.servers.main}/members/${req.body.userId}`, { "roles": roles }).catch(() => { return res.status(400).json({ message: `Unable to add role to this user but I added them as a ${req.body.badge}.` }) });
    });
  }

  user.save().then(() => {
    res.status(201).json({ message: `Successfully added badge ${req.body.badge} to user.` });
  });
});

router.post("/badges/remove", async (req, res) => {
  let user = await userModel.findOne({ revoltId: req.body.userId });
  if (!user) return res.status(404).json({ message: "User was not found within database." });

  const roles = [];
  if (req.body.badge === "staff") {
    if (!user.isStaff) return res.status(400).json({ message: "User is not staff." });
    user.updateOne({ isStaff: false });
    await client.api.get(`/servers/${config.servers.main}/members/${req.body.userId}`).then(async (res) => {
      res.roles.filter(e => e != config.roles.staff).map(e => roles.push(e));
      await sleep(700);
      await client.api.patch(`/servers/${config.servers.main}/members/${req.body.userId}`, { "roles": roles }).catch(() => { return res.status(400).json({ message: `Unable to add role to this user but I added them as a ${req.body.badge}.` }) });
    });
  } else if (req.body.badge === "partner") {
    if (!user.badges.includes("partner")) return res.status(400).json({ message: "User is not a partner." });
    user.badges.filter(object => object != req.body.badge);
    await client.api.get(`/servers/${config.servers.main}/members/${req.body.userId}`).then(async (res) => {
      res.roles.filter(e => e != config.roles.partner).map(e => roles.push(e));
      await sleep(700);
      await client.api.patch(`/servers/${config.servers.main}/members/${req.body.userId}`, { "roles": roles }).catch(() => { return res.status(400).json({ message: `Unable to add role to this user but I added them as a ${req.body.badge}.` }) });
    });
  } else if (req.body.badge === "contributor") {
    if (!user.badges.includes("contributor")) return res.status(400).json({ message: "User is not a contributor." });
    user.badges.filter(object => object != req.body.badge);
    await client.api.get(`/servers/${config.servers.main}/members/${req.body.userId}`).then(async (res) => {
      res.roles.filter(e => e != config.roles.contributor).map(e => roles.push(e));
      await sleep(700);
      await client.api.patch(`/servers/${config.servers.main}/members/${req.body.userId}`, { "roles": roles }).catch(() => { return res.status(400).json({ message: `Unable to add role to this user but I added them as a ${req.body.badge}.` }) });
    });
  }

  user.save().then(() => {
    res.status(201).json({ message: `Successfully removed badge ${req.body.badge} to user.` });
  });
});

router.get("/certification/:id/approve", async (req, res) => {
  let bot = await botModel.findOne({ id: req.params.id });
  if (!bot || bot.deleted) return res.status(404).json({ message: "This bot could not be found on our list." });
  if (!bot.certifyApplied) return res.status(400).json({ message: "This bot has already been denied for certification." });

  let user = await userModel.findOne({ revoltId: req.session.userAccountId });
  if (user) {
    let userRaw = await client.users.fetch(user.revoltId);
    user.username = userRaw.username;
    user.avatar = userRaw.avatar;
  }

  res.render("panel/certifyApprove.ejs", {
    bot,
    user,
    req
  });

})

router.get("/certification/:id/deny", async (req, res) => {
  let bot = await botModel.findOne({ id: req.params.id });
  if (!bot || bot.deleted) return res.status(404).json({ message: "This bot was not found or it has been deleted" });
  if (!bot.certifyApplied) return res.status(400).json({ message: "This bot has already been denied for certification." });

  let user = await userModel.findOne({ revoltId: req.session.userAccountId });
  if (user) {
    let userRaw = await client.users.fetch(user.revoltId);
    user.username = userRaw.username;
    user.avatar = userRaw.avatar;
  }
  res.render('panel/certifyDeny.ejs', {
    bot,
    user,
    req
  });
});

router.post("/certification/:id/deny", async (req, res) => {
  let bot = await botModel.findOne({ id: req.params.id });
  if (!bot || bot.deleted) return res.status(404).json({ message: "This bot was not found or it has been deleted" });
  if (!bot.certifyApplied) return res.status(400).json({ message: "This bot has already been denied for certification." });

  bot.updateOne({ certifyApplied: false })
  await bot.save().then(async () => {
    try {
      res.status(201).json({ message: "Successfully Denied Certification", code: "OK" });
      let logs = client.channels.get(config.channels.weblogs);
      logs.sendMessage(
        `<\\@${bot.owners[0]}>'s bot **${bot.name}** has been **denied** for **certification** by <\\@${req.session.userAccountId}>.\n<https://revoltbots.org/bots/${bot.id}>\n**Reason**: ${req.body.reason || "None provided."}`
      );

      bot.owners.forEach(async (owner) => {
        let user = await client.users.fetch(owner).catch(() => { })
        await user?.openDM().then((dm) => { dm.sendMessage(`:x: Your bot **${bot.name}** has been **denied** for **certification** on RevoltBots.org!\n**Reviewer**: <@${req.session.userAccountId}>\n**Reason**: ${req.body.reason || "None provided."}`) }).catch(() => { return });
      })
    } catch (err) {
      console.error(err);
    }
  })
})

router.post("/certification/:id/approve", async (req, res) => {
  let bot = await botModel.findOne({ id: req.params.id });
  if (!bot || bot.deleted) return res.status(404).json({ message: "This bot could not be found on our list." });
  if (!bot.certifyApplied) return res.status(400).json({ message: "This bot has already been denied for certification." });

  bot.certified = true;
  bot.certifyApplied = false;
  await bot.save().then(async () => {
    try {
      res.status(201).json({ message: "Successfully Approved Certification", code: "OK" });
      let logs = client.channels.get(config.channels.weblogs);
      logs.sendMessage(
        `<\\@${bot.owners[0]}>'s bot **${bot.name}** has been **certified** by <\\@${req.session.userAccountId}>.\n<https://revoltbots.org/bots/${bot.id}>`
      );

      bot.owners.forEach(async (owner) => {
        const roles = [];
        let useDb = await userModel.findOne({ revoltId: owner });
        useDb.badges.push("certified"); //certified user :hmm: do you mean Certified Developer?
        useDb.save();
        let user = await client.users.fetch(owner).catch(() => { })
        await user?.openDM().then((dm) => { dm.sendMessage(`:white_check_mark: Your bot **${bot.name}** has been **certified** on RevoltBots.org!\n**Reviewer**: <@${req.session.userAccountId}>\n**Feedback**: ${req.body.feedback || "None provided."}`) }).catch(() => { return });

        await client.api.get(`/servers/${config.servers.main}/members/${owner}`).then(async (data) => {
          if (data.roles) data.roles.map(e => roles.push(e));
          roles.push(config.roles.certified);
          await sleep(700)
          await client.api.patch(`/servers/${config.servers.main}/members/${owner}`, { "roles": roles }).catch(() => { });
        });
      });

      await sleep(700)

      await client.api.get(`/servers/${config.servers.main}/members/${req.params.id}`).then(async (data) => {
        const roles2 = [];
        if (data.roles) data.roles.map(e => roles2.push(e));
        roles2.push(config.roles.botCertified);
        await sleep(700)
        await client.api.patch(`/servers/${config.servers.main}/members/${req.params.id}`, { "roles": roles2 }).catch(() => { res.status(400).json({ message: `Unable to add role to this user but I certified the user and bot. (p2)` }) });
      });

    } catch (err) {
      console.error(err);
    }
  })
})

router.get("/certification/:id/certifyDelete", checkAdmin, async (req, res) => {
  let bot = await botModel.findOne({ id: req.params.id });
  if (!bot || bot.deleted) return res.status(404).json({ message: "This bot was not found or it has been deleted" });
  if (!bot.certified) return res.status(400).json({ message: "This bot has isn't certification." });

  let user = await userModel.findOne({ revoltId: req.session.userAccountId });
  if (user) {
    let userRaw = await client.users.fetch(user.revoltId);
    user.username = userRaw.username;
    user.avatar = userRaw.avatar;
  }
  res.render('panel/certifyDelete.ejs', {
    bot,
    user,
    req
  });
});

router.post("/certification/:id/certifyDelete", checkAdmin, async (req, res) => {
  let bot = await botModel.findOne({ id: req.params.id });
  if (!bot || bot?.deleted) return res.status(404).json({ message: "This bot was not found or it has been deleted" });
  if (!bot?.certified) return res.status(400).json({ message: "This bot has isn't certification." });

  bot.certified = false;
  await bot.save().then(async () => {
    try {
      res.status(201).json({ message: "Successfully Deleted Certification", code: "OK" });
      let logs = client.channels.get(config.channels.weblogs);
      logs.sendMessage(
        `<\\@${bot.owners[0]}>'s bot **${bot.name}** **certification** was **deleted**  by <\\@${req.session.userAccountId}>.\n<https://revoltbots.org/bots/${bot.id}>\n**Reason**: ${req.body.reason || "None provided."}`
      );

      bot.owners.forEach(async (owner) => {
        const userDb = await userModel.findOne({ revoltId: owner })
        if (userDb && userDb.badges) {
          userDb.badges = userDb.badges.filter(e => e !== "certified");
          userDb.save();
        }
        let user = await client.users.fetch(owner).catch(() => { })
        await user?.openDM().then((dm) => { dm.sendMessage(`:x: Your bot **${bot.name}**'s **certification** was **deleted** on RevoltBots.org!\n**Reviewer**: <@${req.session.userAccountId}>\n**Reason**: ${req.body.reason || "None provided."}`) }).catch(() => { return });
      })
    } catch (err) {
      console.error(err);
    }
  })
})

router.get("/grass", async (req, res) => {
  return res.status(200).json({ message: "Touch some grass, kid." })
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function checkAdmin(req, res, next) {
  if (req.session.userAccountId) {
    userModel.findOne(
      { revoltId: req.session.userAccountId },
      async (error, userAccount) => {
        if (error) {
          res.status(500).render(
            "error.ejs", {
            user,
            code: 500,
            message: error,
          }
        )
        } else if (userAccount) {
          if (userAccount.isAdmin) {
            next();
          } else {
            let user = userAccount;
            if (user) {
              let userRaw = await client.users.fetch(user.revoltId);
              user.username = userRaw.username;
              user.avatar = userRaw.avatar;
            }
            res.status(403).render(
              "error.ejs", {
              user,
              code: 403,
              message: "You are not authorized to view this page at this time.",
            }
            )
          }
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
