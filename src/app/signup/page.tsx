'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      alert('Check your email for the confirmation link!');
      router.push('/login');
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
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Join Linguaplanet</h1>
            <p style={{ opacity: 0.6, fontSize: '0.9rem', letterSpacing: '1px' }}>START YOUR PROFESSIONAL JOURNEY</p>
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

          <form onSubmit={handleSignup}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px' }}>FULL NAME</label>
              <input 
                type="text" 
                required 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{ width: '100%', padding: '1rem', borderRadius: '2px', border: '1px solid var(--gray-light)', outline: 'none' }}
                placeholder="John Doe"
              />
            </div>
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
                placeholder="Minimum 6 characters"
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', marginBottom: '1.5rem' }}
              disabled={loading}
            >
              {loading ? 'CREATING PROFILE...' : 'SIGN UP'}
            </button>
          </form>

          <div className="text-center" style={{ fontSize: '0.9rem' }}>
            <p style={{ opacity: 0.7 }}>Already have an account?</p>
            <Link href="/login" style={{ color: 'var(--accent-gold)', fontWeight: 600, marginTop: '0.5rem', display: 'inline-block' }}>SIGN IN TO YOUR DASHBOARD</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
