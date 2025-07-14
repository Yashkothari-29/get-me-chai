"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const SignupPage = () => {
  const [form, setForm] = useState({ email: '', password: '', username: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Registration successful! Please check your email to verify your account.');
        setTimeout(() => router.push('/login'), 3000);
      } else {
        setMessage(data.message || 'Registration failed.');
      }
    } catch (err) {
      setMessage('An error occurred.');
    }
    setLoading(false);
  };

  return (
    <div className="text-white flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded shadow-md w-full max-w-sm">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="block w-full mb-3 p-2 rounded text-black"
          required
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="block w-full mb-3 p-2 rounded text-black"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="block w-full mb-3 p-2 rounded text-black"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      {message && <div className="mt-4 text-center text-yellow-300">{message}</div>}
    </div>
  );
};

export default SignupPage;
