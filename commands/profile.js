const db = require("../schemas/player.js");
const Discord = require("discord.js");
const getEmoji = require('../index.js');

module.exports = {
  name: 'profile',
  aliases: ['pf', 'info'],
  category: 'handcricket',
  cooldown: '10s',
  description: 'Shows the profile of a user.',
  run: async ({
    message
  }) => {
    const emoji = await getEmoji;

    const data = await db.findOne({
      _id: message.author.id
    }).catch((e) => {
      console.log(e);
    });
    
    if (!data) {
      message.reply(message.author.tag + " is not a player. Do `!start`");
      return;
    }
    
    let cb = '';
    if(data.coinBoost) {
      cb = ' ⏳';
    }
    let tb = '';
    if(data.tossBoost) {
      tb = ' ⏳';
    }
    const embed = new Discord.MessageEmbed()
    .setTitle(`Profile of **${message.author.username}**`)
    .addField("Balance", ` ${emoji} ${data.cc}`, true)
    .addField("Wins", data.wins, true)
    .addField("Toss Multi", data.tossMulti + tb, true)
    .addField("Coins Multi", data.coinMulti + cb, true)
    .setFooter(data.startedOn)
    .setColor('#2d61b5')

    message.reply(embed);
  }
}