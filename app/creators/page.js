"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const CreatorsPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/creators")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto py-10 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Discover Creators</h1>
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search creators by name or username..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg bg-white border border-gray-400 text-black placeholder-gray-500 w-full max-w-md shadow"
        />
      </div>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : users.length === 0 ? (
        <div className="text-center">No creators found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {users
            .filter(user =>
              user.username.toLowerCase().includes(search.toLowerCase()) ||
              (user.name && user.name.toLowerCase().includes(search.toLowerCase()))
            )
            .map((user) => (
              <Link key={user._id} href={`/${user.username}`} className="bg-gray-800 rounded-lg p-6 flex flex-col items-center hover:bg-gray-700 transition">
                <img
                  src={user.profilepic || "/default-profile.jpg"}
                  alt={user.username}
                  className="w-20 h-20 rounded-full mb-4 border"
                />
                <div className="text-xl font-semibold">@{user.username}</div>
                <div className="text-gray-400">{user.name}</div>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
};

export default CreatorsPage; 