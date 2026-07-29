import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// jsdom doesn't implement ResizeObserver, but recharts' <ResponsiveContainer>
// (used by CoinRow/PriceHistoryChart) needs one to mount at all.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver ??= ResizeObserverStub;

// jsdom doesn't implement matchMedia either, and MobileMenu queries it on mount.
window.matchMedia ??= (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
});

// authStorage and the zustand persist middleware both read/write localStorage,
// so every test needs to start from a clean slate to stay isolated.
afterEach(() => {
  localStorage.clear();
  // authStorage is a module-level singleton across a test file and caches
  // users in memory; clearing localStorage alone doesn't reset that cache,
  // so invalidate it the same way a real "another tab changed this" would.
  window.dispatchEvent(new StorageEvent('storage', { key: 'auth-users' }));
});

afterEach(cleanup);
