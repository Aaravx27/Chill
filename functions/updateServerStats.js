/**
 * 
 * @param {Client} client 
 * @param {Object} member 
 */
module.exports = function (client, member) {
    if (client.serverstatscooldown.has(member.guild.id)) return;
    member.guild.channels.fetch(client.settings.get(member.guild.id, "usercounter")).then(usercounterchannel => {
        if (usercounterchannel) { // check if channel still exists
            var memberCount = member.guild.members.cache.filter(member => !member.user.bot).size;
            memberCount = client.chill.fancyNumber(memberCount);
            usercounterchannel.setName(`📊Users: ${memberCount}`);
            client.serverstatscooldown.add(member.guild.id); // cooldown
            setTimeout(() => {
                client.serverstatscooldown.delete(member.guild.id);
            }, 15*60*1000);
        } else { //if channel doesn't exist delete usercounter from db disabling the feature
            client.settings.delete(member.guild.id, "usercounter");
        }
    })
}