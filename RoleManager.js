const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

client.on('ready', (e) => {
  console.log('Discord Bot is up and ready!');
});

function ModifyUserRoles(message, roles, doIAdd){
  function VerifyRoles(guild){
    var goodToGo = [];
    roles.forEach(function(currentValue, currentIndex){
      var exists = guild.roles.find("name", currentValue);
      if(exists != null){
        goodToGo.push(currentValue);
      }
    });
    return goodToGo;
  }

  //returns list of roles still to be added/removed
  function VerifyUserRoles(user, guild, addOrRemove){
    var goodToAdd = [];
    var goodToRemove = [];
    roles.forEach(function(currentValue, currentIndex){
      if(!user.roles.has(guild.roles.find("name", currentValue).id)){
        goodToAdd.push(currentValue);
      }else{
        goodToRemove.push(currentValue);
      }
    });

    if(addOrRemove){
      return goodToAdd;
    }
    return goodToRemove;
  }

  function AddRoleToUser(user, guild){
    if (roles.length > 0){
      roles.forEach(function(currentValue){
        user.addRole(guild.roles.find("name", currentValue)).catch(console.error());
      });
      return true;
    }
    return false;
  }

  function RemoveRoleFromUser(user, guild){
    if (roles.length > 0){
      roles.forEach(function(currentValue){
        user.removeRole(guild.roles.find("name", currentValue)).catch(console.error());
      });
      return true;
    }
    return false;
  }

  roles = VerifyRoles(message.guild);
  roles = VerifyUserRoles(message.member, message.guild, doIAdd);
  if(doIAdd){
    if(AddRoleToUser(message.member, message.guild)){
      message.channel.send("Successfully added " + roles.length + " roles for " + message.member);
    }
  }else{
    if(RemoveRoleFromUser(message.member, message.guild)){
      message.channel.send("Successfully removed " + roles.length + " roles for " + message.member);
    }
  }
}

client.on('message', message => {

    var args = message.content.toLowerCase().split(' ');//Message is now parsed into all lowercase segments
    if (!message.content.startsWith(config.prefix)) return;

    //Must be the id for the role-assignment-channel
    if (message.content.startsWith(config.prefix + 'add role') && (message.channel.id === config.roleChannel)){
        var roles = [];
        for (var i = 2; i < args.length; i++){
            roles.push(args[i]);
        }
        ModifyUserRoles(message, roles, true);
    }
    else if(message.content.startsWith(config.prefix + 'remove role') && (message.channel.id === config.roleChannel)){
        var roles = [];
        for (var i = 2; i < args.length; i++){
            roles.push(args[i]);
        }
        ModifyUserRoles(message, roles, false);
    }
});

client.login(config.key);
