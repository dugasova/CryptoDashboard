import { registerUser, saveSession } from '../services/authStorage';

// AuthProvider seeds isAuth/username from getSession() the moment it mounts,
// so the user must exist and the session must be saved *before* rendering.
export async function loginAs(username: string, password = 'password123'): Promise<void> {
  await registerUser(username, password);
  saveSession(username);
}
