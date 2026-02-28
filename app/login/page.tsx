"use client";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import { DM_Sans } from "next/font/google";
import styles from "./login.module.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-dm-sans",
});

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setMessage("Check your email to verify your account!");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else router.push("/app");
    }

    setLoading(false);
  };

  return (
    <div className={`${styles.page} ${dmSans.variable}`}>
      <div className={styles.card}>

        {/* Logo */}
        <img src="/logo-transparent.png" alt="We Are Doers" className={styles.logo} />
        <p className={styles.tagline}>We are Doers, not Watchers</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className={styles.input}
          />

          {error && <p className={styles.error}>{error}</p>}
          {message && <p className={styles.success}>{message}</p>}

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
          </button>
        </form>

        {/* Toggle */}
        <p className={styles.toggle}>
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(""); setMessage(""); }}
            className={styles.toggleBtn}
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>

        <button onClick={() => router.push("/")} className={styles.back}>
          ← Back
        </button>
      </div>
    </div>
  );
}
