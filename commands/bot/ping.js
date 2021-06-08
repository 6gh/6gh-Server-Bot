// Get dependencies
const Discord = require('discord.js');
const fs = require('fs');

module.exports.run = async(args, client, message, config) => {
    let embed = new Discord.MessageEmbed()
        .setAuthor(client.user.username, client.user.avatarURL())
        .setDescription("Pinging...")
        .setFooter(`Status: Loading`)
        .setTimestamp(Date.now())
        .setColor(config["embed"].loading);

    const m = await message.channel.send(embed);
    m.edit(new Discord.MessageEmbed()
        .setAuthor(client.user.username, client.user.avatarURL())
        .setDescription(`🏓 Pong! ${m.createdTimestamp - message.createdTimestamp} ms`)
        .setFooter("Status: Completed")
        .setTimestamp(Date.now())
        .setColor(config["embed"].normal)
    );
};

module.exports.help = {
    name: "ping",
    description: "Get the ping of the bot",
    aliases: ["ms", "latency"],
    category: "bot",
    usage: "ping",
    nuke: false
};