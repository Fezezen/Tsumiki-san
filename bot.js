const botSettings = require("./botSettings.json");
const Music = require('discord.js-musicbot-addon');
const Discord = require("discord.js");
const GoogleImages = require('google-images'); 
const fileSystem = require('fs'); 
var CustomCmds = require("./customCmds.json");
const google_client = new GoogleImages('018071923536050688361:juxrmakrwio', process.env.GOOGLE_KEY);
const user_stats = require("./user-stats.json");
const booru = require('booru');

const client = new Discord.Client();

const music = new Music(client, {
  youtubeKey: process.env.YOUTUBE_TOKEN,
  anyoneCanSkip:true,
  defVolume:25,
  anyoneCanLeave:true
});

var mentionID;

var activitys = [
	{name:"with Io-san",type: 'PLAYING'},
	{name:"Io-san",type: 'WATCHING'},
	{name:"Io-san",type: 'LISTENING'},
	{name:"with friends",type: 'PLAYING'},
	{name:"Hime",type: 'LISTENING'},
	{name:"Mayoi and Sakaki",type: 'WATCHING'}
]

var greetings = [
	"Hello",
	"Hi",
	"Sup",
	"Hey",
]

var goodnights = [
	"Night",
	"Nighty Night",
	"gn",
	"Night",
  "Good night"
]

var pettedGifs = [
	"http://pa1.narvii.com/5813/a12cb56941779bd76495283a376ab1ad3437884c_hq.gif",
	"http://24.media.tumblr.com/tumblr_m3z8ohz7mf1r012yho1_500.gif",
	"http://25.media.tumblr.com/tumblr_m7wmziJRhY1rvy50so1_500.gif",
	"http://2.bp.blogspot.com/--qnNnudEKjg/T-DHzMsRvKI/AAAAAAAAASE/0iIjZjnRfFk/s1600/Tsumiki.gif",
	"http://4.bp.blogspot.com/-11w3blUYPXo/T-Dx-hdUe2I/AAAAAAAAAUg/d52TcQyZ_wU/s1600/Acchi+Kocchi+-+10.gif",
	"http://2.bp.blogspot.com/-eEn7Y0BYOqM/T-D0XVkJ4UI/AAAAAAAAAUw/eZMvadVctws/s1600/Tsumiki+Cat.gif",
	"https://pa1.narvii.com/6080/2d8191bc0efcc1be589377f8e6b5a29b597c20a9_hq.gif",
	"https://media1.tenor.com/images/2e62cd7491be4ec9f0ec210d648b80fd/tenor.gif?itemid=10947505"
]

var sendLoveImages = [
	"https://78.media.tumblr.com/07f59f921727674e279585dd1d05f785/tumblr_owbbosxikD1wpkkdxo1_500.gif",
	"https://78.media.tumblr.com/tumblr_lz552hjsl51rn1630o1_500.gif",
	"https://pa1.narvii.com/6080/5d22970acc7b7cd957dfe73ea9ddf8c05195d3f8_hq.gif",
	"https://pa1.narvii.com/6080/acce667181e20531f8f15d048fb5432a7a213970_hq.gif",
	"https://pa1.narvii.com/6080/5f15a9007c13eb881ff49abe1915d0d2b672b2a2_hq.gif",
	"https://media1.tenor.com/images/b2792b77838ef7c90eed17aa4e2d4eae/tenor.gif?itemid=9336464",
	"https://media1.tenor.com/images/42922e87b3ec288b11f59ba7f3cc6393/tenor.gif?itemid=5634630",
	"https://media1.tenor.com/images/e7321f6dff49fff75c1976f35b996081/tenor.gif?itemid=5672248",
	"https://cdn.discordapp.com/attachments/392534534924795904/434809436452683777/upp3jiaumtiy.png",
]

var slapGifs = [
	"https://data.whicdn.com/images/123452779/original.gif",
	"https://cdn52.picsart.com/167690219001202.gif?r240x240",
	"https://vignette.wikia.nocookie.net/acchikocchi/images/d/d9/Tumblr_mvalp5nz4x1s6441yo1_500.gif/revision/latest?cb=20160527163619",
	"https://78.media.tumblr.com/ed4caf10b9639df8ebc0b6978421c6e2/tumblr_npde9sIqJm1uvptl5o1_500.gif",
	"https://78.media.tumblr.com/tumblr_m7qfr8JBpc1rukqfxo1_500.gif"
]

// Keep Alive
const http = require('http');
const express = require('express');
const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 180000);

function print(string) {
	console.log(string);
}
//

function findPhrase(phrase,table) {
	let lower = phrase.toLowerCase();
	let found = false;
	
	table.forEach(function(v) {
		if (v.toLowerCase() == lower) {
			found = true;
			return;
		}
	});
	
	return found;
}

function helpMessage() {
	let message = "```!musichelp | Gives you help with the Music player\n"+
	"!rolldie | Lets you roll die for a number between 1 and 6\n"+
	"!sendlove [mention] [from message] | Sends a DM to a person you mention, add false if you don't want them to know it's from you\n"+
	"!create_cmd [name of cmd (no spaces)] [what she'll reply to the cmd with] | Creates a custom command that is saved to the bot's local storage so it can be used even after the bot is restarted\n"+
	"!remove_cmd [name of cmd] | will remove a custom cmd\n"+
	"!pet | Pet Tsumiki\n"+
  "!slap | She'll respond in different ways\n"+
  "!say [what you want her to say] | She'll say anything you want, and delete the command if she has the right permissions\n"+
  "!dm [mention a user] | She'll send anything you want to the person you mentioned, I'll probably get rid of this cmd\n"+
  "!image [search term] | She'll search google for an image of the search term you put in and post it\n"+
  "!r34 [tags] | You already know what this does bud\n"+
  "!fight [fighter1] [fighter2] | puts 2 fighters against each other to see who would win a death battle```";
	
	return message;
}

function randomAct() {
	let act = activitys[Math.floor(Math.random()*activitys.length)];
	
	client.user.setActivity(act.name+' | !help for help with cmds',{ type: act.type})
}

client.on("ready", async() => {
	console.log("Ready!");

	mentionID = "<@"+client.user.id+">"
	
	client.user.setActivity('with Io-san | !help for help with cmds',{ type: 'PLAYING' })
	setInterval(randomAct,60000);
});

function remove_cmd(nameofcmd) {
	for (var i = 0; i < CustomCmds.cmds.length; i++) { 
		let cmd = CustomCmds.cmds[i];
		
		if (cmd && cmd.name && cmd.reply && cmd.name == nameofcmd) {
			
			CustomCmds.cmds.splice(i, 1);
						
			var data = CustomCmds;

			var jsonData = JSON.stringify(data);

			fileSystem.writeFile("customCmds.json", jsonData, function(err) {
				if (err) {
					console.log(err);
				}
			});
		}
	}
}

//User Stats handler 
  function check_user(userId,name) {
    for (var i = 0; i < user_stats.users.length; i++) { 
      let current_user = user_stats.users[i];
      
      if (!current_user.username) {
        current_user.username = name;
      }
      
      if (current_user.id == userId) {
          return true;
      }
    }
  }

  function add_user(user) {
    user_stats.users.push({"id":user.id,"xp":0,"xp_needed":10,"lvl":1});
    
    var data = user_stats;

		var jsonData = JSON.stringify(data);
    
    fileSystem.writeFile("user-stats.json", jsonData, function(err) {
				if (err) {
					console.log(err);
				}
		});
  }
  
  function getStats(userid) {
      for (var i = 0; i < user_stats.users.length; i++) { 
        let current_user = user_stats.users[i];
        
        return current_user;
      }
  }

  function user_addxp(user,message) {
    for (var i = 0; i < user_stats.users.length; i++) { 
      let current_user = user_stats.users[i];
      
      if (current_user.id == user.id) {
        current_user.xp = current_user.xp + Math.floor(Math.random()*25);
        
        if (!current_user.xp_needed) {
           current_user.xp_needed = 10; 
        }
        
        var data = user_stats;

        var jsonData = JSON.stringify(data);

        fileSystem.writeFile("user-stats.json", jsonData, function(err) {
            if (err) {
              console.log(err);
            }
        });
        break;
      }
    }
  }
//

client.on("message", async message => {
	if (message.author.bot) return;
	if (message.channel.type == "dm") return;
	
	let messageArray = message.content.split(" ");
	let command = messageArray[0];
	let args = messageArray.slice(1);		
  
  //User-stats
    if (check_user(message.author.id)) {
      user_addxp(message.author,message);
      for (var i = 0; i < user_stats.users.length; i++) { 
        let current_user = user_stats.users[i];
        
        if (current_user.xp >= current_user.xp_needed) {
            current_user.lvl = current_user.lvl + 1;
            current_user.xp_needed = current_user.xp_needed+(current_user.xp_needed*current_user.lvl);
            
            let embed = new Discord.RichEmbed()
            .setTitle("Level up!")
            .setThumbnail("https://cdn2.iconfinder.com/data/icons/retro-video-gaming/32/one_level_up_gaming-512.png")
            .setFooter("Lvl : "+current_user.lvl);

            message.channel.send(embed);
          
            var data = user_stats;

            var jsonData = JSON.stringify(data);
          
            fileSystem.writeFile("user-stats.json", jsonData, function(err) {
                if (err) {
                  console.log(err);
                }
            });
            break;
        }
      }
    } else {
      add_user(message.author); 
      print("User: "+message.author.id+" added");
    }
  //
		
	if(command.startsWith(botSettings.prefix)) {
		
		if (command === `${botSettings.prefix}profile`) {
      let user_stats = getStats(message.author.id);
      
			let embed = new Discord.RichEmbed()
				.setAuthor(message.author.username)
				.setThumbnail(message.author.avatarURL)
        .addField("Your lvl is: "+user_stats.lvl,"Xp needed till next lvl:"+(user_stats.xp_needed-user_stats.xp));
				
			message.channel.send(embed);
		}
    
    if (command === `${botSettings.prefix}rest_stats`) {
       if (message.author.id == botSettings.owner_id) {
          var data = {"cmds":[]};

          var jsonData = JSON.stringify(data);
          
          fileSystem.writeFile("user-stats.json", jsonData, function(err) {
              if (err) {
                console.log(err);
              }
          });
       }
    }
		
		if (command === `${botSettings.prefix}help`) {
			message.author.sendMessage(helpMessage());
		}
		
		if (command === `${botSettings.prefix}rolldie`) {
			let dir = "./Dice/One.png";
			let num = Math.floor(Math.random()*6);
			
			if (num == 2) {
				dir = "./Dice/Two.png";
			} else if (num == 3) {
				dir = "./Dice/Three.png";	
			} else if (num == 4) {
				dir = "./Dice/Four.png";	
			} else if (num == 5) {
				dir = "./Dice/Five.png";	
			} else if (num == 6) {
				dir = "./Dice/Six.png";	
			}
			
			message.channel.send("", {
				file: dir
			});
		}
		
		if (command === `${botSettings.prefix}pet`) {
			let num = Math.floor(Math.random()*pettedGifs.length);
			let dir = pettedGifs[num];
			
			message.channel.send("", {
				file: dir
			});
		}
		
		if (command === `${botSettings.prefix}slap`) {
			let num = Math.floor(Math.random()*slapGifs.length);
			let dir = slapGifs[num];
			
			message.channel.send("", {
				file: dir
			});
		}
			
		if (command === `${botSettings.prefix}sendlove`) {
			if (message.mentions.members.first()) {
				let person = message.mentions.members.first()
				let num = Math.floor(Math.random()*sendLoveImages.length);
				let dir = sendLoveImages[num];
				
				if (args[1] != "false") {
					person.send("From "+message.author.username, {
						file: dir
					});
				} else {
					person.send("From somebody who likes you.", {
						file: dir
					});
				}
			
			}
		}
		
		if (command === `${botSettings.prefix}say`) {
			message.delete(500);
			message.channel.send(message.content.slice(5, message.content.length));
		}
        
    if (command === `${botSettings.prefix}dm`) {
        if (message.mentions.members.first()) {
          let person = message.mentions.members.first();
          let messagetoSend = "";
          
          for (var i = 1; i < args.length; i++) {
            messagetoSend = messagetoSend + args[i] + " ";
          }
          
          person.send(messagetoSend);
          
          message.delete(200);
			  }
    }
    
    if (command === `${botSettings.prefix}image`) {
        let searchTerm = message.content.slice(7, message.content.length);
      
        google_client.search(searchTerm)
        .then(images => {
          let embed = new Discord.RichEmbed()
          .setImage(images[Math.floor(Math.random()*images.length)].url)
				  .setDescription("I'm not responsible for what this image appears as.");
          
          message.channel.send(embed);
        });
    }
		
     if (command === `${botSettings.prefix}r34`) {
       
       if (message.channel.nsfw) {
          try {
                const booruData = await booru.search('rule34.xxx', [args[0]], {
                  'limit': 1,
                  'random': true
                }).then(booru.commonfy)
                .then(images => {
                // Log the direct link to each image
                for (let image of images) {
                  console.log(image.common.file_url)
                }});
                

                 if (booruData) {
                   message.delete(200);

                   return message.channel.send(`Score: ${booruData[0].common.score}\n Image: ${booruData[0].common.file_url}`);
                }

            return message.reply('⚠️ No juicy images found.');
          } catch (BooruError) {
            print(BooruError);
            return message.reply('⚠️ No juicy images found.(err)');
          }       
       } else {
           message.channel.send("This channel isn't a NSFW channel.");
       }
    }
    
		for (var i = 0; i < CustomCmds.cmds.length; i++) { 
			let cmd = CustomCmds.cmds[i];
			if (cmd && cmd.name && cmd.reply && command == botSettings.prefix+cmd.name) {
				message.channel.send(cmd.reply);
			}
		}
		
		if (command === `${botSettings.prefix}remove_cmd`) {
			let Name = args[0];
			
			remove_cmd(Name);
		}
		
		if (command === `${botSettings.prefix}create_cmd`) {
			let Name = args[0];
			let reply = "";
			
			remove_cmd(Name);
			
			for (var i = 1; i < args.length; i++) { 
				let arg = args[i];
				
				reply = reply + arg + " ";
			}
			
			if (Name && reply != "") {
				CustomCmds.cmds.push({"name":Name,"reply":reply});
				
				var data = CustomCmds;

				var jsonData = JSON.stringify(data);

				fileSystem.writeFile("customCmds.json", jsonData, function(err) {
					if (err) {
						console.log(err);
					}
				});
			}
		}    
    
    if (command === `${botSettings.prefix}avatar`) {
        let person = message.mentions.members.first();
      
        if (person) {
           message.channel.send(person.avatarURL); 
        }
    }
    
    if (command === `${botSettings.prefix}fight`) {
        let fighter1 = args[0];
        let fighter2 = args[1];
      
        if (fighter1 && fighter2) {
          let winner = Math.floor(Math.random()*2);
          
          if (winner == 1) {
            message.channel.send(fighter1+" won!"); 
          } else {
            message.channel.send(fighter2+" won!"); 
          }
        }
    }
			
	} else if(command == mentionID) {
    let mergedArgs = "";
    
    for (var i = 1; i < args.length; i++) { 
				let arg = args[i];
				
				mergedArgs = mergedArgs + arg + " ";
			}
    
		if (findPhrase(mergedArgs,greetings)) {
			let greet = greetings[Math.floor(Math.random()*greetings.length)]
						
			message.reply(greet);
		}
		
		if (findPhrase(mergedArgs,goodnights)) {
			message.reply("Nighty night~");
		}
	}
	
	
});

client.login(process.env.TOKEN);
