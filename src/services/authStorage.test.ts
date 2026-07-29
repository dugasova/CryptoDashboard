import { describe, it, expect, beforeEach, vi } from 'vitest';

// authStorage caches users in a module-level variable, so each test needs a
// fresh module instance to avoid state leaking in from a previous test.
let authStorage: typeof import('./authStorage');

beforeEach(async () => {
  localStorage.clear();
  vi.resetModules();
  authStorage = await import('./authStorage');
});

describe('registerUser', () => {
  it('registers a new user', async () => {
    await expect(authStorage.registerUser('alice', 'password123')).resolves.toBe(true);
    expect(authStorage.userExists('alice')).toBe(true);
  });

  it('rejects a duplicate username', async () => {
    await authStorage.registerUser('alice', 'password123');
    await expect(authStorage.registerUser('alice', 'different-password')).resolves.toBe(false);
  });

  it('never stores the password in plaintext', async () => {
    await authStorage.registerUser('alice', 'password123');
    const raw = localStorage.getItem('auth-users');
    expect(raw).not.toContain('password123');
  });

  it('salts each user independently, even with the same password', async () => {
    await authStorage.registerUser('alice', 'shared-password');
    await authStorage.registerUser('bob', 'shared-password');
    const users = JSON.parse(localStorage.getItem('auth-users')!);
    const [alice, bob] = users;
    expect(alice.salt).not.toBe(bob.salt);
    expect(alice.passwordHash).not.toBe(bob.passwordHash);
  });
});

describe('verifyUser', () => {
  beforeEach(async () => {
    await authStorage.registerUser('alice', 'password123');
  });

  it('accepts the correct password', async () => {
    await expect(authStorage.verifyUser('alice', 'password123')).resolves.toBe(true);
  });

  it('rejects the wrong password', async () => {
    await expect(authStorage.verifyUser('alice', 'wrong-password')).resolves.toBe(false);
  });

  it('rejects an unknown username', async () => {
    await expect(authStorage.verifyUser('nobody', 'password123')).resolves.toBe(false);
  });
});

describe('getUsernames / deleteUser', () => {
  it('lists all registered usernames', async () => {
    await authStorage.registerUser('alice', 'password123');
    await authStorage.registerUser('bob', 'password456');
    expect(authStorage.getUsernames().sort()).toEqual(['alice', 'bob']);
  });

  it('removes a user so they can no longer verify or be found', async () => {
    await authStorage.registerUser('alice', 'password123');
    authStorage.deleteUser('alice');

    expect(authStorage.userExists('alice')).toBe(false);
    await expect(authStorage.verifyUser('alice', 'password123')).resolves.toBe(false);
  });
});

describe('session helpers', () => {
  it('round-trips a session through save/get/clear', () => {
    expect(authStorage.getSession()).toBeNull();

    authStorage.saveSession('alice');
    expect(authStorage.getSession()).toBe('alice');

    authStorage.clearSession();
    expect(authStorage.getSession()).toBeNull();
  });
});

describe('in-memory cache invalidation', () => {
  it('picks up users written by another tab after a "storage" event', async () => {
    // Prime the cache with an empty read.
    expect(authStorage.userExists('alice')).toBe(false);

    // Simulate another tab registering "alice" directly in localStorage,
    // bypassing this module's saveUsers (and thus its cache).
    localStorage.setItem(
      'auth-users',
      JSON.stringify([{ username: 'alice', salt: 'salt', passwordHash: 'hash' }])
    );
    window.dispatchEvent(new StorageEvent('storage', { key: 'auth-users' }));

    expect(authStorage.userExists('alice')).toBe(true);
  });

  it('ignores storage events for unrelated keys', () => {
    expect(authStorage.userExists('alice')).toBe(false);

    localStorage.setItem(
      'auth-users',
      JSON.stringify([{ username: 'alice', salt: 'salt', passwordHash: 'hash' }])
    );
    window.dispatchEvent(new StorageEvent('storage', { key: 'some-other-key' }));

    // Cache was already primed as empty and shouldn't have been invalidated.
    expect(authStorage.userExists('alice')).toBe(false);
  });
});
