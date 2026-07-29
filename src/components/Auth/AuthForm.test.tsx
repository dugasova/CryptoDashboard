import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import AuthForm from './AuthForm';

function renderAuthForm(type: 'login' | 'register') {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AuthForm type={type} />} />
          <Route path="/my-crypto" element={<div>My Crypto Page</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('AuthForm — register', () => {
  it('shows validation errors for invalid input instead of submitting', async () => {
    const user = userEvent.setup();
    renderAuthForm('register');

    await user.type(screen.getByLabelText(/username/i), 'ab');
    await user.type(screen.getByLabelText('Password:'), '123');
    await user.click(screen.getByRole('button', { name: /^register$/i }));

    expect(await screen.findByText(/username must be at least 3 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
    expect(screen.queryByText('My Crypto Page')).not.toBeInTheDocument();
  });

  it('registers a new user and navigates to /my-crypto', async () => {
    const user = userEvent.setup();
    renderAuthForm('register');

    await user.type(screen.getByLabelText(/username/i), 'alice123');
    await user.type(screen.getByLabelText('Password:'), 'password123');
    await user.click(screen.getByRole('button', { name: /^register$/i }));

    expect(await screen.findByText('My Crypto Page')).toBeInTheDocument();
  });

  it('rejects registering a username that is already taken', async () => {
    const user = userEvent.setup();
    const { unmount } = renderAuthForm('register');

    await user.type(screen.getByLabelText(/username/i), 'alice123');
    await user.type(screen.getByLabelText('Password:'), 'password123');
    await user.click(screen.getByRole('button', { name: /^register$/i }));
    await screen.findByText('My Crypto Page');
    unmount();

    renderAuthForm('register');
    await user.type(screen.getByLabelText(/username/i), 'alice123');
    await user.type(screen.getByLabelText('Password:'), 'a-different-password');
    await user.click(screen.getByRole('button', { name: /^register$/i }));

    expect(await screen.findByText(/username already exists/i)).toBeInTheDocument();
  });
});

describe('AuthForm — login', () => {
  async function seedUser(user: ReturnType<typeof userEvent.setup>) {
    const { unmount } = renderAuthForm('register');
    await user.type(screen.getByLabelText(/username/i), 'bob123');
    await user.type(screen.getByLabelText('Password:'), 'password123');
    await user.click(screen.getByRole('button', { name: /^register$/i }));
    await screen.findByText('My Crypto Page');
    unmount();
  }

  it('shows an error for the wrong password and succeeds with the right one', async () => {
    const user = userEvent.setup();
    await seedUser(user);

    renderAuthForm('login');
    await user.type(screen.getByLabelText(/username/i), 'bob123');
    await user.type(screen.getByLabelText('Password:'), 'wrong-password');
    await user.click(screen.getByRole('button', { name: /^login$/i }));
    expect(await screen.findByText(/invalid username or password/i)).toBeInTheDocument();

    await user.clear(screen.getByLabelText('Password:'));
    await user.type(screen.getByLabelText('Password:'), 'password123');
    await user.click(screen.getByRole('button', { name: /^login$/i }));
    expect(await screen.findByText('My Crypto Page')).toBeInTheDocument();
  });
});

describe('AuthForm — password visibility', () => {
  it('toggles the password field between hidden and visible', async () => {
    const user = userEvent.setup();
    renderAuthForm('login');

    const passwordInput = screen.getByLabelText('Password:');
    expect(passwordInput).toHaveAttribute('type', 'password');

    await user.click(screen.getByRole('button', { name: /show password/i }));
    expect(passwordInput).toHaveAttribute('type', 'text');

    await user.click(screen.getByRole('button', { name: /hide password/i }));
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
