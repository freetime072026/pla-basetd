import Phaser from 'phaser';

// Nút CTA dùng chung (placeholder hình khối — Art thay bằng sprite nút).
export function addCtaButton(scene: Phaser.Scene, x: number, y: number, text: string, onClick: () => void): Phaser.GameObjects.Container {
  const bg = scene.add.rectangle(0, 0, 420, 110, 0x4caf50).setStrokeStyle(6, 0xffffff);
  const label = scene.add.text(0, 0, text, { fontFamily: 'Arial', fontSize: '48px', fontStyle: 'bold', color: '#ffffff' }).setOrigin(0.5);
  const button = scene.add.container(x, y, [bg, label]).setSize(420, 110);
  button.setInteractive({ useHandCursor: true }).on('pointerdown', onClick);
  scene.tweens.add({ targets: button, scale: 1.06, duration: 600, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
  return button;
}
