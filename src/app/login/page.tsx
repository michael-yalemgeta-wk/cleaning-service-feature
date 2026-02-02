"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function Login() {
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
      alert("Invalid credentials. Try admin/admin or owner/owner");
    }
  };

  return (
    <div className="container section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '2rem' }}>
        <h1 className="text-center mb-md flex items-center justify-center gap-sm">
          <Lock /> Portal Login
        </h1>
        <p className="text-center mb-lg" style={{ color: 'var(--text-muted)' }}>
          Admin or Owner access
        </p>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="admin or owner" 
            />
          </div>
          <div className="form-group mb-lg">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Enter password"
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
        </form>
        <div className="text-center" style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--surface-alt)', borderRadius: 'var(--radius-sm)' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Demo Credentials:</p>
          <p style={{ fontSize: '0.875rem' }}><strong>Admin:</strong> admin / admin</p>
          <p style={{ fontSize: '0.875rem' }}><strong>Owner:</strong> owner / owner</p>
        </div>
      </div>
    </div>
  );
}
