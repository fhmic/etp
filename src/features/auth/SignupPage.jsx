import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { AuthLayout } from './AuthLayout.jsx';

export function SignupPage() {
  const { register, handleSubmit } = useForm({ defaultValues: { organisationType: 'financial_services' } });
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  async function onSubmit(values) {
    try {
      await signup(values);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create account.');
    }
  }

  return (
    <AuthLayout title="Create organisation" subtitle="Choose the industry mode that controls portfolio terminology across the system.">
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        {error && <div className="alert danger">{error}</div>}
        <div className="segmented">
          <label><input type="radio" value="financial_services" {...register('organisationType')} />Financial services</label>
          <label><input type="radio" value="non_financial_services" {...register('organisationType')} />Non-financial services</label>
        </div>
        <label>Organisation Name<input {...register('organisationName', { required: true })} /></label>
        <label>Industry<input {...register('industry')} /></label>
        <label>Company Size<input {...register('companySize')} /></label>
        <label>Full Name<input {...register('name', { required: true })} /></label>
        <label>Email<input {...register('email', { required: true })} type="email" /></label>
        <label>Password<input {...register('password', { required: true })} type="password" /></label>
        <button className="primary">Create account</button>
      </form>
    </AuthLayout>
  );
}
