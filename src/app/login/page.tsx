'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <main className="marble-bg" style={{ minHeight: '100vh' }}>
      <Navbar />
      <div className="container flex-center" style={{ paddingTop: '10rem', paddingBottom: '5rem' }}>
        <div className="glass animate-reveal" style={{ 
          width: '100%', 
          maxWidth: '450px', 
          padding: '3.5rem',
          borderTop: '4px solid var(--accent-gold)'
        }}>
          <div className="text-center" style={{ marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome Back</h1>
            <p style={{ opacity: 0.6, fontSize: '0.9rem', letterSpacing: '1px' }}>ENTER YOUR CREDENTIALS</p>
          </div>

          {error && (
            <div style={{ 
              padding: '1rem', 
              backgroundColor: 'rgba(255,0,0,0.05)', 
              color: '#d32f2f', 
              borderRadius: '4px', 
              marginBottom: '1.5rem',
              fontSize: '0.85rem',
              borderLeft: '3px solid #d32f2f'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px' }}>EMAIL ADDRESS</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '1rem', borderRadius: '2px', border: '1px solid var(--gray-light)', outline: 'none' }}
                placeholder="your@email.com"
              />
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px' }}>PASSWORD</label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '1rem', borderRadius: '2px', border: '1px solid var(--gray-light)', outline: 'none' }}
                placeholder="••••••••"
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', marginBottom: '1.5rem' }}
              disabled={loading}
            >
              {loading ? 'AUTHENTICATING...' : 'SIGN IN'}
            </button>
          </form>

          <div className="text-center" style={{ fontSize: '0.9rem' }}>
            <p style={{ opacity: 0.7 }}>Don't have an account?</p>
            <Link href="/signup" style={{ color: 'var(--accent-gold)', fontWeight: 600, marginTop: '0.5rem', display: 'inline-block' }}>CREATE A STUDENT PROFILE</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
