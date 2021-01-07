// This script was adapted from Crymic's script that can be found here: https://gitlab.com/crymic/foundry-vtt-macros/-/blob/master/5e/Classes/Paladin/Core-Lay%20on%20Hands.js
let actorUpdate = game.macros.getName("ActorUpdate");
let healingEffect = game.macros.getName("HealingEffect");
let target = Array.from(game.user.targets)[0];
let illegal = ["undead", "construct"].some(type => (target.actor.data.data.details.type || "").toLowerCase().includes(type));
let actorD = actor || canvas.tokens.controlled[0].actor || game.user.character;
let itemD = actorD.items.find(i => i.name === "Lay on Hands");
let curtRes = itemD.data.data.uses.value;
let maxResRnd = itemD.data.data.uses.max / 5;
let curtResRnd = Math.floor(itemD.data.data.uses.value / 5);
let maxHealz = Math.clamped(itemD.data.data.uses.value, 0, target.actor.data.data.attributes.hp.max - target.actor.data.data.attributes.hp.value);
if (!target) return ui.notifications.error(`Please select a single target.`);
if (illegal) return ui.notifications.error(`You cannot use Lay on Hands on this target.`);
if (curtRes === null) return ui.notifications.warn(`You are out of the required resources.`);
let content_loh = `<p>Which <strong>Action</strong> would you like to do? [${curtRes}] points remaining.</p>`;
new Dialog({
  title: "Lay on Hands",
  content: content_loh,
  buttons: {
    cure: { label: "Cure Condition", callback: () => { loh_cure(); } },
    heal: { label: "Heal", callback: () => { loh_heal(); } }
  }
}).render(true);
// Condition Curing Function
function loh_cure() {
  let condition_list = ["Diseased", "Poisoned"];
  let effect = target.actor.effects.filter(i => condition_list.includes(i.data.label));
  let selectOptions = "";
  for (let i = 0; i < effect.length; i++) {
    let condition = effect[i].data.label;
    selectOptions += `<option value="${condition}">${condition}</option>`;
  }
  if (selectOptions === "") {
    return ui.notifications.warn(`There's nothing to Cure on ${target.name}.`);
  } else {
    let content_cure = `<p><em>${actorD.name} Lays on Hands on ${target.name}.</em></p><p>Choose a Condition Cure | [${curtResRnd}/${maxResRnd}] charges left.</p><form class="flexcol"><div class="form-group"><select id="element">${selectOptions}</select></div></form>`;
    new Dialog({
      title: "Lay on Hands: Curing",
      content: content_cure,
      buttons: {
        yes: {
          icon: '<i class="fas fa-check"></i>',
          label: 'Cure!',
          callback: (html) => {
            let element = html.find('#element').val();
            itemD.update({ "data.uses.value": curtRes - 5 });
            ChatMessage.create({
              user: game.user._id,
              speaker: ChatMessage.getSpeaker({ actor: actorD.name }),
              content: `${actorD.name} cures ${target.name} of 1 ${element} condition.`
            });
            healingEffect.execute(target, "cure");
          }
        }
      }
    }).render(true);
  }
}
// Healing Function
function loh_heal() {
  let content_heal = `<p><em>${actorD.name} lays hands on ${target.name}.</em></p><p>How many HP do you want to restore to ${target.name}?</p><form class="flexcol"><div class="form-group"><label for="num">HP to Restore: (Max = ${maxHealz})</label><input id="num" name="num" type="number" min="0" max="${maxHealz}"></input></div></form>`;
  new Dialog({
    title: "Lay on Hands: Healing",
    content: content_heal,
    buttons: {
      heal: {
        icon: '<i class="fas fa-check"></i>', label: 'Heal', callback: (html) => {
          let number = Math.floor(Number(html.find('#num')[0].value));
          if (number < 1 || number > maxHealz) {
            return ui.notifications.warn(`Invalid number of charges entered = ${number}. Aborting action.`);
          } else {
            itemD.update({ "data.uses.value": curtRes - number });
            actorUpdate.execute(target.id, ({ "data.attributes.hp.value": target.actor.data.data.attributes.hp.value + number }));
            ChatMessage.create({
              user: game.user._id,
              speaker: ChatMessage.getSpeaker({ actor: actorD.name }),
              content: `${actorD.name} heals ${target.name} for ${number} Hit Points.`
            });
            healingEffect.execute(target, "heal");
          }
        }
      }
    }
  }).render(true);
}
