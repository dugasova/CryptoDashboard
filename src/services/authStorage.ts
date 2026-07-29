interface StoredUser {
  username: string;
  salt: string;
  passwordHash: string;
}

const USERS_KEY = 'auth-users';
const SESSION_KEY = 'auth-session';

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

async function hashPassword(password: string, salt: string): Promise<string> {
  const encoded = new TextEncoder().encode(salt + password);
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  return toHex(digest);
}

// In-memory cache avoids re-parsing localStorage on every auth check;
// invalidated whenever another tab changes the users list.
let usersCache: StoredUser[] | null = null;

function getUsers(): StoredUser[] {
  let users = usersCache;
  if (users === null) {
    const raw = localStorage.getItem(USERS_KEY);
    users = raw ? JSON.parse(raw) : [];
    usersCache = users;
  }
  return users;
}

function saveUsers(users: StoredUser[]): void {
  usersCache = users;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === USERS_KEY) {
      usersCache = null;
    }
  });
}

export async function registerUser(username: string, password: string): Promise<boolean> {
  const users = getUsers();
  if (users.some((user) => user.username === username)) {
    return false;
  }
  const salt = toHex(crypto.getRandomValues(new Uint8Array(16)).buffer);
  const passwordHash = await hashPassword(password, salt);
  saveUsers([...users, { username, salt, passwordHash }]);
  return true;
}

export async function verifyUser(username: string, password: string): Promise<boolean> {
  const user = getUsers().find((candidate) => candidate.username === username);
  if (!user) return false;
  const passwordHash = await hashPassword(password, user.salt);
  return passwordHash === user.passwordHash;
}

export function userExists(username: string): boolean {
  return getUsers().some((user) => user.username === username);
}

export function getUsernames(): string[] {
  return getUsers().map((user) => user.username);
}

export function deleteUser(username: string): void {
  saveUsers(getUsers().filter((user) => user.username !== username));
}

export function saveSession(username: string): void {
  localStorage.setItem(SESSION_KEY, username);
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function getSession(): string | null {
  return localStorage.getItem(SESSION_KEY);
}
