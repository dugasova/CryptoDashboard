import { afterEach } from 'vitest';

// authStorage and the zustand persist middleware both read/write localStorage,
// so every test needs to start from a clean slate to stay isolated.
afterEach(() => {
  localStorage.clear();
});
