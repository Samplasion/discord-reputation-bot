exports.run = async (client, message, args) => {

const credits = `
This bot was created by *MoonlightCapital#0554*

Want to have your own bot made entirely free of charge? Head to <https://discord.gg/8376ZVg>
`
  await message.channel.send(credits)

}
exports.cooldown = 1
