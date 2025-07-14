"use client"
import React, { useEffect, useState } from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from 'next/navigation'

const LoginPage = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if(session) {
            router.push('/dashboard')
        }
    }, [session, router]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const res = await signIn('credentials', {
            redirect: false,
            email: form.email,
            password: form.password,
        });
        if (res?.error) {
            setError(res.error);
        } else if (res?.ok) {
            router.push('/dashboard');
        }
        setLoading(false);
    };

    return (
        <div className='text-white py-14 container mx-auto '>
            <h1 className='text-center font-bold text-3xl'>Login To Get Your Fans Support You!!!</h1>
            <div className="flex flex-col items-center justify-center min-h-screen">
                <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded shadow-md w-full max-w-sm mb-6">
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
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    {error && <div className="mt-4 text-center text-red-400">{error}</div>}
                </form>
                <div className="social-login-btn w-full max-w-sm flex flex-col gap-2 items-center">
                    <button
                        className="flex items-center w-72 bg-white border border-gray-300 rounded-lg shadow-md max-w-xs px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        onClick={() => signIn('google')}
                        type="button"
                    >
                        <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                            viewBox="-0.5 0 48 48" version="1.1">
                            {/* ...svg paths... */}
                        </svg>
                        <span>Continue with Google</span>
                    </button>
                    {/* ...other social login buttons... */}
                </div>
                <div className="flex flex-col items-center mt-4">
                    <a href="/reset-password-request" className="text-blue-400 hover:underline">Forgot password?</a>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
