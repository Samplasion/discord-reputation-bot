//shutdown command
//exits the bot process, useful when debugging

exports.run = async (client, message, args) => {
  if(message.author.id !== client.config.owner) return;

  await message.channel.send('Shutting down...');

  process.exit();
}
exports.cooldown = 0;
