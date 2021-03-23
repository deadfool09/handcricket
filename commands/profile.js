const db = require("../schemas/player.js");
const Discord = require("discord.js");
const getEmoji = require('../index.js');

module.exports = {
  name: 'profile',
  aliases: ['pf',
    'info'],
  category: 'handcricket',
  description: 'Shows the profile of a user.',
  run: async ({
    message
  }) => {
    const emoji = await getEmoji;

    const data = await db.findOne({
      _id: message.author.id
    }).catch((e) => {
      if(e) {
        console.log(e);
        message.reply("Do !start before you can play.");
        return;
      }
    });

    const embed = new Discord.MessageEmbed()
    .setTitle(`Profile of **${message.author.username}**`)
    .addField("Balance", ` ${emoji} ${data.cc}`, true)
    .addField("Wins", data.wins, true)
    .addField('Inventory', 'nil')
    .addField("Toss Multi", data.tossMulti, true)
    .addField("Coins Multi", data.goldMulti, true)
    .setFooter(data.startedOn)
    .setColor('#2d61b5')

    message.reply(embed);
  }
}