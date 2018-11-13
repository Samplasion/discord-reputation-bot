exports.run = async (client, message, args) => {

  let data = message.author.settings

  //message.channel.startTyping()

  if(args.length < 1)
    return message.reply(`your settings for DM notifications are set to \`${data.dmEnabled ? 'ON' : 'OFF'}\``)

  let value = args[0].toUpperCase()

  if(!['ON', 'OFF'].includes(value))
    return message.reply('Invalid data for argument value. It must either be `ON` or `OFF`')

  try {
    let v = value === 'ON'
    await client.updateUserSettings(message.author.id, {dmEnabled: v})

    message.reply(`your settings for DM notifications has been updated to \`${value}\``)
  }
  catch (e) {
    console.log(e)
    return message.reply('Something went wrong while updating your settings')
  }
};

exports.cooldown = 1;
