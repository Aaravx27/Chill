const Discord = require(`discord.js`);

module.exports = {
	name: `rockpaperscissors`,
	description: `Rock Paper Scissors`,
	botPerms: [`VIEW_CHANNEL`, `EMBED_LINKS`, `ADD_REACTIONS`, `MANAGE_MESSAGES`, `READ_MESSAGE_HISTORY`],
	options: null,
	run: async (client, interaction, LANG) => {

		const embed = new Discord.MessageEmbed()
			.setColor(`RANDOM`)
			.setTitle(LANG.title)
			.setFooter({ text: interaction.user.username, iconURL: interaction.member.displayAvatarURL() })
			.setDescription(LANG.react);

		const chooseArr = [`🪨`, `📰`, `✂️`];
		interaction.reply({ embeds: [embed] });
		await interaction.fetchReply().then(async sent => {
			const reacted = await client.chill.promptMessage(sent, interaction.member, 30, chooseArr);
			const botChoice = chooseArr[Math.floor(Math.random() * chooseArr.length)];
			const result = await getResult(reacted, botChoice);
			await sent.reactions.removeAll();
			embed.setDescription(``).addField(result, `${reacted} vs ${botChoice}`);
			sent.edit({ embeds: [embed] });
		});

		function getResult(me, clientChosen) {
			if ((me === `🪨` && clientChosen === `✂️`) ||
                (me === `📰` && clientChosen === `🪨`) ||
                (me === `✂️` && clientChosen === `📰`)) {
				return LANG.won;
			} else if (me === clientChosen) {
				return LANG.tie;
			} else {
				return LANG.lost;
			}
		}
	},
};