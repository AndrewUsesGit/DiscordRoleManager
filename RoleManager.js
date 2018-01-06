const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

client.on('ready', (e) => {
  console.log('Hello World');
});

client.on('message', message => {

  if (!message.content.startsWith(config.prefix)) return;

  if(message.content === config.prefix + 'hello'){
    message.channel.send('Salutations ' + message.author.username + '!');
  }
});

client.login(config.key);
