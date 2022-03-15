const Discord = require("discord.js");
const fetch = require('node-fetch');

module.exports = {
    name: "today",
    description: "Shows a random historycal fact happened on this day",
    options: null,
    run: async (client, interaction, arg) => {

        const text = await fetch('http://history.muffinlabs.com/date')
            .then(response => response.json());
        const events = text.data.Events;
        if (!events) {
            const noEventEmbed = new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setTitle(text.date)
                .setDescription('*Nothing happened. Just a normal boring day...*')
            return interaction.reply({embeds:[noEventEmbed]});
        } else {
            const event = events[Math.floor(Math.random() * events.length)];
            const embed = new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setURL(text.url)
                .setTitle(text.date)
                .setDescription(`${event.year}: ${event.text}`);
            return interaction.reply({embeds:[embed]}).catch(console.error);
        }
    }
}