exports.run = async (client, message, args) => {
  if(message.author.id !== client.config.owner) return;

  const content = args.join(' ').replace(/client\.token/gmi, '\'Not for your eyes\'')

  try {
    let result = await eval(content)
    if (typeof result !== 'string') result = require('util').inspect(result, {
    depth: 0
    })

    if (result.includes(client.token)) result = result.replace(client.token, 'Not for your eyes')
    if (result.length > 1990) {
      console.log(result)
      result = 'Too long to be printed (content got console logged)'
    }

    message.channel.send(result, {code: 'js'})

  } catch(err) {
    console.error(err)
    err = err.toString()

    if (err.includes(client.token)) err = err.replace(client.token, 'Not for your eyes')

    return message.channel.send(err, {code: 'js'})
  }
};

exports.level = 101;
exports.cooldown = 0;
