const Discord = require("discordeno");
const config = require("./config.json");

const client = Discord.createBot({
    events: {
        ready(client, payload) {
            console.log(`Successfully connected Shard ${payload.shardId} to the gateway`);
        },
    },
    intents: ["Guilds", "GuildMessages"],
    token: config.token,
});

Discord.startBot(client);