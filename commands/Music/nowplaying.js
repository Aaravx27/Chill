const Discord = require("discord.js");

module.exports = {
    name: "nowplaying",
    aliases: ["np"],
    category: "Music",
    description: "Return current playing song",
    usage: "nowplaying\n**e.g.**\n\`nowplaying\`\n> Wanna know the name of the song currently playing?\n> This is the right command",
    run: async (client, msg, arg) => {

        const serverQueue = client.queue.get(msg.guild.id);

        const noDJroleEmbed = new Discord.MessageEmbed()
            .setColor('PURPLE')
            .setTitle(":musical_note: Music")
            .setDescription(`⛔ You don't have DJ role`)
        const noplayingEmbed = new Discord.MessageEmbed()
            .setColor('PURPLE')
            .setTitle(":musical_note: Music")
            .setDescription(`⛔ There is nothing playing`)
        const notinvcEmbed = new Discord.MessageEmbed()
            .setColor('PURPLE')
            .setTitle(":musical_note: Music")
            .setDescription(`⛔ You are not in a voice channel`)
        const mconlyEmbed = new Discord.MessageEmbed()
            .setColor(`RANDOM`)
            .setTitle(":musical_note: Music")
            .setDescription(`Music Channel Only is active!\nYou can only use the music module in: <#${client.settings.get(msg.guild.id, "musictextchannel")}>`)

        if (!msg.member.roles.cache.some(role => role.id === (client.settings.get(msg.guild.id, "djrole"))) && client.settings.get(msg.guild.id, 'djrequired') === 'true') return msg.channel.send({embeds:[noDJroleEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5e3));
        if (client.settings.get(msg.guild.id, "musicchannelonly") === "true" && msg.channel.id !== client.settings.get(msg.guild.id, "musictextchannel")) return msg.channel.send({embeds:[mconlyEmbed]}).then(msg =>setTimeout(() => msg.delete(), 10e3));
        if (!msg.member.voice.channel) return msg.channel.send({embeds:[notinvcEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5e3));
        if (!serverQueue) return msg.channel.send({embeds:[noplayingEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5e3));

        const nowplayingEmbed = new Discord.MessageEmbed()
            .setColor('PURPLE')
            .setTitle(":musical_note: Music")
            .setDescription(`🎶 **${serverQueue.songs[0].title}**`)

        return msg.channel.send({embeds:[nowplayingEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5e3));
    }
}
