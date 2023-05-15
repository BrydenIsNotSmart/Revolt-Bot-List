module.exports = {
  name: "member/join",
  async execute(member) {
    if (member._id.server === config.servers.main) {
      if (!member.user.bot) {
        member.edit({ roles: [`${config.roles.members}`] });
      } else {
        member.edit({ roles: [`${config.roles.bots}`] });
      }
    } else if (member._id.server === config.servers.testing) {
      if (member.user.bot) {
        member.edit({ roles: [`${config.roles.botsintesting}`] });
      }
    }
  },
};
