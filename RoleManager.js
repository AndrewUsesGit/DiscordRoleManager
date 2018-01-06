const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

var roles = [];

client.on('ready', (e) => {
  console.log('Discord Bot is up and ready!');
});

client.on('message', message => {

    var args = message.content.split(' ');

    if (!message.content.startsWith(config.prefix)) return;

    if(message.content.startsWith(config.prefix + 'add role'){
        for (var i = 2, i < args.length; i++){
            roles.push(args[i]);
        }
    }
    else if(message.content.startsWith(config.prefix + 'remove role'){
        for (var i = 2, i < args.length; i++){
            roles.push(args[i]);
        }
    }

});

client.login(config.key);
