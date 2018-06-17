const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

client.on('ready', (e) => {
  console.log('Discord Bot is up and ready!');
});
//message = message object, roles = string array, doIAdd = bool
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

//message = message object, rolesAlreadyHad = bool
function CheckUserRoles(message, rolesAlreadyHad){
  //rolesToPrint = sting array
  function PrintRoles(rolesToPrint){
    rolesToPrint.forEach(function(currentValue, currentIndex){
      printMessage += '\n\t\t' + currentValue;
    });
    message.channel.send(printMessage);
  }

  var notHad = [];
  var had = [];
  var rolesObject = message.guild.roles;
  var roles = [];
  rolesObject.forEach(function(currentValue, currentIndex){
    roles.push(currentValue.name);
  });

  var badRoles = config.ignoreRoles;
  badRoles.forEach(function(currentValue, currentIndex){
    var index = roles.indexOf(currentValue);
    if (index !== -1) roles.splice(index, 1);
  });

  roles.forEach(function(currentValue, currentIndex){
    if(!message.member.roles.has(message.guild.roles.find("name", currentValue).id)){
      notHad.push(currentValue);
    }else{
      had.push(currentValue);
    }
  });

  var printMessage = '';
  if (rolesAlreadyHad){
    printMessage += message.member + ', you can remove these roles:'
    PrintRoles(had);
  }else{
    printMessage += message.member + ', you can add these roles:'
    PrintRoles(notHad);
  }
}

client.on('message', message => {
    if (message.channel.id === config.rulesChannel){
      if (message.content === "!understood"){
        message.member.addRole(message.guild.roles.find("name", "citizen")).catch(console.error());
      }
      if (!message.member.roles.has(message.guild.roles.find("name", "Mods").id)){
        message.delete().catch(x => {});
      }
    }else if (message.channel.id === config.roleChannel){
      if (!message.content.startsWith(config.prefix)) return;
      var args = message.content.toLowerCase().split(' ');//Message is now parsed into all lowercase segments

      switch (args.length) {
        case 1:
          if(message.content === "!help"){
            message.channel.send(`
            ------Current commands------
            To add single role: "!add role <role>"
            To add multiple roles: \"!add role <roles> <you> <want>\"
            To remove single role: \"!remove role <role>\"
            To remove multiple roles: \"!add role <roles> <to> <remove>\"
            To see which roles you can add: \"!add role\"
            To see which roles you can remove: \"!remove role\"
            To see full list of roles: \"!help roles\"
            `)
          }
          break;

        case 2:
          if (message.content  === "!help roles"){
            var rolesString = '';
            message.guild.roles.forEach(function(currentValue, currentIndex){
              rolesString += currentValue.name + '\n';
            });
            rolesString = rolesString.slice(0, -1);
            message.channel.send(rolesString);
          }
          else if (message.content === "!add role"){
            CheckUserRoles(message, false)
          }
          else if (message.content === "!remove role"){
            CheckUserRoles(message, true)
          }
          break;

        default:
          //Must be the id for the role-assignment-channel
          if (message.content.startsWith(config.prefix + 'add role')){
            var roles = [];
            for (var i = 2; i < args.length; i++){
              roles.push(args[i]);
            }
            ModifyUserRoles(message, roles, true);
          }
          else if(message.content.startsWith(config.prefix + 'remove role')){
            var roles = [];
            for (var i = 2; i < args.length; i++){
              roles.push(args[i]);
            }
            ModifyUserRoles(message, roles, false);
          }
      }
    }
});

client.login(config.key);
