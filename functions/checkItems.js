const db = require("../schemas/items.js");
const Discord = require("discord.js");

module.exports = async function (message) {
  
  const args = message.content.toLowerCase().trim().split(' ').slice(1);
  
  //Amount
  let itemAmountArray = args.slice(-1);
  let itemAmount = itemAmountArray[0];
  
  //Name
  let itemNameArray = args.pop();
  if(isNaN(itemAmount)) { itemNameArray = args; }
  console.log(itemNameArray);
  let itemName = itemNameArray.join(' ');
  
  if(!itemAmount || isNaN(itemAmount)) {
    itemAmount = 1;
  }
  
  /*redbull, nuts, dot, magikball, coinboost, tossboost, lootbox */
  if(itemName === "red bull" || itemName === "redbull") {
    itemName = "redbull";
  }
  if(itemName === "nuts" || itemName === "nut") {
    itemName = "nuts";
  }
  if(itemName === "dots" || itemName === "dot") {
    itemName = "dots";
  }
  if(itemName === "magik ball" || itemName === "magikball") {
    itemName = "magikball";
  }
  if(itemName === "coin boost" || itemName === "coinboost") {
    itemName = "coinboost";
  }
  if(itemName === "toss boost" || itemName === "tossboost") {
    itemName = "tossboost";
  }
  
  const itemData = db.findOne({name: itemName}).catch((e) => console.log(e));
  
  if(!itemData) {
    message.reply("Invalid Item");
    return;
  }
  
  await console.log(itemName, itemAmount, itemData);
  
  return [itemName, itemAmount];
};