const Discord = require("discord.js");
const config = require('../../config.json');

module.exports = {
    name: "rewards",
    aliases: ["reward"],
    category: "Xp",
    description: "Unlock roles based on your xp level",
    usage: "rewards [<set> <level> <role-id-or-name> | <delete> <role-id-or-name>] \n**e.g**\n\`rewards\`\n> lists all available rewards on this server\n\`rewards set randomrole 5\`\n> creates a new reward at level 5 for the role with randomrole name\n\`rewards delete 1234567890\`\n> deletes the reward for the role with 1234567890 id\n> You can change the level for an existing reward simply by doing \`rewards set\` again, but users who already had that role will keep it.",
    permission: "ADMINISTRATOR",
    run: async (client, msg, arg) => {

        const nopermEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
			.setTitle(`⛔ You don't have permission to use this!`)
		const noargsEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
			.setTitle(`⛔ Wrong arguments, check \`.help rewards\` to learn how to use this command.`)
		const nonegativeEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
			.setTitle(`⛔ Level can't be negative!`)
		const moduleDisabledEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
			.setTitle(`⛔ This module is disabled on this server!`)
        const norolefoundEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
			.setDescription(`⛔ That role ID or NAME doesn't exists on this server.`)
        const levelnanEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
			.setDescription(`⛔ The level you provided is not a number or is less than 1.`)
        const norewardEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
            .setTitle(`⛔ That reward doesn't exist`)
        const rewardlimitEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
            .setTitle(`⛔ You have reached the maximum number of rewards you can have at the same time. Delete some of them to add new ones.`)

		if (client.settings.get(msg.guild.id, "xpmodule") === "false") return msg.channel.send({embeds:[moduleDisabledEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
        
        let mode = arg[0];
        client.settings.ensure(msg.guild.id, {rewards: {}});

        if(!mode) { //list all rewards
            var rewards = client.settings.get(msg.guild.id, `rewards`);
            const rewardsEmbed = new Discord.MessageEmbed()
                .setColor(`RANDOM`)
                .setTitle(`Level Rewards`)
            for (const [key, value] of Object.entries(rewards)) {
                const checkrole = msg.guild.roles.cache.find(r => r.id === key);
                if (!checkrole) client.settings.delete(msg.guild.id, `rewards.${key}`);//check if role still exists otherwise delete it from the db
                else rewardsEmbed.addField(`${checkrole.name} \`${key}\``, `**Level: ${value}**`, true)
            };
            if (Object.keys(rewards).length < 1) rewardsEmbed.setDescription(`No rewards have been set yet.`)
            return msg.channel.send({embeds:[rewardsEmbed]}).then(msg =>setTimeout(() => msg.delete(), 30000));
        } else if(mode !== "set" && mode !== "delete") return msg.channel.send({embeds:[noargsEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));

        if (mode === "set") { //create a new reward or change its level
            if (!msg.member.permissions.has("ADMINISTRATOR")) return msg.channel.send({embeds:[nopermEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
            var level = arg[1];
            var role = arg.slice(2).join(" ");
            if (!role || !level) return msg.channel.send({embeds:[noargsEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
            if (isNaN(level) || level < 1) return msg.channel.send({embeds:[levelnanEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
            if (isNaN(role)) { //if string search role in the guild
                role = msg.guild.roles.cache.find(r => r.name === role);
                if (!role) return msg.channel.send({embeds:[norolefoundEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
                else role = role.id;
            } else { //else check if role id exists
                const checkrole = msg.guild.roles.cache.find(r => r.id === role);
                if (!checkrole) return msg.channel.send({embeds:[norolefoundEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
            }
            //check rewards limit
            var rewards = client.settings.get(msg.guild.id, `rewards`);
            if (Object.keys(rewards).length > config.music_queue_limit-1) return msg.channel.send({embeds:[rewardlimitEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
            //set
            client.settings.set(msg.guild.id, level, `rewards.${role}`);
            const setEmbed = new Discord.MessageEmbed()
                .setColor(`RANDOM`)
                .setTitle(`Level Rewards`)
                .setDescription(`Set the role **${msg.guild.roles.cache.find(r => r.id === role).name}** \`${role}\` to be awarded at level **${level}**.`)
            return msg.channel.send({embeds:[setEmbed]}).then(msg =>setTimeout(() => msg.delete(), 10000));
        }
        if (mode === "delete") { //delete a reward
            if (!msg.member.permissions.has("ADMINISTRATOR")) return msg.channel.send({embeds:[nopermEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
            var role = arg.slice(1).join(" ");
            if (!role) return msg.channel.send({embeds:[noargsEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
            if (isNaN(role)) { //if string search role in the guild
                role = msg.guild.roles.cache.find(r => r.name === role);
                if (!role) return msg.channel.send({embeds:[norolefoundEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
                else role = role.id;
            } else { //else check if role id exists
                const checkrole = msg.guild.roles.cache.find(r => r.id === role);
                if (!checkrole) return msg.channel.send({embeds:[norolefoundEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
            }

            if(client.settings.has(msg.guild.id, `rewards.${role}`)) {
                client.settings.delete(msg.guild.id, `rewards.${role}`);
                const deletedEmbed = new Discord.MessageEmbed()
                    .setColor(`RANDOM`)
                    .setTitle(`Level Rewards`)
                    .setDescription(`Deleted the role **${msg.guild.roles.cache.find(r => r.id === role) ? msg.guild.roles.cache.find(r => r.id === role).name: null}** \`${role}\` from the Rewards.`)
                return msg.channel.send({embeds:[deletedEmbed]}).then(msg =>setTimeout(() => msg.delete(), 10000));
            }
            else return msg.channel.send({embeds:[norewardEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
        }
    }
}