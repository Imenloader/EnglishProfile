'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (res.ok) {
        // Redirect to admin dashboard
        router.push('/admin');
        router.refresh(); // Force refresh to apply middleware state
      } else {
        const data = await res.json();
        setError(data.error || 'Invalid password');
      }
    } catch (err) {
      setError('An error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main data-theme="dark" className="marble-pattern" style={{ minHeight: '100vh', background: 'var(--primary-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form className="glass-dark" style={{ padding: '4rem', width: '100%', maxWidth: '450px', borderRadius: '32px', textAlign: 'center', background: 'rgba(1, 22, 39, 0.95)', border: '1px solid rgba(255,255,255,0.08)' }} onSubmit={handleLogin}>
        <div style={{ width: '60px', height: '60px', background: 'var(--accent-gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
          <i className="fa-solid fa-lock" style={{ color: 'var(--primary-navy)', fontSize: '1.5rem' }}></i>
        </div>
        <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '2rem', fontFamily: 'var(--font-serif)' }}>Admin Access</h2>
        
        {error && (
          <div style={{ color: '#ff4d4f', marginBottom: '1.5rem', fontSize: '0.9rem', background: 'rgba(255,77,79,0.1)', padding: '0.5rem', borderRadius: '8px' }}>
            {error}
          </div>
        )}

        <input
          type="password"
          placeholder="SECURITY PASSWORD"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1.2rem', marginBottom: '2rem', borderRadius: '12px', color: 'white', textAlign: 'center', letterSpacing: '4px' }}
        />
        <button type="submit" className="btn-master btn-gold" disabled={isLoading} style={{ width: '100%', justifyContent: 'center', opacity: isLoading ? 0.7 : 1 }}>
          {isLoading ? 'AUTHENTICATING...' : 'UNLOCK PORTAL'}
        </button>
      </form>
    </main>
  );
}
