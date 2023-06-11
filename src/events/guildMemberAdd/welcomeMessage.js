const { AttachmentBuilder, EmbedBuilder } = require("discord.js");
const Canvas = require("canvas");
const Welcome = require("../../models/Welcome");

registerFont(`${__dirname}/../../assets/font/ArialTh.tth`, {
  family: "ArialTh",
});

const getWelcomeCanvas = async () => {
  let welcomeCanvas = {};
  welcomeCanvas.create = Canvas.createCanvas(1024, 500);

  let context = (welcomeCanvas.context = welcomeCanvas.create.getContext("2d"));
  context.font = "72px ArialTh";
  context.textAlign = "center";
  context.strokeStyle = "#323277";
  context.fillStyle = "#ffffff";

  const imgFolder = `${__dirname}/../../assets/img`;
  await Canvas.loadImage(`${imgFolder}/mikaWelcome.png`).then(async (img) => {
    context.drawImage(img, 0, -38, 1024, 576);
    context.strokeText("¡BIENVENIDO!", 512, 360);
    context.fillText("¡BIENVENIDO!", 512, 360);
    context.beginPath();
    context.arc(512, 166, 128, 0, Math.PI * 2, true);
    context.stroke();
    context.fill();
  });

  return welcomeCanvas;
};

module.exports = async (client, member) => {
  let welcome = await Welcome.findOne({
    guildId: member.guild.id,
  });

  if (!welcome) {
    console.log("No se ha registrado un canal de auto-mensajes de bienvenida.");
    return;
  }

  let welcomeMsg = `¡Bienvenido/a ${member}, soy <@1108378229439483945>!`;
  if (welcome.welcomeMessage) {
    welcomeMsg = `${welcomeMsg}\n${welcome.welcomeMessage}`;
  } else {
    welcomeMsg =
      `${welcomeMsg}\n` +
      "Por favor, asegúrate de haber leído correctamente todas nuestras normas, y por cualquier consulta no dudes en comunicarte con nuestro staff.";
  }

  let canvas = await getWelcomeCanvas();
  let context = canvas.context;
  context.font = "42px ArialTh";
  context.strokeText(member.user.tag, 512, 410);
  context.fillText(member.user.tag, 512, 410);
  context.beginPath();
  context.arc(512, 166, 119, 0, Math.PI * 2, true);
  context.closePath();
  context.clip();

  await Canvas.loadImage(
    member.user.displayAvatarURL({ extension: "png", size: 1024 })
  ).then(async (img) => {
    context.drawImage(img, 393, 47, 238, 238);
  });

  let attachment = new AttachmentBuilder(canvas.create.toBuffer(), {
    name: `welcome-${member.id}.png`,
  });

  const userTag = member.user.tag.split("#");
  let embed = new EmbedBuilder()
    .setTitle(`¡Bienvenido/a ${userTag[0]}!`)
    .setDescription(welcomeMsg)
    .setColor("#F2C4DE")
    .setImage(`attachment://welcome-${member.id}.png`);

  try {
    client.channels.cache.get(welcome.discordChannelId).send({
      embeds: [embed],
      files: [attachment],
    });
  } catch (error) {
    console.log(`Hubo un error enviando el canvas:\n${error}`);
  }
};
