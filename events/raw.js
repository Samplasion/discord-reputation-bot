module.exports = async (client, packet) => {
// We don't want this to run on unrelated packets
   if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
   // Grab the channel to check the message from
   const channel = client.channels.get(packet.d.channel_id);
   // There's no need to emit if the message is cached, because the event will fire anyway for that
   if (channel.messages.has(packet.d.message_id)) return;
   // Since we have confirmed the message is not cached, let's fetch it
   channel.fetchMessage(packet.d.message_id).then(async message => {
       // Emojis can have identifiers of name:id format, so we have to account for that case as well
       const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
       // This gives us the reaction we need to emit the event properly, in top of the message object
       const reaction = message.reactions.get(emoji);
       // Check which type of event it is before emitting
       if (packet.t === 'MESSAGE_REACTION_ADD') {
           client.emit('messageReactionAdd', reaction, await client.fetchUser(packet.d.user_id), message);
       }
       if (packet.t === 'MESSAGE_REACTION_REMOVE') {
           client.emit('messageReactionRemove', reaction, await client.fetchUser(packet.d.user_id), message);
       }
   });
}
