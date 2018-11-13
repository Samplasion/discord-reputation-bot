exports.run = async (client, message, args) => {

const p = client.config.prefix

const helpString = `
\`\`\`asciidoc
== User commands ==
${p}help :: Shows this message
${p}ping :: Pings the bot
${p}credits :: Shows credits about the bot
${p}rep <user> (+|-) <description> :: Gives a positive or negative reputation point to the user
${p}stats [user] :: Shows statistics about a specific user, or yourself if none is set
${p}dmnotifications [(ON|OFF)] :: Sets your preference to receive notifications in DMs

== Admin commands ==
${p}nuke <user> :: Deletes all experience given or received by the user

== Bot owner commands ==
${p}eval [code] :: Evalutates JavaScript code. Use with caution
${p}reload <command> :: Reloads a command
${p}shutdown :: Shuts the bot down
\`\`\`
`

message.channel.send(helpString)

}
exports.cooldown = 2;
