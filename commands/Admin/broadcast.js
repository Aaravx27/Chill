const Discord = require("discord.js");

module.exports = {
    name: "broadcast",
    aliases: ["bc"],
    category: "Admin",
    description: "Broadcast a message in the preset channel tagging @everyone in the server",
    usage: "broadcast\n**e.g.**\n\`broadcast\`\n> Follow the instructions\n> Bot will ask you a title and a description/message\n> Title can be max 256 char long, Description can be max 2048 char long",
    permission: "ADMINISTRATOR",
    run: async (client, msg, arg) => {

        const nobotpermEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ I don't have permission to do this! Please check my permissions.`)
        const nopermEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You don't have permission to use this!`)
        const nochannelEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Broadcast channel not found!`)
        const toolongtitleEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Title can't be longer than 256 chatacters`)
        const toolongdescriptionEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Description can't be longer than 2048 chatacters`)
        
        if (!msg.member.permissions.has("ADMINISTRATOR")) return msg.channel.send({embeds:[nopermEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
        
        const titleembed = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setTitle("🔴Broadcast")
            .setDescription("Enter the title:")
            .setFooter('max 256 characters')
        const descriptionembed = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setTitle("🔴Broadcast")
            .setDescription("Now enter the description:")
            .setFooter('max 2048 characters')
        const timeembed = new Discord.MessageEmbed()
            .setColor('RED')
            .setTitle("🔴 Broadcast")
            .setDescription("OUT OF TIME!")

        const filter = m => m.author.id === msg.author.id;

        msg.channel.send({embeds:[titleembed]}).then(msg => {//collect title
            msg.channel.awaitMessages({filter, max: 1,time: 60000,errors: ['time']})
                .then(collected => {
                var title = collected.first().content;
                if (title.length > 256) return msg.channel.send({embeds:[toolongtitleEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
                collected.first().delete();
                msg.edit({embeds:[descriptionembed]})                  
                    
                    .then(msg => {//collect description
                    msg.channel.awaitMessages({filter, max: 1,time: 60000,errors: ['time']})
                        .then(collected => {
                        var description = collected.first().content;
                        if (description.length > 256) return msg.channel.send({embeds:[toolongdescriptionEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
                        collected.first().delete();
                        msg.delete();
                            
                            try {//send broadcast
                                let bcEmbed = new Discord.MessageEmbed()
                                    .setTitle(title)
                                    .setDescription(description)
                                    .setColor("#00ff00")
                                    .setAuthor(msg.author.username, msg.author.displayAvatarURL())    
                                let bcchannel = msg.guild.channels.cache.find(bcchannel => bcchannel.id === (client.settings.get(msg.guild.id, "bcchannel")));
                                if(!bcchannel) return msg.channel.send({embeds:[nochannelEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
                                bcchannel.send("@everyone");
                                bcchannel.send({embeds:[bcEmbed]});
                                } catch(err) {//bot no perm error
                                msg.channel.send({embeds:[nobotpermEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
                                console.log(err);
                                }

                        }).catch(err => {//title time error
                            msg.edit({embeds:[timeembed]});
                            setTimeout(() => msg.delete(), 5000);
                            console.log(err);
                            });
                    }).catch(err => console.log(err));

                }).catch(err => {//description time error
                    msg.edit({embeds:[timeembed]});
                    setTimeout(() => msg.delete(), 5000);
                    console.log(err);
                    });
            }).catch(err => console.log(err));
    }
}
