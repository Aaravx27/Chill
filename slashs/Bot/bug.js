const talkedRecently = new Set();
const Discord = require(`discord.js`);
const config = require(`../../config.json`);

module.exports = {
	name: `bug`,
	description: `Report bugs to the dev. Please provide a good explanation and if possibile the steps to reproduce it`,
	options: [
		{
			name: `bug`,
			description: `Please provide a good explanation of the bug and if you can the steps to reproduce it`,
			type: Discord.ApplicationCommandOptionType.String,
			minLength: 50,
			maxLength: 4096,
			required: true,
		},
	],
	run: async (client, interaction, LANG) => {


		if (talkedRecently.has(interaction.user.id)) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.cooldown)] });
		const bug = interaction.options.getString(`bug`);

		const bugembed = new Discord.EmbedBuilder()
			.setColor(`Red`)
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
			.setTitle(`🪲 Bug Report`)
			.setDescription(bug)
			.setTimestamp();

		client.channels.cache.get(config.bugreport_channel).send({ embeds: [bugembed] }).then(sentEmbed => {
			sentEmbed.react(`✅`)
				.then (() => sentEmbed.react(`❔`))
				.then (() => sentEmbed.react(`❌`));
		});

		const thanksEmbed = new Discord.EmbedBuilder()
			.setColor(`Green`)
			.setTitle(LANG.success);
		interaction.reply({ ephemeral: true, embeds: [thanksEmbed] });

		talkedRecently.add(interaction.user.id);
		setTimeout(() => {
			talkedRecently.delete(interaction.user.id);
		}, 30 * 60000);
	},
};
