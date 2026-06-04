export interface ImagePreloadState {
  loaded: number;
  total: number;
  failed: number;
  isRunning: boolean;
  isComplete: boolean;
}

type ImageStatus = 'pending' | 'loading' | 'loaded' | 'failed';

interface EnqueueOptions {
  priority?: boolean;
}

const getDefaultConcurrency = (): number => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 4;
  }

  return window.matchMedia('(max-width: 768px), (pointer: coarse)').matches ? 2 : 4;
};

const DEFAULT_CONCURRENCY = getDefaultConcurrency();

const createInitialState = (): ImagePreloadState => ({
  loaded: 0,
  total: 0,
  failed: 0,
  isRunning: false,
  isComplete: true,
});

export const normalizeImageUrl = (url: string): string => {
  const trimmed = url.trim();
  if (!trimmed) return '';

  if (
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/')
  ) {
    return trimmed;
  }

  if (trimmed.startsWith('./')) {
    return trimmed;
  }

  return `./${trimmed}`;
};

const preloadSingleImage = async (url: string): Promise<void> => {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();

    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to preload image: ${url}`));
    img.decoding = 'async';
    img.src = url;

    if (img.complete) {
      resolve(img);
    }
  });

  if (typeof img.decode === 'function') {
    await img.decode().catch(() => undefined);
  }
};

export class ImagePreloader {
  private active = 0;
  private queue: string[] = [];
  private readonly concurrency: number;
  private readonly statuses = new Map<string, ImageStatus>();
  private readonly listeners = new Set<(state: ImagePreloadState) => void>();
  private state = createInitialState();

  constructor(concurrency = DEFAULT_CONCURRENCY) {
    this.concurrency = concurrency;
  }

  subscribe(listener: (state: ImagePreloadState) => void): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  getState(): ImagePreloadState {
    return this.state;
  }

  enqueue(urls: string[], options: EnqueueOptions = {}): void {
    const normalizedUrls = Array.from(new Set(urls.map(normalizeImageUrl).filter(Boolean)));
    const nextUrls: string[] = [];

    normalizedUrls.forEach(url => {
      const currentStatus = this.statuses.get(url);

      if (currentStatus === 'loaded' || currentStatus === 'failed' || currentStatus === 'loading') {
        return;
      }

      if (currentStatus === 'pending') {
        this.queue = this.queue.filter(queuedUrl => queuedUrl !== url);
      } else {
        this.statuses.set(url, 'pending');
        this.state = {
          ...this.state,
          total: this.state.total + 1,
          isRunning: true,
          isComplete: false,
        };
      }

      nextUrls.push(url);
    });

    if (nextUrls.length === 0) {
      this.emit();
      return;
    }

    this.queue = options.priority ? [...nextUrls, ...this.queue] : [...this.queue, ...nextUrls];
    this.state = {
      ...this.state,
      isRunning: true,
      isComplete: false,
    };
    this.emit();
    this.pump();
  }

  private pump(): void {
    while (this.active < this.concurrency && this.queue.length > 0) {
      const url = this.queue.shift();
      if (!url || this.statuses.get(url) !== 'pending') {
        continue;
      }

      this.active += 1;
      this.statuses.set(url, 'loading');
      this.emit();

      preloadSingleImage(url)
        .then(() => {
          this.statuses.set(url, 'loaded');
          this.state = {
            ...this.state,
            loaded: this.state.loaded + 1,
          };
        })
        .catch(() => {
          this.statuses.set(url, 'failed');
          this.state = {
            ...this.state,
            failed: this.state.failed + 1,
          };
        })
        .finally(() => {
          this.active -= 1;
          this.refreshRunningState();
          this.emit();
          this.pump();
        });
    }

    this.refreshRunningState();
    this.emit();
  }

  private refreshRunningState(): void {
    const isRunning = this.active > 0 || this.queue.length > 0;
    this.state = {
      ...this.state,
      isRunning,
      isComplete: !isRunning && this.state.total > 0 && this.state.loaded + this.state.failed >= this.state.total,
    };
  }

  private emit(): void {
    this.listeners.forEach(listener => listener(this.state));
  }
}

export const gameImagePreloader = new ImagePreloader(DEFAULT_CONCURRENCY);
