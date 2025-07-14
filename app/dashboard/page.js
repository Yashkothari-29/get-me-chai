"use client";

import Dashboard from '@/components/Dashboard';
import React, { useState } from 'react';

const DashboardPage = () => {
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    return (
        <>
            <Dashboard />
            <div className="max-w-2xl mx-auto mt-8 bg-gray-800 p-6 rounded shadow-md text-white">
                <button
                    className="mb-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    onClick={() => setShowPasswordForm((v) => !v)}
                >
                    {showPasswordForm ? 'Hide' : 'Set/Change Password'}
                </button>
                {showPasswordForm && <SetPasswordForm />}
            </div>
        </>
    );
};

function SetPasswordForm() {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        const res = await fetch('/api/set-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        });
        const data = await res.json();
        setMessage(data.message);
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4">
            <input
                type="password"
                name="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full mb-3 p-2 rounded text-black"
                required
            />
            <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                disabled={loading}
            >
                {loading ? 'Setting...' : 'Set/Change Password'}
            </button>
            {message && <div className="mt-4 text-center text-yellow-300">{message}</div>}
        </form>
    );
}

export default DashboardPage;

















