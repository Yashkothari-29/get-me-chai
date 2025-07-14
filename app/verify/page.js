"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const VerifyPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState("Verifying your email...");
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    if (!token || !email) {
      setMessage("Invalid verification link.");
      setSuccess(false);
      return;
    }
    fetch(`/api/verify?token=${token}&email=${encodeURIComponent(email)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMessage("Your email has been verified! You can now log in.");
          setSuccess(true);
          setTimeout(() => router.push("/login"), 3000);
        } else {
          setMessage(data.message || "Verification failed.");
          setSuccess(false);
        }
      })
      .catch(() => {
        setMessage("An error occurred during verification.");
        setSuccess(false);
      });
  }, [searchParams, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
      <div className={`p-4 rounded ${success === true ? "bg-green-700" : success === false ? "bg-red-700" : "bg-gray-700"}`}>{message}</div>
      {success === true && <div className="mt-2 text-green-300">Redirecting to login...</div>}
    </div>
  );
};

export default VerifyPage; 