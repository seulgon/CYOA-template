const MOBILE_OPTIMIZATION_STORAGE_KEY = 'authenticFantasy.mobileOptimizationEnabled';
const MOBILE_OPTIMIZATION_EVENT = 'authenticFantasy:mobileOptimizationChanged';

export const MOBILE_OPTIMIZATION_QUERY = '(max-width: 768px), (pointer: coarse)';

export const isMobileLikeDevice = (): boolean => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }

  return window.matchMedia(MOBILE_OPTIMIZATION_QUERY).matches;
};

export const getMobileOptimizationEnabled = (): boolean => {
  if (typeof window === 'undefined') {
    return true;
  }

  return window.localStorage.getItem(MOBILE_OPTIMIZATION_STORAGE_KEY) !== 'false';
};

export const setMobileOptimizationEnabled = (enabled: boolean): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(MOBILE_OPTIMIZATION_STORAGE_KEY, String(enabled));
  window.dispatchEvent(
    new CustomEvent(MOBILE_OPTIMIZATION_EVENT, {
      detail: { enabled },
    }),
  );
};

export const shouldUseMobileOptimization = (): boolean => (
  getMobileOptimizationEnabled() && isMobileLikeDevice()
);

export const subscribeToMobileOptimization = (callback: () => void): (() => void) => {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === MOBILE_OPTIMIZATION_STORAGE_KEY) {
      callback();
    }
  };

  window.addEventListener(MOBILE_OPTIMIZATION_EVENT, callback);
  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener(MOBILE_OPTIMIZATION_EVENT, callback);
    window.removeEventListener('storage', handleStorage);
  };
};
