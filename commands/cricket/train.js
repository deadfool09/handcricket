const fs = require('fs');
const db = require('../../schemas/player.js');

module.exports = {
  name: 'train',
  aliases: ['coach'],
  description: 'Exercise, Fitness, Be Firm',
  category: 'Cricket',
  syntax: 'e.train',
  cooldown: 600,
  run: async (message, args, prefix, client) => {
    const data = await db.findOne({_id: message.author.id});
    
    const exercises = {};
    const trainFiles = fs.readdirSync('./commands/minigames');
    for(const trainFile of trainFiles) {
      const file = require(`../minigames/${trainFile}`);
      exercises[file.name] = file.run; 
    }
    
    const names = Object.keys(exercises);
    const randoName = names[Math.floor(Math.random() * names.length)];
    const randoGame = exercises[randoName];
    
    const execute = await randoGame(message, args, prefix, client, true);
    
    const msg = message;
    const win = execute[1];
    const amount = execute[2];
    updateCoins(message, win, amount, true);
    
    const quests = data.quests;
    const trainings = quests.beFit || 0;
    
    if(trainings != true) {
      quests.beFit = trainings + 1;
    }
    
    await db.findOneAndUpdate({_id: message.author.id}, {$set: {quests: quests}});
  }
};

async function updateCoins(message, win, amount) {
  const data = await db.findOne({_id: message.author.id});
  
  let coins = amount;
  if(win == true) {
    coins = amount * 1;
  } else if (win == false) {
    coins = (amount / 2).toFixed(0);
  }
  const oldcc = data.cc;
  await db.findOneAndUpdate({_id: data._id}, {$set: {cc: parseInt(data.cc) + parseInt(coins)}});
  return coins;
}