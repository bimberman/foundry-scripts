// Checks for Active Conditions Cub puts on targets.
// Uses Item Macro and Midi-qol. Add "ItemMacro" on item details on "On Use".
let actorD = args[0].actor;
let effectTypes = ["Deafended", "Blinded", "Incapacitated"];
let effect = actorD.effects.filter(i => effectTypes.includes(i.label));
for (let i = 0; i < effect.length; i++) {
  let condition = effect[i];
  if (condition) return ui.notifications.error(`You are currently ${condition.label}. You can not use this ability at this time.`);
}
let save = actorD.data.abilities.dex.save;
let roll = new Roll(`2d20kh + ${save}`).roll();
let dice_roll = roll.dice[0].results;
let get_dice = "";
for (let dice of dice_roll) {
  if (dice.discarded) {
    get_dice += `<li class="roll die d20 discarded">${dice.result}</li>`;
  }
  else {
    get_dice += `<li class="roll die d20">${dice.result}</li>`;
  }
}
let roll_results = `<div class="dice-roll"><p>Dexterity Saving Throw (Advantage)</p><div class="dice-result"><div class="dice-formula">${roll.formula}</div><div class="dice-tooltip"><div class="dice"><header class="part-header flexrow"><span class="part-formula">${roll.formula}</span><span class="part-total">${roll.total}</span></header><ol class="dice-rolls">${get_dice}</ol></div></div><h4 class="dice-total">${roll.total}</h4></div></div>`;
const chatMessage = game.messages.get(args[0].itemCardId);
let content = duplicate(chatMessage.data.content);
const searchString = '<div class="midi-qol-saves-display"></div>';
const replaceString = `<div class="midi-qol-saves-display">${roll_results}</div>`
content = content.replace(searchString, replaceString);
chatMessage.update({ content: content });
