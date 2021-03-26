const db = require("../schemas/player.js");
const Discord = require("discord.js");
const getEmoji = require('../index.js');

//shuffled
module.exports = async function(bowler, batsman, target) {
  const emoji = await getEmoji;

  bowler.send("2nd Innings starts");
  batsman.send("2nd Innings starts");

  const embed = new Discord.MessageEmbed()
  .setTitle('Cricket Match - Second Innings')
  .addField(batsman.username + ' - Batsman', 0, true)
  .addField(bowler.username + ' - Bowler', target, true)
  .setColor('#2d61b5');

  //Embeds
  const batEmbed = await batsman.send(embed);
  const ballEmbed = await bowler.send(embed);

  //Arrays
  const batArray = [0];
  const ballArray = [0];
  
  loopBallCollect();
  loopBatCollect();

  async function loopBallCollect() {
    bowler.dmChannel.createMessageCollector(
        m => m.author.id === bowler.id,
        {max: 1, time: 30000, errors: ['time']}
    ).then( async msgs => {
      const m = msgs.first();
      const c = m.content;

      //End
      if (c.toLowerCase().trim() === 'end') {
        bowler.send('You forfeited');
        batsman.send(`**${bowler.username}** forfeited`);
        return;
      }
      //Communicatiom
      else if (isNaN(c)) {
        batsman.send(`\`${bowler.username}\`: ${c}`);
        return loopBallCollect();
      }
      //Number Validation
      else if (parseInt(c) > 6) {
        m.react('❌');
        return loopBallCollect();
      }
      //Turn based
      else if (batArray.length < ballArray.length) {
        m.reply('Wait for the batsman to hit your previous ball!');
        return loopBallCollect();
      }
      //Push
      else {
        ballArray.push(parseInt(c));
        await bowler.send('You bowled ' + c);
        await batsman.send('Ball is coming...');
        return loopBallCollect();
      }
    }).catch(e => {
      if(e) {
        bowler.send('Match ended as u were unactive for a long time');
        batsman.send('Match ended as the batsman was inactive.');
      }
    });
  }
  
  async function loopBatCollect() {
    batsman.dmChannel.createMessageCollector(
        m => m.author.id === batsman.id,
        {max: 1, time: 30000, errors: ['time']}
    ).then(async msg => {
      const c = m.content;
      const bowled = await ballArray[ballArray.length - 1];

      //End
      if (c.toLowerCase().trim() === "end") {
        batsman.send('You forfeited');
        bowler.send(`**${batsman.username}** forfeited`);
        return;
      }
      //Communication
      else if (isNaN(c)) {
        bowler.send(`\`${batsman.username}\`: ${c}`);
        return loopBatCollect();
      }

      //Number Validation
      else if (parseInt(c) > 6) {
        m.react('❌');
        return loopBatCollect();
      }

      //Turn Based
      else if (batArray.length === ballArray.length) {
        m.reply('Wait for the ball dude.');
        return loopBatCollect();
      }

      //Wicket
      else if (parseInt(c) === parseInt(bowled)) {
        const data = await db.findOne({
          _id: batsman.id
        });

        let coinMulti = data.coinMulti;
        if (coinMulti === 0) coinMulti = 0.2;

        const multi = coinMulti * 696;

        const coins = Math.random().toFixed(2) * multi.toFixed(0);

        bowler.send(`Wicket! Piro! You won a grand amount of ${emoji} ${coins} coins`);
        batsman.send('Wicket! Noob!');

        rewards(bowler, batsman, coins);
        return;
      }

      const newScore = await batArray[batArray.length - 1] + parseInt(c);

      //Target
      if (parseInt(newScore) >= target) {
        const data = await db.findOne({
          _id: batsman.id
        });

        let coinMulti = data.coinMulti;
        if (coinMulti === 0) coinMulti = 0.2;

        const multi = coinMulti * 696;

        const coins = Math.random().toFixed(2) * multi.toFixed(0);

        bowler.send('You lost.., The Batsman\'s score is ' + newScore);
        batsman.send(`You won the match! and also a grand amount of ${emoji} ${coins} coins`);

        rewards(batsman, bowler, coins);
        return;
      }
      //Push
      else {
        batArray.push(parseInt(newScore));

        const embed = new Discord.MessageEmbed()
        .setTitle('Cricket Match - Second Innings')
        .addField(batsman.username + ' - Batsman', parseInt(newScore), true)
        .addField(bowler.username + ' - Bowler', target, true)
        .setColor('#2d61b5');

        batsman.send(`You hit ${c} and you were bowled ${bowled}`, {embed});
        bowler.send(`${batsman.username} hit ${c}`, {embed});
        return loopBatCollect();
      }
    }).catch(e => {
      if(e) {
        batsman.send('Match ended as you were inactive');
        bowler.send('Match ended as the batsmam was inactive');
      }
    });
  }
  
};

function rewards(winner, loser, coins) {
  const rewards = require('./rewards.js');
  rewards(winner, loser, coins);
}