
module.exports = {
  name: "ready",
  async execute(client) {
    console.info(`[INFO] ${client.user.username} is logged in and ready.`);
    global.ServerClient = client;
    client.users.edit({
      status: {
        text: "Watching de serverlist",
        presence: "Focus",
      },
    });
  },
};
