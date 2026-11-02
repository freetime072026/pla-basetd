import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH, PLAY_SECONDS } from '../config';
import { gameStart, openStore } from '../ad/ad';
import { addCtaButton } from '../ui/cta';

// Màn chơi placeholder: bàn 3×3, chạm ô trống sinh lính cấp 1, chạm 2 lính cùng cấp liên tiếp để gộp.
// GD/Lead thay bằng gameplay thật theo GDD của PLA.
const COLS = 3;
const ROWS = 3;
const CELL = 180;
const LEVEL_COLORS = [0xf4b860, 0x7ec8a9, 0x6ea8e0, 0xc58ae0, 0xe0636e];

export class GameScene extends Phaser.Scene {
  private _levels: number[] = [];
  private _units: (Phaser.GameObjects.Container | null)[] = [];
  private _picked = -1;
  private _started = false;
  private _merges = 0;

  constructor() {
    super('Game');
  }

  create(): void {
    this._levels = new Array(COLS * ROWS).fill(0);
    this._units = new Array(COLS * ROWS).fill(null);
    this._picked = -1;
    this._started = false;
    this._merges = 0;

    this.add.text(GAME_WIDTH / 2, 140, 'Tap to summon · tap two equals to merge', {
      fontFamily: 'Arial', fontSize: '30px', color: '#ffffff', align: 'center', wordWrap: { width: 640 },
    }).setOrigin(0.5);

    const left = (GAME_WIDTH - COLS * CELL) / 2 + CELL / 2;
    const top = 420;
    for (let i = 0; i < COLS * ROWS; i++) {
      const x = left + (i % COLS) * CELL;
      const y = top + Math.floor(i / COLS) * CELL;
      this.add.rectangle(x, y, CELL - 12, CELL - 12, 0x3a3335).setStrokeStyle(4, 0x5a4f52)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this.onCell(i, x, y));
    }

    addCtaButton(this, GAME_WIDTH / 2, GAME_HEIGHT - 140, 'PLAY NOW', openStore);
  }

  private onCell(i: number, x: number, y: number): void {
    if (!this._started) {
      this._started = true;
      gameStart();
      this.time.delayedCall(PLAY_SECONDS * 1000, () => this.finish());
    }

    if (this._levels[i] === 0) {
      this._levels[i] = 1;
      this._units[i] = this.makeUnit(x, y, 1);
      this._picked = -1;
      return;
    }

    if (this._picked < 0 || this._picked === i) {
      this._picked = i;
      this.tweens.add({ targets: this._units[i], scale: 1.12, duration: 80, yoyo: true });
      return;
    }

    const from = this._picked;
    this._picked = -1;
    if (this._levels[from] !== this._levels[i] || this._levels[i] >= LEVEL_COLORS.length) return;

    const level = this._levels[i] + 1;
    this._units[from]?.destroy();
    this._units[i]?.destroy();
    this._levels[from] = 0;
    this._units[from] = null;
    this._levels[i] = level;
    this._units[i] = this.makeUnit(x, y, level);
    this.tweens.add({ targets: this._units[i], scale: { from: 1.4, to: 1 }, duration: 200, ease: 'Back.Out' });

    if (++this._merges >= 4) this.finish();
  }

  private makeUnit(x: number, y: number, level: number): Phaser.GameObjects.Container {
    const body = this.add.circle(0, 0, 60, LEVEL_COLORS[level - 1]).setStrokeStyle(5, 0xffffff);
    const label = this.add.text(0, 0, String(level), { fontFamily: 'Arial', fontSize: '48px', color: '#231f20' }).setOrigin(0.5);
    return this.add.container(x, y, [body, label]);
  }

  private finish(): void {
    if (!this.scene.isActive()) return;
    this.scene.start('End');
  }
}
