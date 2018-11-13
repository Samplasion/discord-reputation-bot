exports.run = async (client, message, args) => {

  let user;

  if(args[0])
    user = client.getUserFromMention(args[0])
  else
    user = message.author

  if(!user)
    return message.channel.send(":no_entry_sign: I couldn't find that user")

  const {RichEmbed} = require('discord.js')

  let receivedRep = await client.Reputation.findAll({where: {target: user.id}, order: client.sequelize.literal('given_at DESC')})
  let givenRep = await client.Reputation.findAll({where: {user: user.id}})

  if(!receivedRep || !givenRep)
    return message.channel.send(":x: Couldn't get stats. Please try again later")

  let positiveRep = receivedRep.filter(e=>e.positive === true).length
  let negativeRep = receivedRep.length - positiveRep

  let givenPositiveRep = givenRep.filter(e=>e.positive === true).length
  let givenNegativeRep = givenRep.length - givenPositiveRep

  let latestGiven = receivedRep.slice(0, 5).map(e => `${e.positive ? '+' : '-'} ${e.description}`).join('\n')

  let embed = new RichEmbed()

  .setTitle(`Showing statistics for ${user.tag}`)
  .setThumbnail(user.displayAvatarURL)

  .addField(`:large_orange_diamond: Reputation received`, `:thumbsup: ${positiveRep} | :thumbsdown: ${negativeRep}`)
  .addBlankField()
  .addField(`:large_blue_diamond: Reputation given`, `:thumbsup: ${givenPositiveRep} | :thumbsdown: ${givenNegativeRep}`)

  if(latestGiven) {
    embed
    .addBlankField()
    .addField(`:five: Last five rep received`, '```diff\n'+latestGiven+'```')
  }


  message.channel.send(embed)
};
exports.cooldown = 10;
