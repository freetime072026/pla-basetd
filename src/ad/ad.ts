// Lớp mạng quảng cáo: game chỉ gọi 4 hàm dưới đây, không gọi SDK mạng trực tiếp.
//   whenReady()  → chờ SDK mạng sẵn sàng rồi mới khởi động Phaser
//   gameStart()  → người chơi bắt đầu tương tác lần đầu
//   gameEnd()    → hết màn / hiện end card
//   openStore()  → bấm CTA (Install / Play Now)
import { STORE_URL } from '../config';

declare const __PLA_NETWORK__: string;
declare const __PLA_API__: 'preview' | 'mraid' | 'mintegral' | 'meta' | 'google';

export const NETWORK = __PLA_NETWORK__;

type Mraid = {
  getState(): string;
  addEventListener(event: string, fn: (...a: unknown[]) => void): void;
  isViewable?(): boolean;
  open(url: string): void;
};
type AdWindow = Window & {
  mraid?: Mraid;
  FbPlayableAd?: { onCTAClick(): void };
  ExitApi?: { exit(): void };
  gameReady?: () => void;
  gameStart?: () => void;
  gameEnd?: () => void;
  install?: () => void;
};
const w = window as AdWindow;

function storeUrl(): string {
  const ios = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  return (ios && STORE_URL.ios) || STORE_URL.android;
}

export function whenReady(start: () => void): void {
  const mraid = w.mraid;
  if (__PLA_API__ !== 'mraid' || !mraid) {
    start();
    return;
  }
  // MRAID: đợi 'ready' rồi đợi quảng cáo hiện (viewable) mới chạy, tránh tốn thời lượng lúc preload.
  const whenViewable = () => {
    if (!mraid.isViewable || mraid.isViewable()) start();
    else mraid.addEventListener('viewableChange', function onView(v) { if (v) start(); });
  };
  if (mraid.getState() === 'loading') mraid.addEventListener('ready', whenViewable);
  else whenViewable();
}

export function gameStart(): void {
  if (__PLA_API__ === 'mintegral') w.gameStart?.();
}

export function gameEnd(): void {
  if (__PLA_API__ === 'mintegral') w.gameEnd?.();
}

export function openStore(): void {
  switch (__PLA_API__) {
    case 'mraid':
      if (w.mraid) w.mraid.open(storeUrl());
      else window.open(storeUrl(), '_blank');
      break;
    case 'mintegral':
      w.install?.();
      break;
    case 'meta':
      w.FbPlayableAd?.onCTAClick();
      break;
    case 'google':
      w.ExitApi?.exit();
      break;
    default:
      console.log('[PLA] openStore →', storeUrl());
      window.open(storeUrl(), '_blank');
  }
}

// Mintegral gọi gameReady khi game đã nạp xong.
export function notifyLoaded(): void {
  if (__PLA_API__ === 'mintegral') w.gameReady?.();
}
