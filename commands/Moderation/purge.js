const Discord = require("discord.js");

module.exports = {
    name: "purge",
    aliases: ["clear"],
    category: "Moderation",
    description: "Get rid of many messages with one command",
    usage: "<2-100>",
    permission: "MANAGE_MESSAGES",
    run: async (client, msg, arg) => {
        await msg.delete();

        const nopermEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You don't have permission to use this!`)
        const invalidEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Please provide a number between 2 and 100`)
            .setFooter(`Due to Discord API you can't delete more than 100 messages at a time`)
                
        if (!msg.member.hasPermission("MANAGE_MESSAGES")) return msg.channel.send(nopermEmbed).then(msg => msg.delete(5000));

        const deleteCount = parseInt(arg[0], 10);

        const purgeEmbed = new Discord.RichEmbed()
            .setColor(`GREEN`)
            .setTitle(`♻️ ${deleteCount} messages deleted`)

        if (!deleteCount || deleteCount < 2 || deleteCount > 100) return msg.channel.send(invalidEmbed).then(msg => msg.delete(5000));
        
        const fetched = await msg.channel.fetchMessages({limit: deleteCount});
        msg.channel.bulkDelete(fetched).catch(error => console.log(error));
        
        msg.channel.send(purgeEmbed).then(msg => msg.delete(5000));
    }
}
