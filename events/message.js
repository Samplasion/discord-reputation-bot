module.exports = async (client, message) => {

  if (!message.content.startsWith(client.config.prefix)) return
  if (message.author.bot) return

  const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g)
  const command = args.shift().toLowerCase()

  if(client.cooldowns.has(`${message.author.id}-${command}`))
    return message.channel.send(':stopwatch: You\'re on cooldown. Please try again later')

  const cmd = client.commands.get(command)
  if (!cmd) return;

  let maor = await client.getUserSettings(message.author.id)
  message.author.settings = maor

  try {
    if(client.config.enableCooldowns === true) {
      client.cooldowns.add(`${message.author.id}-${command}`)
      setTimeout(()=>{client.cooldowns.delete(`${message.author.id}-${command}`)},cmd.cooldown*1000)
    }
    await cmd.run(client, message, args)
  }
  catch (error) {
    console.error(error)
    message.channel.send(':x: Something went wrong while executing the command').catch(console.error)
  }
};
