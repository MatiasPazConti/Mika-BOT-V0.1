const {
  PermissionFlagsBits,
  ApplicationCommandOptionType,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  name: "edit-embed-thumbnail",
  description: "Descripción",
  options: [
    {
      name: "canal",
      description: "Ingrese el canal con el Embed a modificar.",
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
    {
      name: "mensaje",
      description: "Ingrese el ID del mensaje con el Embed a modificar.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "thumbnail",
      description: "Ingrese el enlace del nuevo thumbnail para el Embed.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.SendMessages],

  callback: async (interaction, client) => {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: "Este comando solo puede usarse en servidores.",
        ephemeral: true,
      });
      return;
    }

    try {
      await interaction.deferReply();

      const channelId = interaction.options.get("canal").value;
      const messageId = interaction.options.get("mensaje").value;
      const newThumbnail = interaction.options.get("thumbnail").value;

      const channel = client.channels.cache.get(channelId);
      const message = await channel.messages.fetch(messageId);
      const originalEmbed = message.embeds[0];

      const newEmbed = new EmbedBuilder()
        .setTitle(originalEmbed.title)
        .setDescription(originalEmbed.description)
        .setColor(originalEmbed.color)
        .setTimestamp()
        .setThumbnail(newThumbnail);

      if (originalEmbed.image) {
        newEmbed.setImage(originalEmbed.image);
      }

      message.edit({ embeds: [newEmbed] });

      await interaction.deleteReply();
    } catch (error) {
      console.log(`Hubo un error enviando el Embed:\n${error}`);
    }
  },
};
