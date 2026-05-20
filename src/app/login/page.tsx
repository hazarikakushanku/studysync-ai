"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAppStore } from "@/stores/app-store";
import { generateStudentId } from "@/lib/utils";

export default function LoginPage() {
  let router = useRouter();
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState("");
  let { setAnonymousId, anonymousId } = useAppStore();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      let supabase = createClient();
      let { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) { setError(authError.message); setLoading(false); return; }
      if (!anonymousId) setAnonymousId(generateStudentId());
      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      let supabase = createClient();
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin + "/auth/callback" },
      });
    } catch { setError("Google login failed."); }
  }

  function handleDemoLogin() {
    if (!anonymousId) setAnonymousId(generateStudentId());
    router.push("/dashboard");
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5", fontFamily: "Arial, sans-serif" }}>
      <div style={{ background: "white", border: "1px solid #ddd", borderRadius: "8px", padding: "32px", width: "100%", maxWidth: "400px", margin: "20px" }}>
        <h1 style={{ textAlign: "center", fontSize: "22px", marginBottom: "4px" }}>StudySync</h1>
        <p style={{ textAlign: "center", color: "#888", fontSize: "14px", marginBottom: "24px" }}>Sign in to your account</p>

        <button onClick={handleGoogleLogin} style={{
          width: "100%", padding: "10px", background: "white", border: "1px solid #ddd",
          borderRadius: "4px", cursor: "pointer", fontSize: "14px", marginBottom: "16px"
        }}>
          Continue with Google
        </button>

        <div style={{ textAlign: "center", color: "#aaa", fontSize: "12px", margin: "16px 0" }}>-- OR --</div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "12px" }}>
            <label className="form-label">Email</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div style={{ marginBottom: "12px" }}>
            <label className="form-label">Password</label>
            <input type="password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p style={{ color: "red", fontSize: "13px" }}>{error}</p>}
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%", marginTop: "8px", padding: "10px" }}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <button onClick={handleDemoLogin} style={{
          width: "100%", padding: "10px", background: "#f0f0f0", border: "1px solid #ddd",
          borderRadius: "4px", cursor: "pointer", fontSize: "13px", marginTop: "12px", color: "#666"
        }}>
          Try Demo Mode (No Login)
        </button>

        <p style={{ textAlign: "center", fontSize: "13px", color: "#888", marginTop: "16px" }}>
          Don&apos;t have an account? <Link href="/signup" style={{ color: "#1a73e8" }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}
