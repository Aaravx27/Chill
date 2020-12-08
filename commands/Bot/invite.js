const Discord = require("discord.js");

module.exports = {
    name: "invite",
    category: "Bot",
    description: "Bot's invite link",
    usage: "invite\n**e.g.**\n\`invite\`\n> Returns a link to Invite the bot on another server",
    run: async (client, msg, arg) => {
        msg.delete();
        const embed = new Discord.MessageEmbed()
            .setColor(`RANDOM`)
            .setThumbnail(client.user.avatarURL)
            .setTitle(`**Chill** BOT`)
            .setDescription(`[**Invite**](https://discordapp.com/api/oauth2/authorize?client_id=605894942275141672&permissions=8&scope=bot)`);
        msg.channel.send(embed)
    }
}
