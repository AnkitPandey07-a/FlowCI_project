"use client";

import { useEffect, useState } from "react";

export default function Home() {
  // 👇 yaha hum repos store karenge
  const [repos, setRepos] = useState<any[]>([]);

  useEffect(() => {
    // 👇 localStorage se token le rahe hain (jo OAuth se mila tha)
    const token = localStorage.getItem("token");

    // 👇 agar token nahi hai to API call mat karo
    if (!token) return;

    // 👇 backend API hit kar rahe hain repos ke liye
    fetch("http://localhost:5000/projects/repos", {
      headers: {
        // 👇 Authorization header me token bhejna zaruri hai
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json()) // 👈 response ko JSON me convert kiya
      .then((data) => {
        // 👇 jo repos aaye unhe state me daal diya
        setRepos(data);
      })
      .catch((err) => {
        console.error("Error fetching repos:", err);
      });

  }, []); // 👈 empty dependency → sirf ek baar run hoga

  return (
    <div className="p-10">
      {/* 👇 heading */}
      <h1 className="text-2xl font-bold mb-5">Your Repositories</h1>

      {/* 👇 agar repos empty hain to message dikhao */}
      {repos.length === 0 && <p>No repos found or token missing</p>}

      {/* 👇 har repo ko map karke UI me dikha rahe hain */}
      {repos.map((repo) => (
        <div key={repo.id} className="border p-3 mb-2 rounded">
          {/* 👇 repo ka naam */}
          <h2 className="font-semibold">{repo.name}</h2>

          {/* 👇 full repo path (username/repo) */}
          <p className="text-sm text-gray-600">{repo.full_name}</p>
        </div>
      ))}
    </div>
  );
}