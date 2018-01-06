const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

client.on('ready', (e) => {
  console.log('Discord Bot is up and ready!');
});

client.on('message', message => {

    var args = message.content.split(' ');
    if (!message.content.startsWith(config.prefix)) return;

    if (message.content.startsWith(config.prefix + 'add role')){
        var roles = [];
        for (var i = 2; i < args.length; i++){
            roles.push(args[i]);
        }
        message.channel.send(roles.length);
    }
    else if(message.content.startsWith(config.prefix + 'remove role')){
        var roles = [];
        for (var i = 2; i < args.length; i++){
            roles.push(args[i]);
        }
        message.channel.send(roles.length);
    }

});

client.login(config.key);
