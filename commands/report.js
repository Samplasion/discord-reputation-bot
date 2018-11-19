exports.run = async (client, message, args) => {

  await message.delete(1000)

  const formlink = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'

  const {RichEmbed} = require('discord.js')

  const embed = new RichEmbed()
  .setDescription(`To complete this report please fill [this form](${formlink})!`)
  .setColor(0xF5A623)

  try {
    await message.author.send(embed)
  } catch(e) {
    if(e.name === 'DiscordAPIError')
      message.channel.send(':x: Whoops! I cannot send you a Direct Message. Make sure you are allowed to receive them in this server').then(m=>m.delete(10000))
    else {
      console.error(e)
    }
  }

}
exports.cooldown = 5;
