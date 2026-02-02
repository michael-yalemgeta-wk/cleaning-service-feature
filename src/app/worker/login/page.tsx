"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase } from "lucide-react";

export default function WorkerLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("/api/workers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", username, password }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem("isWorker", "true");
        localStorage.setItem("workerId", data.worker.id);
        localStorage.setItem("workerName", data.worker.name);
        localStorage.setItem("workerStaffId", data.worker.staffId);
        router.push("/worker/dashboard");
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '2rem' }}>
        <h1 className="text-center mb-md flex items-center justify-center gap-sm">
          <Briefcase /> Worker Login
        </h1>
        <p className="text-center mb-lg" style={{ color: 'var(--text-muted)' }}>
          Access your assigned tasks
        </p>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="worker1"
              required
            />
          </div>
          <div className="form-group mb-lg">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="text-center" style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--surface-alt)', borderRadius: 'var(--radius-sm)' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Demo: worker1 / worker1</p>
        </div>
      </div>
    </div>
  );
}
