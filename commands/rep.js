exports.run = async (client, message, args) => {

  const user = client.getUserFromMention(args[0])

  if(!user)
    return message.channel.send(":no_entry_sign: I couldn't find that user")

  if(user.id === message.author.id) {
    message.channel.send(':no_entry_sign: Cannot give reputation to yourself')
    return client.logAction(`:x: ${message.author.tag} \`${message.author.id}\` tried to give reputation to themselves`)
  }


  let query = await client.Reputation.findOne({where: {target: user.id, user: message.author.id}, order: client.sequelize.literal('given_at DESC')})
  if(query) {
    const ms = require('ms')

    let delta = Date.now() - query.given_at
    if(delta < 86400 * 1000)
      return message.channel.send(`:warning: You already gave reputation to this user less than 24 hours ago. Please wait ${ms(86400000-delta, {long:true})} before giving reputation to this user again`)
  }

  let pos = args[1]

  if(!['+', '-'].includes(pos))
    return message.channel.send(':warning: Invalid type for second parameter. Please use `+` or `-` for positive and negative respectively')

  pos = pos === '+'

  let desc = args.slice(2).join(' ')

  if(desc.length < 1 || desc.length > 200)
    return message.channel.send(':warning: Description should be between 1 and 200 characters')

  desc = client.escapeMD(desc)

  try {
    const rep = await client.Reputation.create({
        user: message.author.id,
        target: user.id,
        description: desc,
        positive: pos,
        given_at: Date.now()
    });

    message.channel.send(`:ballot_box_with_check: Given a reputation point to ${user.tag}`);
    client.logAction(`:radio_button: ${client.escapeMD(message.author.tag)} \`${message.author.id}\` gave ${pos ? 'positive' : 'negative'} reputation to ${client.escapeMD(user.tag)} \`${user.id}\`: *${desc}*`)
  }
  catch (e) {
    return message.channel.send(':x: Something went wrong while giving reputation to the user');
  }

  let targetSettings = await client.getUserSettings(user.id)

  if(targetSettings.dmEnabled && pos) {

    const {RichEmbed} = require('discord.js');

    let embed = new RichEmbed()
    .setTitle(':tada: You received a reputation point')
    .setColor(0x7ED321)
    .setDescription(`**${client.escapeMD(message.author.tag)}**: \n\`\`\`diff\n+ ${desc} \`\`\``)

    .setFooter(`You are receiving this message because you set DM notifications to on. You can unsubscribe at any time by using ${client.config.prefix}dmnotifications OFF`)
    user.send(embed).catch(console.error)
  }
};

exports.cooldown = 30;
