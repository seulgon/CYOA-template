import { useState, useEffect } from 'react';
import { gameImagePreloader, type ImagePreloadState } from '../utils/imagePreloader';
import { isMobileLikeDevice } from '../utils/mobileOptimization';

const CRITICAL_IMAGE_URLS = [
  './assets/images/intro/1.webp',
  './assets/images/intro/noimage.webp',
  './assets/images/frame/card_frame.webp',
  './assets/images/intro/violet_intro.webp',
];

const scheduleWhenIdle = (callback: () => void): (() => void) => {
  const browserWindow = window as Window & {
    requestIdleCallback?: (callback: () => void, options?: { timeout?: number }) => number;
    cancelIdleCallback?: (id: number) => void;
  };

  if (browserWindow.requestIdleCallback) {
    const idleId = browserWindow.requestIdleCallback(callback, { timeout: 1500 });
    return () => browserWindow.cancelIdleCallback?.(idleId);
  }

  const timeoutId = window.setTimeout(callback, 800);
  return () => window.clearTimeout(timeoutId);
};

export function useImagePreloader(phase: string): ImagePreloadState {
  const [preloadState, setPreloadState] = useState<ImagePreloadState>(
    () => gameImagePreloader.getState(),
  );

  useEffect(() => {
    const unsubscribe = gameImagePreloader.subscribe(setPreloadState);
    gameImagePreloader.enqueue(CRITICAL_IMAGE_URLS, { priority: true });

    const cancelIdlePreload = scheduleWhenIdle(() => {
      if (isMobileLikeDevice()) return;

      import('../utils/gameImageUrls')
        .then(({ getAllGameImageUrls }) => {
          gameImagePreloader.enqueue(getAllGameImageUrls());
        })
        .catch(() => undefined);
    });

    return () => {
      unsubscribe();
      cancelIdlePreload();
    };
  }, []);

  useEffect(() => {
    import('../utils/gameImageUrls')
      .then(({ getCyoaImageUrls, getPhaseImageUrls }) => {
        if (isMobileLikeDevice()) {
          gameImagePreloader.enqueue(getPhaseImageUrls(phase), { priority: true });

          if (phase === 'CYOA_BUILD') {
            gameImagePreloader.enqueue(getCyoaImageUrls());
          }

          return;
        }

        if (phase === 'CYOA_BUILD') {
          gameImagePreloader.enqueue(getCyoaImageUrls(), { priority: true });
        } else {
          gameImagePreloader.enqueue(getPhaseImageUrls(phase), { priority: true });
        }
      })
      .catch(() => undefined);
  }, [phase]);

  return preloadState;
}
