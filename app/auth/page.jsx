'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'

export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState('login') // 'login' | 'signup' | 'forgot'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const supabase = getSupabase()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/')
        router.refresh()

      } else if (mode === 'signup') {
        if (password.length < 8) throw new Error('Password must be at least 8 characters.')
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username: username || email.split('@')[0] },
          },
        })
        if (error) throw error
        setSuccess('Account created! Check your email to confirm, then log in.')
        setMode('login')

      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset`,
        })
        if (error) throw error
        setSuccess('Password reset link sent — check your email.')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` },
    })
    if (error) setError(error.message)
  }

  const inputStyle = {
    width: '100%',
    background: '#111',
    border: '1px solid #2a2a2a',
    borderRadius: '2px',
    padding: '14px 16px',
    color: '#fff',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  }

  const labelStyle = {
    display: 'block',
    color: 'rgba(255,255,255,0.45)',
    fontFamily: 'monospace',
    fontSize: '10px',
    letterSpacing: '2px',
    marginBottom: '8px',
    fontWeight: 'bold',
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080808',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      color: '#fff',
    }}>
      {/* Nav */}
      <div style={{
        padding: '20px 40px',
        borderBottom: '1px solid #1a1a1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <a href="/" style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          textDecoration: 'none', color: 'inherit',
        }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00FF88', boxShadow: '0 0 10px #00FF88' }} />
          <span style={{ fontFamily: 'monospace', fontSize: '14px', fontWeight: '900', letterSpacing: '2px' }}>
            CONCERNED NIGERIAN
          </span>
        </a>
        <a href="/" style={{ color: '#555', fontFamily: 'monospace', fontSize: '11px', textDecoration: 'none', letterSpacing: '1px' }}>
          ← BACK
        </a>
      </div>

      {/* Main */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>

          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#FF4500', letterSpacing: '3px', marginBottom: '10px', fontWeight: 'bold' }}>
              {mode === 'login' ? 'WELCOME BACK' : mode === 'signup' ? 'JOIN THE MOVEMENT' : 'RESET PASSWORD'}
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: '900', letterSpacing: '-1px', margin: '0 0 8px', lineHeight: 1.2 }}>
              {mode === 'login' && 'Sign in to your account'}
              {mode === 'signup' && 'Create your account'}
              {mode === 'forgot' && 'Forgot your password?'}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: 0 }}>
              {mode === 'login' && 'Stay informed. Stay vocal. Hold power accountable.'}
              {mode === 'signup' && 'Join Nigerians demanding accountability and real change.'}
              {mode === 'forgot' && "Enter your email and we'll send you a reset link."}
            </p>
          </div>

          {/* Mode tabs (login/signup only) */}
          {mode !== 'forgot' && (
            <div style={{ display: 'flex', marginBottom: '28px', borderBottom: '1px solid #222' }}>
              {['login', 'signup'].map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(null); setSuccess(null); }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: mode === m ? '2px solid #FF4500' : '2px solid transparent',
                    color: mode === m ? '#fff' : '#555',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    letterSpacing: '2px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    marginBottom: '-1px',
                  }}
                >
                  {m === 'login' ? 'LOG IN' : 'SIGN UP'}
                </button>
              ))}
            </div>
          )}

          {/* Error / Success */}
          {error && (
            <div style={{
              background: '#1a0000',
              border: '1px solid #FF0000',
              color: '#FF4444',
              padding: '12px 16px',
              fontFamily: 'monospace',
              fontSize: '12px',
              marginBottom: '20px',
              lineHeight: '1.5',
            }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{
              background: '#001a0a',
              border: '1px solid #00FF88',
              color: '#00CC6A',
              padding: '12px 16px',
              fontFamily: 'monospace',
              fontSize: '12px',
              marginBottom: '20px',
              lineHeight: '1.5',
            }}>
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Username (signup only) */}
            {mode === 'signup' && (
              <div>
                <label style={labelStyle}>USERNAME</label>
                <input
                  type="text"
                  placeholder="e.g. concerned_naija"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = '#FF4500'}
                  onBlur={(e) => e.target.style.borderColor = '#2a2a2a'}
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label style={labelStyle}>EMAIL ADDRESS</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = '#FF4500'}
                onBlur={(e) => e.target.style.borderColor = '#2a2a2a'}
              />
            </div>

            {/* Password */}
            {mode !== 'forgot' && (
              <div>
                <label style={labelStyle}>PASSWORD</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={mode === 'signup' ? 'Min. 8 characters' : '••••••••'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ ...inputStyle, paddingRight: '48px' }}
                    onFocus={(e) => e.target.style.borderColor = '#FF4500'}
                    onBlur={(e) => e.target.style.borderColor = '#2a2a2a'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute', right: '14px', top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none', border: 'none',
                      color: '#555', cursor: 'pointer', fontSize: '12px',
                      fontFamily: 'monospace', letterSpacing: '1px',
                    }}
                  >
                    {showPassword ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setError(null); setSuccess(null); }}
                    style={{
                      background: 'none', border: 'none',
                      color: '#FF4500', cursor: 'pointer',
                      fontFamily: 'monospace', fontSize: '10px',
                      letterSpacing: '1px', marginTop: '8px',
                      padding: 0, textDecoration: 'underline',
                    }}
                  >
                    FORGOT PASSWORD?
                  </button>
                )}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? '#333' : '#FF4500',
                border: 'none',
                color: '#fff',
                padding: '15px',
                fontFamily: 'monospace',
                fontSize: '13px',
                fontWeight: 'bold',
                letterSpacing: '2px',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '4px',
                transition: 'background 0.2s',
                width: '100%',
              }}
            >
              {loading ? 'PLEASE WAIT...' : mode === 'login' ? 'LOG IN' : mode === 'signup' ? 'CREATE ACCOUNT' : 'SEND RESET LINK'}
            </button>
          </form>

          {/* Divider + Google (login/signup only) */}
          {mode !== 'forgot' && (
            <>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                margin: '24px 0',
              }}>
                <div style={{ flex: 1, height: '1px', background: '#222' }} />
                <span style={{ color: '#444', fontFamily: 'monospace', fontSize: '10px', letterSpacing: '1px' }}>OR</span>
                <div style={{ flex: 1, height: '1px', background: '#222' }} />
              </div>

              <button
                onClick={handleGoogleLogin}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: '1px solid #333',
                  color: '#ccc',
                  padding: '14px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#555'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#333'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                CONTINUE WITH GOOGLE
              </button>
            </>
          )}

          {/* Back link (forgot mode) */}
          {mode === 'forgot' && (
            <button
              onClick={() => { setMode('login'); setError(null); setSuccess(null); }}
              style={{
                background: 'none', border: 'none', color: '#555',
                cursor: 'pointer', fontFamily: 'monospace', fontSize: '11px',
                letterSpacing: '1px', marginTop: '20px', padding: 0,
                textDecoration: 'underline', width: '100%', textAlign: 'center',
              }}
            >
              ← BACK TO LOGIN
            </button>
          )}

          {/* Terms */}
          {mode === 'signup' && (
            <p style={{ color: '#444', fontSize: '11px', textAlign: 'center', marginTop: '20px', lineHeight: '1.6' }}>
              By creating an account you agree to our{' '}
              <span style={{ color: '#FF4500' }}>Terms of Service</span>{' '}
              and{' '}
              <span style={{ color: '#FF4500' }}>Privacy Policy</span>.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
