import { configs } from "../../configs.ts";
import {
  Configuration,
  PgClient,
  PgManager,
  QueryResult,
  botCache
} from "./../../deps.ts";

const manager: PgManager = new PgManager(configs.db as Configuration);
const client: PgClient = manager.getClient();

export const db = {
  manager: manager,
  client: client,
  //deno-lint-ignore no-explicit-any
  query: async function query(statement: string, params?: any[]) {
    const result: QueryResult = await client.query(statement, params);
    return result;
  },
};

// Sync db
// Guilds
const createGuildTable = await db.query(`create table if not exists guilds
  (
      id text NOT NULL,
      prefix text,
      language text,
      CONSTRAINT guilds_pkey PRIMARY KEY (id)
  )`);

if ((createGuildTable as QueryResult).error) {
  throw new Error((createGuildTable as QueryResult).error);
}

// Load collections
const guilds = await db.query(
  "select * from guilds where prefix is not null or language is not null",
).catch(console.error);
if ((guilds as QueryResult).error) {
  throw new Error((guilds as QueryResult).error);
}

const guildsObj = (guilds as QueryResult).rowsToObjects();
let count = guildsObj.length;

for (let i = 0; i < count; i++) {
  const guild = guildsObj[i];
  if (guild.language) {
    botCache.guildLanguages.set(guild.id as string, guild.language as string);
  }
  if (guild.prefix !== configs.prefix) {
    botCache.guildPrefixes.set(guild.id as string, guild.prefix as string);
  }
}
