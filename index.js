import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const command = new SlashCommandBuilder()
  .setName("post")
  .setDescription("Post meme sang server chính")
  .addAttachmentOption(opt =>
    opt.setName("file").setDescription("Ảnh / video").setRequired(true)
  )
  .addStringOption(opt =>
    opt.setName("credit").setDescription("Nguồn meme").setRequired(false)
  );

const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);

client.once("ready", async () => {
  console.log(`Bot logged in as ${client.user.tag}`);

  await rest.put(
    Routes.applicationCommands(client.user.id),
    { body: [command.toJSON()] }
  );

  console.log("Slash command registered");
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== "post") return;

  const file = interaction.options.getAttachment("file");
  const credit = interaction.options.getString("credit") || "unknown";

  const channel = await client.channels.fetch(process.env.TARGET_CHANNEL_ID);

  await channel.send({
    content:
      `🔥 **MEME MỚI**\n` +
      `👤 Đăng bởi: ${interaction.user}\n` +
      `🏷️ Credit: ${credit}`,
    files: [file.url]
  });

  await interaction.reply({
    content: "✅ Đã đăng meme!",
    ephemeral: true
  });
});

client.login(process.env.BOT_TOKEN);
