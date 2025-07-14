"use client";
import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const ResetPasswordPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(null);

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setSuccess(null);
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password }),
      });
      const data = await res.json();
      setMessage(data.message);
      setSuccess(data.success);
      if (data.success) {
        setTimeout(() => router.push("/login"), 3000);
      }
    } catch (err) {
      setMessage("An error occurred.");
      setSuccess(false);
    }
    setLoading(false);
  };

  if (!token || !email) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white">
        <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
        <div className="bg-red-700 p-4 rounded">Invalid or missing reset link.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">Set New Password</h1>
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded shadow-md w-full max-w-sm">
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
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
      {message && (
        <div className={`mt-4 text-center ${success ? "text-green-300" : "text-yellow-300"}`}>{message}</div>
      )}
      {success && <div className="mt-2 text-green-300">Redirecting to login...</div>}
    </div>
  );
};

export default ResetPasswordPage; 