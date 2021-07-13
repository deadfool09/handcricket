const db = require("../schemas/items.js");
const cardsDB = require('../schemas/card.js')






module.exports = async function (amount, data, msg, name, ovr = 1) {
  if (name === 'loot') {
    const random = Math.random();
    
    const itemsData = await db.find({
      name: {
        $ne: 'lootbox'
      }
    });
    
    const items = [];
    
    itemsData.forEach(data => {
      items.push(data.name);
    });
    
    items.push('decor');
    items.push(259);
    
    const toReturn = choose();
    return toReturn;
    
    function choose() {
      const reward = items[Math.floor(Math.random() * items.length)];
      if(reward === 'decor') {
        const rando = Math.random();
        if(rando < 0.2) {
          return reward;
        }
        return 250;
     }
      return reward;
    }
  } else if (name === 'cricket') {
    let rewards = []
    let allCards = (await cardsDB.find({
      ovr: ovr < 0 ? { $lte: Math.abs(ovr) } : { $gte: ovr }
    })).filter(card => !data.cards?.includes(card.fullname))
    
    let starters = amount === 11 ? {
      'bat': 4, 'bowl': 3, 'ar': 2, 'wk': 2,
      batc: [], bowlc: [], arc: [], wkc: [],
    } : false
    if (starters) return await pickStarters()
    
    for (let i = 0; i < amount; i++) {
      let random = Math.random()
      let sliceStart = random < 0.80
                       ? 0
                       : random < 0.97
                       ? allCards.length/5
                       : random < 0.99
                       ? allCards.length/3
                       : allCcards.length/2
      let sliceEnd = random < 0.80
                     ? allCards.length - allCards.length/3
                     : random < 0.97
                     ? allCards.length - allCards.length/5
                     : allCards.length
      
      let slicedCards = allCards.slice(Math.floor(sliceStart), Math.floor(sliceEnd))
      let reward = slicedCards[Math.floor(Math.random() * slicedCards.length)]
      
      if (amount === 1) return reward
      else rewards.push(reward)
      
      allCards.splice(allCards.indexOf(reward), 1)
    }
    
    function pickStarters() {
      allCards = allCards.map(c => {
        if (c.role === 'bat') starters.batc.push(c)
        else if (c.role === 'bowl') starters.bowlc.push(c)
        else if (c.role === 'ar') starters.arc.push(c)
        else starters.wkc.push(c)
      })
      
      for (let i = 0; i < amount; i++) {
        if (i < 4) {
          rewards.push(starters.batc[Math.floor(Math.random() * starters.batc.length)])
        } else if (i < 7) {
          
        } else if (i < 9) {
          
        } else {
          
        }
      }
    }
    
    return rewards
  }
};