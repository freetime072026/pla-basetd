import Phaser from 'phaser';

// Nạp asset. Ảnh/âm thanh import từ src/assets/ (Vite nhúng thành data URL trong file HTML cuối):
//   import heroUrl from '../assets/hero.webp';
//   this.load.image('hero', heroUrl);
export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload(): void {
    // Chưa có asset — GameScene vẽ placeholder bằng hình khối.
  }

  create(): void {
    this.scene.start('Game');
  }
}
