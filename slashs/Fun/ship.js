const Discord = require("discord.js");

module.exports = {
    name: "ship",
    description: "Ship 2 Users to check the affinity between them",
    options: [
        {
            name: 'user1',
            description: 'Select 1st user',
            type: 'USER',
            required: true,
        },
        {
            name: 'user2',
            description: 'Select 2nd user',
            type: 'USER',
            required: true,
        },
    ],
    run: async (client, interaction, arg) => {

        const nonamesEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Enter 2 names to ship`)

        let user1 = interaction.options.getMember('user1');
        let user2 = interaction.options.getMember('user2');
        var ship = Math.floor(Math.random() * 100) + 1;

        let bar = "";
        for (var i=0; i < Math.round(ship/10) ; i++) {
            bar += "⬜";
        }
        for (var i=0; i < 10-Math.round(ship/10) ; i++) {
            bar += "🔳";
        }

        let shipEmbed = new Discord.MessageEmbed()
            .setFooter({text:`${bar} ${ship}%`});

        switch (true) {
            case (ship>=0 && ship <=19):
                shipEmbed
                    .setColor(`640000`)
                    .setTitle(`💔 SHIP 💔`)
                    .setDescription(`🔻 ${user1}\n🔺 ${user2}\n**Do not match at all**`)
                break;
            case (ship>=20 && ship <=49):
                shipEmbed
                    .setColor(`960000`)
                    .setTitle(`❤️ SHIP ❤️`)
                    .setDescription(`🔻 ${user1}\n🔺 ${user2}\n**Do not match well**`)
                break;
            case (ship>=50 && ship <=89):
                shipEmbed
                    .setColor(`C80000`)
                    .setTitle(`💓 SHIP 💓`)
                    .setDescription(`🔻 ${user1}\n🔺 ${user2}\n**Match very well**`)
                break;
            case (ship>=90 && ship <=100):
                shipEmbed
                    .setColor(`FA0000`)
                    .setTitle(`💗 SHIP 💗`)
                    .setDescription(`🔻 ${user1}\n🔺 ${user2}\n**Are meant to eachother**`)
                break;
        };
        interaction.reply({embeds:[shipEmbed]});
    }
}
