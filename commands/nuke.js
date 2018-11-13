exports.run = async (client, message, args) => {

  if(!message.member.hasPermission('ADMINISTRATOR'))
    return message.channel.send(":no_entry_sign: You don't have permission to run this command")

  let user = client.getUserFromMention(args[0]) || args[0]

  if(!user)
    return message.channel.send(':no_entry_sign: Invalid user')

  if(user.id)
    user = user.id

  const reps = await client.Reputation.findOne({
    where: {
        user: user
    }
  })

  if(!reps)
    return message.channel.send(':warning: No data found for this user')

  await message.channel.send(':interrobang: This will delete all reputation received or given by the user. **This action is irreversible**. Please confirm the operation by typing `confirm` or `cancel`')

  const filter = m => m.author.id == message.author.id && ['confirm', 'cancel'].includes(m.content)
  message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
    .then(async collected => {
      let msg = collected.first()

      if(msg.content == 'confirm') {
        try {
          await client.Reputation.destroy({where: {user: user}})
          await client.Reputation.destroy({where: {target: user}})

          message.channel.send(':wastebasket: All the reputtion given to or received by the user has been deleted')
          client.logAction(`:bomb: ${message.author.tag} \`${message.author.id}\` nuked ${user}`)
        } catch(e) {
          message.channel.send(':x: Something went wrong. Please try again later')
          console.error(e)
        }
      } else {
        message.channel.send(':diamond_shape_with_a_dot_inside: Operation cancelled')
      }

    })
    .catch(collected => message.channel.send(':warning: No input given in 30 seconds. Operation aborted'));
}

exports.cooldown = 15;
