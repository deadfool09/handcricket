const db = require("../schemas/player.js");
const Discord = require("discord.js");

module.exports = async function(batsman, bowler) {
  const embed = new Discord.MessageEmbed()
  .setTitle("Cricket Match - First Innings")
  .addField(batsman.username + " - Batsman", 0, true)
  .addField(bowler.username + " - Bowler", 0, true)
  .setColor("#2d61b5");

  const batEmbed = await batsman.send(embed);
  const ballEmbed = await bowler.send(embed);

  const batArray = [0];
  const ballArray = [0];
  
  loopBallCollection();
  loopBatCollection();

  async function loopBallCollection() {
    await bowler.dmChannel.awaitMessages(
      m => m.author.id === bowler.id,
      { max: 1, time: 30000, errors: ['time'] }
    ).then( async msgs => 
    {
      const m = msgs.first();
      const c = m.content;

      //End
      if (c === "end") {
        batsman.send(`**${bowler.username}** forfeited`);
        bowler.send(`You forfeited`);
        return;
      }
      //Communication
      else if (isNaN(c)) {
        batsman.send(`\`${bowler.username}\`: ${c}`);
        return loopBallCollection();
      }
      //Number Validation
      else if (c > 6) {
        m.react("❌");
        bowler.send('Max is 6');
        return loopBallCollection();
      }
      //Turn based
      else if (batArray.length < ballArray.length) {
        bowler.send("Wait for the batsman to hit the previous ball.");
        return loopBallCollection();
      } else {
        //Push it in array
        ballArray.push(parseInt(c));
        //Send confirm messages
        await bowler.send("You bowled " + c);
        await batsman.send("Ball is coming, hit it by typing a number.");
        return loopBallCollection();
      }
    }).catch(e => {
      if(e) {
        bowler.send('Match ended as you are inactive');
        batsman.send('Match ended as the bowler was inactive');
      }
    });
  }
  
  
  async function loopBatCollection() {
    await batsman.dmChannel.awaitMessages( m => m.author.id === batsman.id, 
      { max: 1, time: 30000, errors: ['time'] }
    ).then(async msgs => {
      const m = msgs.first();
      const c = m.content;
      //End
      if (c.toLowerCase() === "end") {
        batsman.send(`**${batsman.username}(You)** forfeited`);
        bowler.send(`**${batsman.username}** forfeited`);
        return;
      }
      //Communication
      else if (isNaN(c)) {
        bowler.send(`\`${batsman.username}\`:  ${c}`);
        return loopBatCollection();
      }
      //Wait for the ball
      else if (ballArray.length === batArray.length) {
        batsman.send("Wait for the ball dude");
        return loopBatCollection();
      }
      //Number validation
      else if (c > 6) {
        m.react("❌");
        return loopBatCollection();
      }

      const bowled = await ballArray[ballArray.length - 1];
      //Wicket
      if (parseInt(bowled) === parseInt(c)) {
        batsman.send("Wicket! You are out nab");
        bowler.send("Wicket! Pro!");
        await start2(batsman, bowler, batArray[batArray.length - 1] + 1);
        return;
      }

      const newScore = await batArray[batArray.length - 1] + parseInt(c);
      //Push
      if (parseInt(c) < 6) {
        batArray.push(newScore);
        
        const embed = new Discord.MessageEmbed()
        .setTitle("Cricket Match - First Innings")
        .addField(batsman.username + " - Batsman", newScore, true)
        .addField(bowler.username + " - Bowler", 0, true)
        .setColor("#2d61b5");

        await batsman.send(`You hit ${c} and you were bowled ${bowled}, **Scoreboard**`, {embed});
        await bowler.send(`Batsman hit ${c}, **Scoreboard**`, {embed});
        return loopBatCollection();
      }
    }).catch(e => {
      if(e) {
        batsman.send('Match ended as you were inactive.');
        bowler.send('Match ended as the batsman was inactive.');
      }
    });
  }
};

function start2(batsman, bowler, target) {
  const secondInnings = require("./innings2.js");
  secondInnings(batsman, bowler, target);
}