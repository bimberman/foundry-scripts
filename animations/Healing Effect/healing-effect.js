// This script was developed with assistance from Crymic
let target = args[0];
let effect = `modules/JB2A_DnD5e/Library/Generic/Healing/HealingAbility_01_${args[1]}_200x200.webm`;
let mainTarget = target;
let halfGrid = canvas.scene.data.grid / 2;
let tarX = (mainTarget.data.x + (mainTarget.data.width * halfGrid));
let tarY = (mainTarget.data.y + (mainTarget.data.height * halfGrid));
let tarScale = ((mainTarget.data.width + mainTarget.data.height) / 2);
let spellAnim =
{
  file: effect,
  position: {
    x: tarX,
    y: tarY
  },
  anchor: {
    x: 0.5,
    y: 0.5
  },
  angle: 0,
  scale: {
    x: tarScale,
    y: tarScale
  }
};
canvas.fxmaster.playVideo(spellAnim);
game.socket.emit('module.fxmaster', spellAnim);
