import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from './config';
import { notifyLoaded, whenReady } from './ad/ad';
import { BootScene } from './scenes/BootScene';
import { GameScene } from './scenes/GameScene';
import { EndScene } from './scenes/EndScene';

whenReady(() => {
  new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    backgroundColor: '#231f20',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
    },
    // Không cần physics / audio của Phaser khi chưa có sound; bật lại khi Sound giao tệp.
    audio: { noAudio: true },
    banner: false,
    scene: [BootScene, GameScene, EndScene],
  });
  notifyLoaded();
});
