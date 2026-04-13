// frontend/app/dashboard/page.tsx
// Main dashboard — connected projects + repos dikhata hai

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

const API = "http://localhost:5000"

export default function Dashboard() {
  const router = useRouter()
  const [repos, setRepos] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState<string | null>(null) // Kaunsa repo connect ho raha hai

  // Token helper
  const getToken = () => localStorage.getItem("flowci_token")

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push("/login")
      return
    }
    fetchData()
  }, [])

  async function fetchData() {
    const token = getToken()

    try {
      // GitHub repos + connected projects dono fetch karo
      const [reposRes, projectsRes] = await Promise.all([
        fetch(`${API}/projects/repos`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API}/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      const reposData = await reposRes.json()
      const projectsData = await projectsRes.json()

      setRepos(reposData.repos || [])
      setProjects(projectsData.projects || [])
    } catch (err) {
      console.error("Fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  // Repo ko FlowCI se connect karo
  async function connectRepo(repoFullName: string) {
    setConnecting(repoFullName)
    const token = getToken()

    try {
      const res = await fetch(`${API}/projects/connect`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repoFullName }),
      })

      const data = await res.json()

      if (res.ok) {
        alert(`✅ ${data.message}`)
        fetchData() // Refresh karo
      } else {
        alert(`❌ ${data.error}`)
      }
    } catch (err) {
      alert("Connection failed")
    } finally {
      setConnecting(null)
    }
  }

  // Kaunsa repo already connected hai check karo
  const isConnected = (repoFullName: string) =>
    projects.some((p) => p.repoFullName === repoFullName)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white">
        <p>Loading... ⏳</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">FlowCI Dashboard 🚀</h1>
          <button
            onClick={() => {
              localStorage.removeItem("flowci_token")
              router.push("/login")
            }}
            className="text-gray-400 hover:text-white text-sm"
          >
            Logout
          </button>
        </div>

        {/* Connected Projects */}
        {projects.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-green-400">
              ✅ Connected Projects ({projects.length})
            </h2>
            <div className="grid gap-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-gray-800 rounded-lg p-4 flex justify-between items-center cursor-pointer hover:bg-gray-700"
                  onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                >
                  <div>
                    <p className="font-semibold">{project.name}</p>
                    <p className="text-sm text-gray-400">{project.repoFullName}</p>
                  </div>
                  <span className="text-green-400 text-sm">View Builds →</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GitHub Repos */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            📦 Your GitHub Repos ({repos.length})
          </h2>
          <div className="grid gap-3">
            {repos.map((repo) => (
              <div key={repo.id} className="bg-gray-800 rounded-lg p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{repo.name}</p>
                  <p className="text-sm text-gray-400">
                    {repo.fullName} • {repo.language || "Unknown"} • {repo.isPrivate ? "🔒 Private" : "🌍 Public"}
                  </p>
                </div>

                {isConnected(repo.fullName) ? (
                  <span className="text-green-400 text-sm font-medium">Connected ✅</span>
                ) : (
                  <button
                    onClick={() => connectRepo(repo.fullName)}
                    disabled={connecting === repo.fullName}
                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 py-2 rounded text-sm"
                  >
                    {connecting === repo.fullName ? "Connecting..." : "Connect"}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}