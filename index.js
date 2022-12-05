import { config } from "dotenv";
import ai from "./ai.js"
import {
  Client,
  GatewayIntentBits,
} from "discord.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});
config();

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;
  const res = await ai(msg.content);
  msg.reply({ content: res.data.choices[0].text });
})

client.login(process.env.DISCORD_BOT_TOKEN);
