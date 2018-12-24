var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var cur_queue = -1;
var queue = [];
var queue_cap = [];
var queue_status = [];
var queue_linked = [];
var modsAndUp = []
var servers;
var bot_id;
var avatarURL;
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});

// var keys = Object.keys(Discord.Client._events);
// console.log(keys);


// let guild = Discord.Clients.guilds.find(guild => guild.name === "Boosting in Progress");
// let member = guild.members.find(member => member.name === "bamxmejia");
var acceptedRoles = ["Admin", "Head Mod", "Mod", "Judge"];
// const getModRole = member.roles.find(role => acceptedRoles.includes(role.name));
// return "role: " + getModRole;
// modsAndUp =
// var channel_ID = '358709303084974081';
function checkForAcceptedRoles(channelID, uRoles){
    // console.log(channelID);
    var key = false;
    var keys = Object.keys(bot.servers[channelID].roles).filter(function(role){
        for(var i = 0; i < Object.keys(bot.servers[channelID].roles).length; i++){
            var roleID;
            if(bot.servers[channelID].roles[role].name == acceptedRoles[i]){

                // return bot.servers[channelID].roles[role].name == acceptedRoles[i];
                if(uRoles.some(r=>bot.servers[channelID].roles[role].id.includes(r))){
                    key = true;
                    return true;
                }
                return false;
                // console.log(bot.servers[channelID].roles[role].name);
                // console.log(acceptedRoles[i]);
                // return bot.servers[channelID].roles[role].name == acceptedRoles[i];
            }
          // console.log(bot.servers[channel_ID].roles[role].name);
        }
        return false;
    });
    // console.log(key);
    return key;
}
// bot_id = '526011511093854229';
//ef5086d73496a69d96fc5aaa820b3722
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
    // bot_id = bot.users.find(s=>s.username === 'Qbot');
    // var keys = Object.keys(evt.d.user);
    // console.log(evt.d.user_settings);
    bot_id = evt.d.user.id;
    // console.log(evt.d.user.id);
    // console.log(keys);
    // console.log(bot.servers[channel_ID].roles.);
    // console.log(bot.servers.roles);
});
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// var atr = Object.keys(bot);
// console.log(atr);

bot.on('message', function m (user, userID, channelID, message, evt){
    // var user = m.author; var userID = m.authorID; /*var channelID = m.guilds.get('GuildID').channels.get('ChannelID');*/ var message = m.content;// evt)
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `q!`
    // var userRoleID = message.members.roles

    // bot.sendMessage({
    //     to: channelID,
    //     message: 'qlength: ' + queue_linked.length
    // });
    // sleep(500);
    // var getModRole = evt.d.member.roles.some(role => acceptedRoles.includes(role.name));
    // var keys = Object.keys(evt.d.nonce);
    // var keys = Object.keys(evt.d);
    // console.log(keys + '\n' + evt.t + '\n' + evt.s + '\n' + evt.op + '\n' + evt.d);
    // console.log(evt.d.member.roles);
    // console.log(evt.d.guild_id);
    // console.log(keys);
    // console.log(channelID);
    // return;
    for(var i = 0; i < queue_linked.length; i++){
      if(queue_linked[i][0] == channelID){
        cur_queue = i;
        break;
      }
      cur_queue = -1;
    }
    if(cur_queue == -1){
      queue_linked.push([channelID]);
      // queue_status.push([]);
      queue.push([]);
      cur_queue = queue_linked.length - 1;
      queue_linked[cur_queue].push('unlinked');
      queue_status.push('open');
      queue_cap.push(40);
      // bot.sendMessage({
      //     to: channelID,
      //     message: 'qlinked: ' + queue_linked[cur_queue][1] + '\ncur_queue: ' + cur_queue
      // });
    }

    if (message.substring(0, 2) == 'q!') {
        var args = message.substring(2).split(' ');
        var cmd = args[0];
    		if(cmd == '' && args.length > 1){
    		    cmd = args[1];
    		}

        args = args.splice(1);
        if(args.length > 1 && args[0] == ' '){
            args.splice(1);
    		}
        switch(cmd){
          case 'link':
          case 'lnk':
              if(!checkForAcceptedRoles(evt.d.guild_id, evt.d.member.roles)){
                  bot.sendMessage({
                      to: channelID,
                      message: 'Only authorized members can call this function!'
                  });
                  return;
              }
              queue_linked[cur_queue][1] = 'linked';
              bot.sendMessage({
                  to: channelID,
                  message: 'Spotlight Bot has been linked'
              });
              return;
        }
        if(queue_linked[cur_queue][1] == 'unlinked') {
          // bot.sendMessage({
          //     to: channelID,
          //     message: 'queue_linked[cur_queue][1]: ' + queue_linked[cur_queue][1]
          // });
          return;
        }
        switch(cmd) {
            case 'unlink':
            case 'ulnk':
                if(!checkForAcceptedRoles(evt.d.guild_id, evt.d.member.roles)){
                    bot.sendMessage({
                        to: channelID,
                        message: 'Only authorized members can call this function!'
                    });
                    return;
                }
                queue_linked[cur_queue][1] = 'unlinked';

                //deleting queues for current channel
                queue.splice(cur_queue);
                queue_linked.splice(cur_queue);
                queue_cap.splice(cur_queue);
                queue_status.splice(cur_queue);
                cur_queue = -1;
                bot.sendMessage({
                    to: channelID,
                    message: 'Spotlight Bot has been unlinked'
                });
                break;
        		case 'open':
        		case 'o':
                if(!checkForAcceptedRoles(evt.d.guild_id, evt.d.member.roles)){
                    bot.sendMessage({
                        to: channelID,
                        message: 'Only authorized members can call this function!'
                    });
                    return;
                }
                queue_status[cur_queue] = 'open';
          		  bot.sendMessage({
                  to: channelID,
                  message: 'Queue has been opened!'
                });
        		    break;
        		case 'close':
        		case 'c':
                if(!checkForAcceptedRoles(evt.d.guild_id, evt.d.member.roles)){
                    bot.sendMessage({
                        to: channelID,
                        message: 'Only authorized members can call this function!'
                    });
                    return;
                }
                queue_status[cur_queue] = 'closed';
                bot.sendMessage({
                    to: channelID,
                    message: 'Queue has been closed!'
                });
                break;

            case 'ping':
                bot.sendMessage({
                to: channelID,
                message: 'Pong!'
            });
        		break;

            case 'join':
            case 'j':
                if(queue_status[cur_queue] == 'open' && queue[cur_queue].length < queue_cap[cur_queue]){
                    var qbreak = 0;
                    for(var i = 1; i < queue[cur_queue].length; i+=2){
                        if(queue[cur_queue][i] == userID){
                            bot.sendMessage({
                                to: channelID,
                                message: 'You are already in queue!'
                            });
                            qbreak = 1;
                            break;
                        }
                    }
                    if(qbreak == 1){ break; }
                    queue[cur_queue].push(user);
                    queue[cur_queue].push(userID);
                    bot.sendMessage({
                        to: channelID,
                        message: '<@!' + userID + '> has joined the queue!'
                            + '\nThere are ' + queue[cur_queue].length/2 + '/' + queue_cap[cur_queue]/2 + ' spots filled.'
                            + '\nThe queue is currently ' + queue_status[cur_queue]
                    });
                }//if
                else if(queue_status[cur_queue] == 'closed'){
                    bot.sendMessage({
                        to: channelID,
                        message: 'Queue is currently closed!'
                    });
                }//else if
                else{
                    bot.sendMessage({
                        to: channelID,
                        message: 'Queue has reached its cap!'
                    });
                }//else
                break;
        		case 'leave':
        		case 'l':
          			for(var i = 1; i < queue[cur_queue].length ; i+=2){
            				if(queue[cur_queue][i] == userID){
            					  bot.sendMessage({
                            to: channelID,
                            message: 'You have left the queue!'
                        });
              					queue[cur_queue].splice(i, 1);
              					queue[cur_queue].splice(i-1, 1);
              					break;
            				}
                    if(i+2 >= queue[cur_queue]){
                        bot.sendMessage({
                            to: channelID,
                            message: 'You are not in queue!'
                        });
                    }
          			}
                break;

            //if an empty argument is passed
        		case '':
                bot.sendMessage({
                    to: channelID,
                    message: 'Enter "help"(h) argument for a list of commands'
                });
                break;
        		case 'next':
        		case 'n':
                if(!checkForAcceptedRoles(evt.d.guild_id, evt.d.member.roles) && (queue[cur_queue].length > 0 && userID != queue[cur_queue][1])){
                    // console.log(userID != queue[cur_queue][1]);
                    // console.log(queue[cur_queue][1]);
                    bot.sendMessage({
                        to: channelID,
                        message: 'Only authorized members can call this function!'
                    });
                    return;
                }
                if(queue[cur_queue].length <= 0){
                    bot.sendMessage({
                        to: channelID,
                        message: 'The queue is empty!'
                    });
                    break;
                }
          			var quserID = queue[cur_queue].splice(1,1);
          			queue[cur_queue].splice(0,1);
          			if(queue[cur_queue].length > 0){
                    bot.sendMessage({
                        to: channelID,
                        message: 'Thank you <@!' + quserID + '> for singing!\nUp next is: <@!' + queue[cur_queue][queue[cur_queue].length - 1] + '>'
                    });
          			}
          			else{
            				bot.sendMessage({
                        to: channelID,
                        message: 'Thank you <@!' + quserID + '> for singing!\nQueue is now empty'
                    });
          			}
          			break;

            //see who's in queue
        		case 'queue':
            case 'que':
        		// case 'q':
                if(queue[cur_queue].length == 0){
                    bot.sendMessage({
                        to: channelID,
                        message: 'There are ' + queue[cur_queue].length/2 + '/' + queue_cap[cur_queue]/2
                        + ' spots filled.' + '\nThe queue is currently ' + queue_status[cur_queue]
                    });
                }
          			for(var i = 0; i < queue[cur_queue].length; i+=2){
                    if(i == 0){
                        if(i+2 < queue[cur_queue].length){
                            bot.sendMessage({
                                to: channelID,
                                message: 'Currently singing: <@' + queue[cur_queue][i+1] + '>'
                            });
                        }//if
                        else{
                            bot.sendMessage({
                                to: channelID,
                                message: 'Currently singing: <@' + queue[cur_queue][i+1] + '>\nThere are '
                                + queue[cur_queue].length/2 + '/' + queue_cap[cur_queue]/2 + ' spots filled.'
                                + '\nThe queue is currently ' + queue_status[cur_queue]
                            });
                        }
                    }//if
            				else if(i == 2){
                        if(i+2 < queue[cur_queue].length){
              				      bot.sendMessage({
                         				 to: channelID,
                                 message: 'Up next: <@' + queue[cur_queue][i+1] + '>'
                            });
                        }
                        else{
                            bot.sendMessage({
                                 to: channelID,
                                 message: 'Up next: <@' + queue[cur_queue][i+1] + '>\nThere are '
                                 + queue[cur_queue].length/2 + '/' + queue_cap[cur_queue]/2 + ' spots filled.'
                                 + '\nThe queue is currently ' + queue_status[cur_queue]
                            });
                        }
            				}//else if
            				else{
                        if(i+2 < queue[cur_queue].length){
                				    bot.sendMessage({
                           			to: channelID,
                            		message: queue[cur_queue][i]
                           	});
                        }
                        else{
                            bot.sendMessage({
                           			to: channelID,
                            		message: queue[cur_queue][i] + 'There are '
                                + queue[cur_queue].length/2 + '/' + queue_cap[cur_queue]/2 + ' spots filled.'
                                + '\nThe queue is currently ' + queue_status[cur_queue]
                           	});
                        }
            				}//else
          			}//for
          			break;
        		case 'cap':
        		// case 'cp':
                if(!checkForAcceptedRoles(evt.d.guild_id, evt.d.member.roles)){
                    bot.sendMessage({
                        to: channelID,
                        message: 'Only authorized members can call this function!'
                    });
                    return;
                }
          			if(isNaN(args[0]) == false){
              				queue_cap[cur_queue] = args[0] * 2;
              				bot.sendMessage({
                          to: channelID,
                          message: 'Queue is now capped at: ' + queue_cap[cur_queue]/2
                      });
          			}
          			else{
          				    bot.sendMessage({
                   			  to: channelID,
                          message: 'Enter an integer as an argument to cap the queue at. "q!cap ##"'
                   		});
          			}
          			break;
            case 'clear':
            case 'clr':
                if(!checkForAcceptedRoles(evt.d.guild_id, evt.d.member.roles)){
                    bot.sendMessage({
                        to: channelID,
                        message: 'Only authorized members can call this function!'
                    });
                    return;
                }
                queue[cur_queue].splice(0, queue[cur_queue].length);
                bot.sendMessage({
                    to: channelID,
                    message: 'Queue has been cleared.'
                });
                break;

            case 'help':
            case 'h':
                // var keys = Object.keys(bot.sendMessage(function));
                // console.log(keys);
                // console.log(bot.avatar);
                https://cdn.discordapp.com/avatars/526011511093854229/ef5086d73496a69d96fc5aaa820b3722.jpg

                // return;
                avatarURL = 'https://cdn.discordapp.com/avatars/' + bot_id + '/' + bot.avatar + '.jpg';
                bot.sendMessage({
                  to: channelID,
                  embed: {
                    color: 0x02c4ff,
                    // background: 0xFFFFFF,
                    //3447003
                    author: {
                      name: bot.username + ' - Help',
                      icon_url: avatarURL,
                      // color: 0x02c4ff
                    },
                    // image : avatarURL,
                    // thumbnail : avatarURL,
                    // title: "**__Help Commands__**",
                    // url: "http://google.com",
                    // description: "This is a test embed to showcase what they look like and what they can do.",
                    fields: [{
                          name: "join (j)",
                          value: "Join the queue."
                      },
                      {
                          name: "leave (l)",
                          value: "Leave the queue."
                      },
                      {
                          name: "queue (q)",
                          value: "View who is in queue, how many spots are filled, and if queue is open."
                      },
                      {
                          name: "next (n)",
                          value: "Current singer or authorized member removes the current singer from queue after they are done."
                      },
                      {
                          name: "*link (lnk)",
                          value: "Links the bot to a channel, signaling it to respond to other command."
                      },
                      {
                          name: "*unlink (ulnk)",
                          value: "Unlink the bot from a channel, signaling it to stop responding to commands other than 'link', and clearing the queue."
                      },
                      {
                          name: "*open (o)",
                          value: "Opens the queue, allowing users to join it."
                      },
                      {
                          name: "*close (c)",
                          value: "Closes the queue, preventing users from joining it."
                      },
                      {
                          name: "*cap",
                          value: "Sets the maximum amount of users allowed in queue."
                      },
                      {
                          name: "*clear (clr)",
                          value: "Clears the queue, removing anyone in it."
                      },
                      {
                          name: "help (h)",
                          value: "Displays all commands."
                      },
                      {
                          name: "\u200B",
                          value: "(*)only authorized users may use",
                      }
                      // {
                      //     name: "(*)only authorized users may use",
                      //     value: "\u200B"
                      // }
                      // {
                      //   name: "leave(l)",
                      //   value: "You can put [masked links](http://google.com) inside of rich embeds."
                      // },
                      // {
                      //   name: "Markdown",
                      //   value: "You can put all the *usual* **__Markdown__** inside of them."
                      // }
                    ],

                    blankField: [{
                        blankField:true
                    }],
                    timestamp: new Date(),
                    footer: {
                      icon_url: avatarURL,
                      text: "© bamxmejia"
                    }
                  }//embed
              });
                // bot.sendMessage({
                //     to: channelID,
                //     message: 'Public: join(j), leave(l), queue(q), next(n) only current singer\n'
                //         + 'Authorized Members Only: link(lnk), unlink(ulnk), open(o), close(c), cap, clear(clr), next(n)'
                // });
                break;

            //when an incorrect command is entered
        		default:
          			bot.sendMessage({
                      to: channelID,
                      message: 'No such command'
                });
          			break;
                    // Just add any case commands if you want to..
        }//switch
    }//if
});//bot.on
