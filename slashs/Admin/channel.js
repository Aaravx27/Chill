const Discord = require(`discord.js`);

module.exports = {
	name: `channel`,
	description: `Create or Delete a channel`,
	userPerms: [`MANAGE_CHANNELS`],
	botPerms: [`MANAGE_CHANNELS`],
	options: [
		{
			name: `create`,
			description: `Create a new channel`,
			type: Discord.ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: `name`,
					description: `New channel name`,
					type: Discord.ApplicationCommandOptionType.String,
					required: true,
				},
				{
					name: `type`,
					description: `Select a channel type`,
					type: Discord.ApplicationCommandOptionType.String,
					required: true,
					choices: [
						{ name: `Text`, value: `GUILD_TEXT` },
						{ name: `Voice`, value: `GUILD_VOICE` },
						{ name: `Stage Voice`, value: `GUILD_STAGE_VOICE` },
						{ name: `Category`, value: `GUILD_CATEGORY` },
						{ name: `News`, value: `GUILD_NEWS` },
					],
				},
			],
		},
		{
			name: `delete`,
			description: `Delete a channel. Careful with this, you can't get back your channel.`,
			type: Discord.ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: `channel`,
					description: `Channel to delete`,
					type: Discord.ApplicationCommandOptionType.Channel,
					required: true,
				},
			],
		},
	],
	run: async (client, interaction, LANG) => {

		if (interaction.options.getSubcommand() === `create`) {

			const channeltype = interaction.options.getString(`type`);
			const channelname = interaction.options.getString(`name`);

			if (channelname.length > 100) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.too_long)] });

			interaction.guild.channels.create(channelname, { type: channeltype }).then(channel => {
				const createdEmbed = new Discord.EmbedBuilder()
					.setColor(`Green`)
					.setDescription(LANG.created(channeltype.split(`_`)[1], channel));
				interaction.reply({ embeds: [createdEmbed] });
			});
		} else {
			const channel = interaction.options.getChannel(`channel`);
			channel.delete();
			const deletedEmbed = new Discord.EmbedBuilder()
				.setColor(`Green`)
				.setDescription(LANG.deleted(channel.name));
			interaction.reply({ embeds: [deletedEmbed] });
		}
	},
};
