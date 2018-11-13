const Discord = require('discord.js');
const {config} = require('./config.js');
const client = new Discord.Client();
const fs = require('fs');

client.config = config;
client.dversion = Discord.version;
client.cooldowns = new Set();

client.Sequelize = require('sequelize');
client.sequelize = new client.Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    operatorsAliases: false,
    // SQLite only
    storage: 'database.sqlite',
});


//let's start setting up tables, then

client.Reputation = client.sequelize.define('rep', {
    user: client.Sequelize.STRING,
    target: client.Sequelize.STRING,
    description: client.Sequelize.TEXT,
    positive: client.Sequelize.BOOLEAN,
    given_at: client.Sequelize.NOW
});

client.userSettings = client.sequelize.define('settings', {
  user: {
    type: client.Sequelize.STRING,
    unique: true
  },
  dmEnabled: client.Sequelize.BOOLEAN
})

//well, ugh

client.getUserFromMention = mention => {
    if (!mention) return;

    if (mention.startsWith('<@') && mention.endsWith('>')) {
        mention = mention.slice(2, -1);

        if (mention.startsWith('!')) {
            mention = mention.slice(1);
        }


    }

    return client.users.get(mention);
}

client.logAction = async message => {
  let channel = client.channels.get(client.config.logChannel)
  if(!channel) return console.log('Tried to log an action, but log channel could not be found');

  channel.send(message)
}

client.escapeMD = text => {
  return text.replace(/(\*|_|`)/gm, '')
}

client.getUserSettings = async user => {
  let data = await client.userSettings.findOne({ where: { user: user } });

  if(!data) {
    let data = await client.userSettings.create({
      user: user,
      dmEnabled: false
    })
  }

  return data;
}

client.updateUserSettings = async (user, settings) => {
  let data = await client.userSettings.update(settings, { where: { user: user } });
  return data;
}

//taken from an idiot's guide

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./events/${file}`)];
  });
});

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    client.commands.set(commandName, command);
}

client.login(config.token)
