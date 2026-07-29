import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import './AuthForm.scss';

interface AuthFormProps {
  type: 'login' | 'register';
}

const usernameSchema = z
  .string()
  .trim()
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username must be at most 20 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username may only contain letters, numbers, and underscores');

// Login only checks that fields were filled in — the actual credentials are
// verified against stored users. Register enforces the real format rules.
const loginSchema = z.object({
  username: z.string().trim().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z.object({
  username: usernameSchema,
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type AuthFormValues = z.infer<typeof registerSchema>;

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const { login, register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(type === 'login' ? loginSchema : registerSchema),
  });

  const onSubmit = async (values: AuthFormValues) => {
    const success =
      type === 'login'
        ? await login(values.username, values.password)
        : await registerUser(values.username, values.password);

    if (success) {
      navigate('/my-crypto');
    } else {
      setError('root', {
        message:
          type === 'login'
            ? 'Invalid username or password'
            : 'Username already exists. Please choose another.',
      });
    }
  };

  return (
    <div className="auth-form-container">
      <h2>{type === 'login' ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" {...register('username')} />
          {errors.username && <p className="error-message">{errors.username.message}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <div className="password-field">
            <input type={showPassword ? 'text' : 'password'} id="password" {...register('password')} />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          {errors.password && <p className="error-message">{errors.password.message}</p>}
        </div>
        {errors.root && <p className="error-message">{errors.root.message}</p>}
        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {type === 'login' ? 'Login' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
