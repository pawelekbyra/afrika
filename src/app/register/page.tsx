
"use client";

import React, { useState, useContext, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import AuthContext from '@/context/AuthContext';
import './AuthPages.css';
import Link from 'next/link';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const auth = useContext(AuthContext);
  const router = useRouter();

  if (!auth) {
    return <div>Loading...</div>;
  }

  const { register } = auth;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      await register(formData.email, formData.password);
      router.push('/account');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError((err as any).response?.data?.msg || 'Rejestracja nie powiodła się');
      }
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Rejestracja</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Hasło</label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>
        <button type="submit">Zarejestruj</button>
        <p className="switch-auth">
            Masz już konto? <Link href="/login">Zaloguj się</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
