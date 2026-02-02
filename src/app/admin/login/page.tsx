"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === "admin" && password === "admin") {
      localStorage.setItem("isAdmin", "true");
      router.push("/admin/dashboard");
    } else if (username === "owner" && password === "owner") {
      localStorage.setItem("isOwner", "true");
      router.push("/owner/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="container section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '2rem' }}>
        <h1 className="text-center mb-md flex items-center justify-center gap-sm">
          <Lock /> Portal Login
        </h1>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin or owner" />
          </div>
          <div className="form-group mb-lg">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
        </form>
      </div>
    </div>
  );
}
