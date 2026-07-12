import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '../../lib/api.js';
import { AuthLayout } from './AuthLayout.jsx';

export function ForgotPasswordPage() {
  const { register, handleSubmit } = useForm();
  const [message, setMessage] = useState('');

  async function onSubmit(values) {
    const { data } = await api.post('/auth/forgot-password', values);
    setMessage(data.message);
  }

  return (
    <AuthLayout title="Reset password" subtitle="Request a password reset link for your ETPA account.">
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        {message && <div className="alert">{message}</div>}
        <label>Email<input {...register('email', { required: true })} type="email" /></label>
        <button className="primary">Send reset link</button>
      </form>
    </AuthLayout>
  );
}
