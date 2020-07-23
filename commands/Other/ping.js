const Discord = require("discord.js");

module.exports = {
    name: "ping",
    aliases: ["latency"],
    category: "fun",
    description: "Returns latency/ping in ms",
    usage: "ping\n**e.g.**\n\`ping\`\n> will return your latency (e.g. 123ms)",
    run: async (client, msg, arg) => {
        msg.delete();

        const awaitEmbed = new Discord.RichEmbed()
            .setColor(`RANDOM`)
            .setTitle(`📶 Calculating . . .`)
        
        const m = await msg.channel.send(awaitEmbed);

        const pingEmbed = new Discord.RichEmbed()
            .setColor(`RANDOM`)
            .setTitle(`📶 ${m.createdTimestamp - msg.createdTimestamp} ms`)

        m.edit(pingEmbed);
    }
}
