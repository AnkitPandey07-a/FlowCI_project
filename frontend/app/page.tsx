"use client";

import { useEffect, useState } from "react";

export default function Home() {
  // 👇 yaha hum repos store karenge
  const [repos, setRepos] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const [connected, setConnected] = useState<any[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  useEffect(() => {
    fetch("http://localhost:5000/projects/connected")
      .then((res) => res.json())
      .then((data) => {
        setConnected(data);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/projects/logs")
      .then((res) => res.json())
      .then((data) => {
        setLogs(data);
      });
  }, []);
        useEffect(() => {
  const interval = setInterval(() => {
    fetch("http://localhost:5000/projects/logs")
      .then((res) => res.json())
      .then((data) => setLogs(data));
  }, 2000); // har 2 sec me refresh

  return () => clearInterval(interval);
}, []);


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
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching repos:", err);
      });

  }, []); // 👈 empty dependency → sirf ek baar run hoga

  return (
    
    <div className="p-10">
      {/* 👇 heading */}
      <h1 className="text-2xl font-bold mb-5">Your Repositories</h1>

  

      {/* 👇 har repo ko map karke UI me dikha rahe hain */}
    {!Array.isArray(repos) && <p>Error loading repos ❌</p>}

    {loading && <p>Loading repos... ⏳</p>}

{/* data humesha array hoga  */}
{Array.isArray(repos) && repos.length === 0 && (
  <p>No repos found</p>
  
)}

{Array.isArray(repos) &&
  repos.map((repo) => (
    <div key={repo.id} className="border p-3 mb-3 rounded">
      
      {/* 👇 repo name */}
      <h2 className="font-semibold">{repo.name}</h2>

      {/* 👇 full name */}
      <p className="text-sm text-gray-600">{repo.full_name}</p>

      {/* 👇 CONNECT BUTTON */}
    <button
  className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
  disabled={connected.some((p) => p.full_name === repo.full_name)}
  onClick={() => {
    fetch("http://localhost:5000/projects/connect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: repo.name,
        full_name: repo.full_name,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Repo connected......");

        setConnected((prev) => {
          if (prev.some((p) => p.full_name === repo.full_name)) {
            return prev;
          }
          return [...prev, {name: repo.name, full_name: repo.full_name },
          ];
        }); 
      });
  }}
>
  {connected.some((p) => p.full_name === repo.full_name)
    ? "Connected ✅"
    : "Connect Repo"}
</button>

    </div>
))}
          {/* 🔥 LOGS UI (IMPORTANT) */}     
          
          
{/* 🔥 LOGS UI (IMPORTANT) */}
      <div className="mt-10 bg-black text-green-400 p-4 rounded h-64 overflow-y-scroll">
        <h2 className="mb-2 font-bold">Build Logs</h2>

        {logs.length === 0 && <p>No logs yet...</p>}

        {logs.map((log, i) => (
          <p key={i}>{log}</p>
        ))}
      </div>
    </div>
  );
}