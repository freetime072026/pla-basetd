import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config';
import { gameEnd, openStore } from '../ad/ad';
import { addCtaButton } from '../ui/cta';

// End card: logo/tên game + CTA. Chạm bất kỳ đâu cũng mở store (chuẩn chung của playable).
export class EndScene extends Phaser.Scene {
  constructor() {
    super('End');
  }

  create(): void {
    gameEnd();
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.6)
      .setInteractive()
      .on('pointerdown', openStore);
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 160, 'Purrge!', {
      fontFamily: 'Arial', fontSize: '96px', fontStyle: 'bold', color: '#f4b860',
    }).setOrigin(0.5);
    addCtaButton(this, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 120, 'INSTALL', openStore);
  }
}
