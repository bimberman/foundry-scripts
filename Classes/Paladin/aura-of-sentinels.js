// later on will turn this into an enable disable trigger
(async () => {

  async function wait(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }

  const ActiveEffect = game.macros.getName("ActiveEffect");
  const ToggleIcon = game.macros.getName("ToggleIcon");
  const get_actor = game.actors.get(args[0].actor._id);
  const find_npc = canvas.tokens.placeables.find(t => t.name === get_actor.name);
  const init_bonus = await get_actor.getRollData().attributes.init.mod;
  const level = await get_actor.getRollData().classes.paladin.levels;
  const distance = await level >= 18 ? 34.5 : level >= 7 ? 14.5 : 0;
  const itemD = args[0].item;
  const effect_name = itemD.name;
  const img = itemD.img;

  async function get_targets(find_npc, target, distance, effect_name, img) {
    let get_target = await canvas.tokens.placeables.filter(target => (canvas.grid.measureDistance(find_npc.center, target.center) <= distance && find_npc.id != target.id && find_npc.data.disposition === target.data.disposition && !canvas.walls.checkCollision(new Ray(find_npc.center, target.center))));
    for (let target of get_target) {
      apply_aura(target, effect_name, img);
    }
  }

  async function remove_targets(find_npc, target, distance, effect_name, img) {
    let get_target = await canvas.tokens.placeables.filter(target => (canvas.grid.measureDistance(target.center, find_npc.center) > distance && find_npc.id != target.id && find_npc.data.disposition === target.data.disposition));
    for (let target of get_target) {
      remove_aura(target, effect_name, img);
    }
  }

  async function apply_aura(target, effect_name, img) {
    const effectData = {
      label: effect_name,
      icon: "systems/dnd5e/icons/skills/mech_4.jpg",
      changes: [{
        "key": "data.attributes.init.mod",
        "mode": 2,
        "value": init_bonus,
        "priority": 0
      }]
    }
    if (!target.actor.effects.find(ef => ef.data.label === effect_name)) {
      ActiveEffect.execute(target.id, effectData, "add");
      ToggleIcon.execute(target.id, img, "on");
    }
  }

  async function remove_aura(target, effect_name, img) {
    if (target.actor.effects.find(ef => ef.data.label === effect_name)) {
      ActiveEffect.execute(target.id, effect_name, "remove");
      ToggleIcon.execute(target.id, img, "off");
    }
  }

  Hooks.on("updateToken", async (scene, token, update, flags, id) => {
    let target = await canvas.tokens.get(token._id);
    let movement = await getProperty(update, "x") || await getProperty(update, "y");
    if (movement !== undefined) {
      await wait(500);
      remove_targets(find_npc, target, distance, effect_name, img);
      await wait(500);
      get_targets(find_npc, target, distance, effect_name, img);
    }
  });

})();
