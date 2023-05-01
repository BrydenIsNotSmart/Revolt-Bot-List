async function Members(client, server) {
  if (typeof client !== "object")
    return {
      error: true,
      msg: "First argument isn't available or a valid client!",
    };
  if (typeof server !== "string")
    return {
      error: true,
      msg: "Second argument isn't available or a valid serverID string!",
    };

  try {
    const member = await client.api.get(`/servers/${server}/members`);
    return {
      error: false,
      users: member.users,
      members: member.members,
    };
  } catch {
    return {
      error: true,
      msg: "Unknown Server",
    };
  }
}

module.exports = Members;
