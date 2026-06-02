import { FormEvent, useState } from 'react';
import { AdminLoginRequest } from '../../types/auth.types';

interface AdminLoginPanelProps {
  errorMessage: string | null;
  isSubmitting: boolean;
  onLogin: (loginInput: AdminLoginRequest) => Promise<void>;
}

export const AdminLoginPanel = ({
  errorMessage,
  isSubmitting,
  onLogin,
}: AdminLoginPanelProps): JSX.Element => {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    await onLogin({
      email,
      password,
    });
  };

  return (
    <section className="page-card admin-panel">
      <p className="eyebrow">Admin Access</p>
      <h2>Sign in to manage coupon inventory</h2>
      <p className="admin-copy">
        Use the admin credentials from the backend environment to unlock the
        create and list tools.
      </p>
      <form className="admin-form-grid" onSubmit={handleSubmit}>
        <label className="field-group">
          <span>Email</span>
          <input
            autoComplete="email"
            className="field-input"
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            value={email}
          />
        </label>
        <label className="field-group">
          <span>Password</span>
          <input
            autoComplete="current-password"
            className="field-input"
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            value={password}
          />
        </label>
        <div className="form-actions">
          <button className="primary-button" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </div>
      </form>
      {errorMessage ? <p className="feedback-error">{errorMessage}</p> : null}
    </section>
  );
};
