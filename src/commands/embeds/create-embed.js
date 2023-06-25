const {
  PermissionFlagsBits,
  ApplicationCommandOptionType,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  name: "create-embed",
  description: "Descripción",
  options: [
    {
      name: "canal",
      description: "Ingrese el canal donde se enviará el Embed.",
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
    {
      name: "título",
      description: "Ingrese el título del Embed.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "descripción",
      description: "Ingrese la descripción del Embed.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "color",
      description: "Ingrese el valor HEX del color del Embed.",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.SendMessages],

  callback: async (client, interaction) => {
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
      const embedTitle = interaction.options.get("título").value;
      const embedDescription = interaction.options.get("descripción").value;
      const embedColor = interaction.options.get("color")?.value || "#F2C4DE";
      const embedImage = interaction.options.get("imagen")?.value || "";
      const embedThumbnail = interaction.options.get("thumbnail")?.value || "";
      const embedFooter = interaction.options.get("footer")?.value || "";

      let newDescription = "";
      const nArray = embedDescription.toString().split("\n");
      for (let n = 0; n < nArray.length; ++n) {
        if (n > 0) {
          newDescription = newDescription + "\n";
        }
        const tArray = nArray[n].split("\t");
        for (let t = 0; t < tArray.length; ++t) {
          if (t > 0) {
            newDescription = newDescription + "\t";
          }
          newDescription = newDescription + tArray[t];
        }
      }

      const newEmbed = new EmbedBuilder()
        .setTitle(embedTitle)
        .setDescription(newDescription)
        .setColor(`${embedColor}`)
        .setTimestamp();

      if (embedImage) {
        newEmbed.setImage(embedImage);
      }
      if (embedThumbnail) {
        newEmbed.setThumbnail(`${embedThumbnail}`);
      }
      if (embedFooter) {
        newEmbed.setFooter({
          text: `${embedFooter}`,
          iconURL: interaction.member.displayAvatarURL({ dynamic: true }),
        });
      }

      client.channels.cache.get(channelId).send({ embeds: [newEmbed] });

      await interaction.deleteReply();
    } catch (error) {
      console.log(`Hubo un error enviando el Embed:\n${error}`);
    }
  },
};
