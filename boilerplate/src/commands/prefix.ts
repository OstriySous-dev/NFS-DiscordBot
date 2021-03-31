import { botCache, QueryResult } from "../../deps.ts";
import { PermissionLevels } from "../types/commands.ts";
import { createCommand, createSubcommand } from "../utils/helpers.ts";
import { parsePrefix } from "../monitors/commandHandler.ts";
import { Embed } from "../utils/Embed.ts";
import { db } from "../database/database.ts";

// This command will only execute if there was no valid sub command: !prefix
createCommand({
  name: "prefix",
  arguments: [
    {
      name: "subcommmand",
      type: "subcommand",
      required: false,
    },
  ],
  guildOnly: true,
  permissionLevels: [PermissionLevels.MEMBER],
  execute: (message) => {
    const embed = new Embed()
      .setTitle("Prefix Information")
      .setDescription(`**Current Prefix**: \`${parsePrefix(message.guildID)}\``)
      .setTimestamp();

    message.send({ embed });
  },
});

// Create a subcommand for when users do !prefix set $
createSubcommand("prefix", {
  name: "set",
  arguments: [
    {
      name: "prefix",
      type: "string",
      required: true,
      missing: (message) => {
        message.reply(`Please provide a prefix`);
      },
    },
  ],
  permissionLevels: [PermissionLevels.ADMIN],
  execute: async (message, args) => {
    if (args.prefix.length > 3) {
      return message.reply("Prefix input too long");
    }

    const oldPrefix = parsePrefix(message.guildID);
    botCache.guildPrefixes.set(message.guildID, args.prefix);
    const guilds = await db.query(
      "insert into GUILDS(id,prefix) values ($1,$2) on conflict (id) do update set prefix = excluded.prefix;",
      [message.guildID, args.prefix],
    ).catch((error) => {
      console.error(error);
    });
    if ((guilds as QueryResult).error) {
      console.log((guilds as QueryResult).error);
    }

    const embed = new Embed()
      .setTitle("Prefix changed")
      .setColor("0073E6")
      .setDescription([
        `**Old prefix**: \`${oldPrefix}\``,
        `**New prefix**: \`${args.prefix}\``,
      ])
      .setTimestamp();

    return message.send({ embed });
  },
});
