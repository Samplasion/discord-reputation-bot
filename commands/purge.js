exports.run = async (client, message, args) => {

  message.delete(1000)

  if(!message.member.hasPermission('MANAGE_MESSAGES'))
    return message.channel.send(':no_entry_sign: You are not allowed to delete messages').then(m=>m.delete(10000))

  const messages = await message.channel.fetchMessages({
    limit: 100,
  })

  try {
    const query = await message.channel.bulkDelete(messages, true)
    await message.channel.send(`:white_check_mark: cleared \`${query.size}\` messages from this channel`).then(m=>m.delete(10000))
  } catch(e) {
    message.channel.send(':x: Something went wrong while deleting the messages').then(m=>m.delete(10000))
  }
}
