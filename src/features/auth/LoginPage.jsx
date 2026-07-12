import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { AuthLayout } from './AuthLayout.jsx';

export function LoginPage() {
  const { register, handleSubmit } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  async function onSubmit(values) {
    try {
      await login(values);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to log in.');
    }
  }

  return (
    <AuthLayout title="Sign in to ETPA" subtitle="Fin. Assets, Fin. Liabilities, Equity and Liquidity Monitor.">
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        {error && <div className="alert danger">{error}</div>}
        <label>Email<input {...register('email', { required: true })} type="email" /></label>
        <label>Password<input {...register('password', { required: true })} type="password" /></label>
        <button className="primary">Login</button>
      </form>
    </AuthLayout>
  );
}
