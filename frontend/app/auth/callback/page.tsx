// frontend/app/auth/callback/page.tsx
// GitHub OAuth ke baad yahan redirect hota hai — token save karta hai

"use client"

import { useEffect } from "react"
import { useRouter} from "next/navigation"

export default function Callback() {
  const router = useRouter()
  

    useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

      if (token) {
        //ek hi key use kr rha hoon
      localStorage.setItem("token", token); // ✅ auto save
      router.push("/"); // home pe redirect
    }
    

   
  },[])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white">
      <div className="text-center">
        <div className="animate-spin text-4xl mb-4">⚙️</div>
        <p>Logging you in...</p>
      </div>
    </div>
  )
}