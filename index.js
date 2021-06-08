//#region dependancies
require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs');
const Enmap = require('enmap');
const defaults = require('./configs/defaults.json');
const config = require('./configs/settings.json');
//#endregion

//#region client
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
//#endregion

//#region command loader
const load = dirs => {
    const commands = fs.readdirSync(`./commands/${dirs}/`).filter(d => d.endsWith('.js'));
    for (const file of commands) {
        const pull = require(`./commands/${dirs}/${file}`);
        if(!pull.help) {
            return console.log(`[Command Handler] Unable to find a help export in "./commands/${dirs}/${file}". Assuming its in WIP. Skipping...`);
        }
        else {
            if(pull.help.name) {
                client.commands.set(pull.help.name, pull);
                console.log(`[Command Handler] "${pull.help.name}" loaded!`);
            }
            else {
                return console.log(`[Command Handler] "./commands/${dirs}/${file}" does not have a name value in its help export. Skipping...`);
            }
            if(pull.help.aliases) pull.help.aliases.forEach(a => {
                client.aliases.set(a, pull.help.name);
                console.log(`[Command Handler] - "${a}" loaded!`);
            });
        }
    }
};
const commandsDir = fs.readdirSync('./commands/');
commandsDir.forEach(x => load(x));
console.log(`[Command Handler] Loaded ${client.commands.size} commands with ${client.aliases.size} aliases.`);
//#endregion

//#region ready listener
client.on('ready', () => {
    if(config.maintenance) {
        client.user.setPresence({
            status: "dnd",
            activity: {
                name: "Maintenance Mode | Only devs allowed"
            }
        });
    } else {
        let i = 1;
        setInterval(() => {
            switch (i) {
                case 1:
                    try {
                        client.user.setPresence({
                            status: "online",
                            activity: {
                                name: `with ${client.guilds.cache.get(config['main-server-id']).memberCount} members! | discord.gg/atE7gzs`
                            }
                        });
                    }
                    catch (err) {
                        console.log(err);

                        client.user.setPresence({
                            status: "online",
                            activity: {
                                name: `with the ${config.prefix}help command | discord.gg/atE7gzs`
                            }
                        });
                    }
                    i++;
                    break;
                case 2:
                    client.user.setPresence({
                        status: "online",
                        activity: {
                            name: `Minecraft | discord.gg/atE7gzs`
                        }
                    });
                    i++
                    break;
                default:
                    i = 1;
                    client.user.setPresence({
                        status: "online",
                        activity: {
                            name: `with 6gh | discord.gg/atE7gzs`
                        }
                    });
                    break;
            }
        }, 60000)

        client.user.setPresence({
            status: "online",
            activity: {
                name: `with 6gh | discord.gg/atE7gzs`
            }
        });
    }

    console.log(`${client.user.username} Ready`)
});
//#endregion

//login
client.login(process.env.TOKEN);