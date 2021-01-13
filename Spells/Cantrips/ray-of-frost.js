var myStringArray = Array.from(game.user.targets)[0];
var arrayLength = game.user.targets.size;
for (var i = 0; i < arrayLength; i++) {
  console.log(myStringArray[i]);

  if (canvas.tokens.controlled.length == 0) return ui.notifications.error("Please select your token");
  let mainTarget = Array.from(game.user.targets)[i];
  let myToken = canvas.tokens.controlled[0];
  let halfGrid = canvas.scene.data.grid / 2;
  let srcX = (myToken.data.x + (myToken.data.width * halfGrid));
  let srcY = (myToken.data.y + (myToken.data.height * halfGrid));
  let tarX = (mainTarget.data.x + (mainTarget.data.width * halfGrid));
  let tarY = (mainTarget.data.y + (mainTarget.data.height * halfGrid));
  let outerRad = Math.sqrt(Math.pow(mainTarget.data.width * halfGrid, 2) + Math.pow(myToken.data.width * halfGrid, 2));

  let anDeg = -(Math.atan(((srcY - tarY) / (srcX - tarX))) * 57.3);
  let anDist = Math.sqrt(Math.pow(srcX - tarX, 2) + Math.pow(srcY - tarY, 2));
  async function wait(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }

  let anFile = "modules/JB2A_DnD5e/Library/Cantrip/Ray_Of_Frost/RayOfFrost_01_Blue_15ft_1000x400.webm";
  let anFileSize = 600;
  switch (true) {
    case (anDist <= 600):
      anFileSize = 600;
      anFile = "modules/JB2A_DnD5e/Library/Cantrip/Ray_Of_Frost/RayOfFrost_01_Blue_30ft_1600x400.webm";
      break;
    case (anDist > 2400):
      anFileSize = 2400;
      anFile = "modules/JB2A_DnD5e/Library/Cantrip/Ray_Of_Frost/RayOfFrost_01_Blue_45ft_2200x400.webm";
      break;
    default:
      anFileSize = 1200;
      anFile = "modules/JB2A_DnD5e/Library/Cantrip/Ray_Of_Frost/RayOfFrost_01_Blue_15ft_1000x400.webm";
      break;
  }

  let anScale = Math.sqrt(Math.pow(srcX - tarX, 2) + Math.pow(srcY - tarY, 2)) / anFileSize;
  let anScaleY = anScale;
  if (anDist <= 600) { anScaleY = 0.6 }
  if (anDist >= 800) { anScaleY = anScale }

  if (srcX > tarX) { anDeg = anDeg + 180 }
  if (srcX == tarX) { if (srcY > tarY) { anDeg = 90 } else { anDeg = -90 } }

  let spellAnim =
  {
    file: anFile,
    position: {
      x: srcX,
      y: srcY
    },
    anchor: {
      x: 0,
      y: 0.5
    },
    angle: anDeg,
    scale: {
      x: anScale,
      y: anScaleY
    }
  };

  canvas.fxmaster.playVideo(spellAnim);
  game.socket.emit('module.fxmaster', spellAnim);
  await wait(180);
}
