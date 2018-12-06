exports.run = async (client, message, args) => {

  if(message.channel.id !== client.config.lftChannel)
    return message.channel.send(`:warning: This command can only be used in the <#${client.config.lftChannel}> channel`)
      .then(m=>{m.delete(10000); message.delete(10000)})

  const {RichEmbed} = require('discord.js')

  const embed = new RichEmbed()
  .setTitle(`${message.author.tag} is looking for a teammate!`)
  .setFooter('React with ✅ to join the party')
  .setColor(0x7ED321)

  await message.channel.send(embed).then(m=>m.react('✅')).catch(console.error)

}
exports.cooldown = 1; //REMEMBER TO SET IT TO 100 FOR PRODUCTION
