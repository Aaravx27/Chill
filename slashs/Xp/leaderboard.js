const Discord = require("discord.js");

module.exports = {
    name: "leaderboard",
    description: "Returns top 10 XP leaderboard",
	options: null,
    run: async (client, interaction, arg) => {
		client.settings.ensure(interaction.guild.id, {xp: {}});
		const moduleDisabledEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
			.setTitle(`⛔ This module is disabled on this server!`)
		if (client.settings.get(interaction.guild.id, "xpmodule") === "false") return interaction.reply({ephemeral:true, embeds:[moduleDisabledEmbed]});
		var users = client.settings.get(interaction.guild.id,"xp"); //get object
		var sorted = {};  
            Object //sort object
                .keys(users).sort(function(a, b){
                    return users[b].points - users[a].points;
                })
                .forEach(function(key) {
                    sorted[key] = users[key];
                });
		var top10 = Object.keys(sorted).map((key) => [key, sorted[key]]).splice(0,10); //map and splice object
		let emojiposition = 0;
		const embed = new Discord.MessageEmbed()
			.setAuthor({name: `${interaction.guild.name} 🏆 Leaderboard 🏆`, iconURL: interaction.guild.iconURL()})
			.setColor(0x00AE86);
		var emoji = ["🥇","🥈","🥉","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟"];
		var pos4to10 = "";
		for(const [user,data] of top10) {
			if (emojiposition === 0) embed.setTitle(`${emoji[emojiposition]}**${client.users.cache.get(user).username}**\n> **Lvl ${data.level}** - ${client.chill.fancyNumber(data.points)} xp`, true);
			else if (emojiposition === 1 || emojiposition === 2) embed.addField(`${emoji[emojiposition]}**${client.users.cache.get(user).username}**`, `> **Lvl ${data.level}** - ${client.chill.fancyNumber(data.points)} xp`, true);
			else if (emojiposition === 3) pos4to10 = `${emoji[emojiposition]}${client.users.cache.get(user).username}\n\tLvl ${data.level} - ${client.chill.fancyNumber(data.points)} xp`;
			else pos4to10 += `\n${emoji[emojiposition]}${client.users.cache.get(user).username}\n\tLvl ${data.level} - ${client.chill.fancyNumber(data.points)} xp`;
			emojiposition++;
		}
		if (pos4to10.length > 1) embed.setFooter({text: pos4to10});
		return interaction.reply({embeds:[embed]});
    }
}