import { config } from "dotenv";
// import {
//   Client,
//   GatewayIntentBits,
//   ClientPresence,
//   Application,
// } from "discord.js";

// const client = new Client({
//   intents: [
//     GatewayIntentBits.Guilds,
//     GatewayIntentBits.GuildMessages,
//     GatewayIntentBits.GuildPresences,
//     GatewayIntentBits.GuildMembers,
//   ],
// });
config();

// client.login(process.env.DISCORD_BOT_TOKEN);
console.log(process.env);
console.log(process.env.DISCORD_BOT_TOKEN);
