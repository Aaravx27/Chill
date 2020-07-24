const Discord = require("discord.js");

const defaultSettings = {
	prefix: ".",
	welcomechannel: "👋welcome",
	bcchannel: "🔴broadcast",
	puchannel: "🔨punishments",
	reportchannel: "🚨reports",
	gachannel: "🎉giveaway",
	pollchannel: "💡poll",
	musicvocalchannel: "🔊music",
	musictextchannel: "🎵song-request",
	musictemprole: "Listening",
	ticketcategory: "tickets",
	mutedrole: "Muted",
	djrole: "DJ",
	supportrole: "Support",
	roleonjoin: "Member",
	musicchannelonly: "false"
}

module.exports = {
    name: "resetconfig",
    aliases: ["defaultconfig"],
    category: "Settings",
	description: "Reset Guild's config to default values",
	usage: "resetconfig\n**e.g.**\n\`resetconfig\`\n> reset the server config values back to default",
    permission: "ADMINISTRATOR",
    run: async (client, msg, arg) => {
		msg.delete();

		const nopermEmbed = new Discord.RichEmbed()
		.setColor(`RED`)
		.setTitle(`⛔ You don't have permission to use this!`)

		if (!msg.member.hasPermission("ADMINISTRATOR")) return msg.reply(nopermEmbed).then(msg => msg.delete(5000));

        const resetEmbed = new Discord.RichEmbed()
			.setColor('RANDOM')
			.setTitle("💾Guild Settings")
            .setDescription("Settings resetted to default values!")
            
        client.settings.set(msg.guild.id , defaultSettings);
        msg.channel.send(resetEmbed).then(msg => msg.delete(5000));
        

    }
}
