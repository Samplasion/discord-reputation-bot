module.exports = async (client, reaction, user) => {
  let message = reaction.message;
  if (message.channel.id !== client.config.lftChannel) return;
  if (message.author.id === user.id) return reaction.remove();
  if (reaction.emoji.name !== "✅") return;
  
  let messager = message.member,
      reacter = await message.guild.fetchMember(user.id);
  
  messager.setVoiceChannel(client.config.lftVC)
  reacter.setVoiceChannel(client.config.lftVC)
}
