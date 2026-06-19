import React, { useState, useEffect } from 'react';
import { ShieldAlert, Database, Lock, ShieldCheck, Users, ChevronLeft, Heart } from 'lucide-react';
import { fetchSheetData } from '../utils/sheetSync';
import type { SheetConfig } from '../utils/sheetSync';

interface LoginProps {
  config: SheetConfig;
  onLoginSuccess: (user: { username: string; name: string; role: 'admin' | 'user' }) => void;
}

type LoginMode = 'choice' | 'admin' | 'user';

export const Login: React.FC<LoginProps> = ({ config, onLoginSuccess }) => {
  const [loginMode, setLoginMode] = useState<LoginMode>('choice');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [usersList, setUsersList] = useState<any[]>([]);

  // Load users data from Spreadsheet or LocalStorage on mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        // fetchSheetData handles both demo (localStorage) and crud (GAS) modes
        const data = await fetchSheetData({ ...config, activeSheet: 'Users' });
        if (data && data.rows && data.rows.length > 0) {
          setUsersList(data.rows);
        }
      } catch (err) {
        console.warn('Silent users load failed:', err);
      }
    };

    loadUsers();
  }, [config]);

  const handleModeSelect = (mode: 'admin' | 'user') => {
    setLoginMode(mode);
    setUsername('');
    setPassword('');
    setErrorMsg('');
  };

  const handleBack = () => {
    setLoginMode('choice');
    setUsername('');
    setPassword('');
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 700));

    const trimmedUser = username.trim().toLowerCase();

    if (loginMode === 'admin') {
      // Hardcoded admin fallback
      if (trimmedUser === 'admin' && password === 'admin123') {
        onLoginSuccess({ username: 'admin', name: 'Administrator', role: 'admin' });
        setIsLoading(false);
        return;
      }

      // Check users list for admin role
      const adminUser = usersList.find(
        u => String(u['Username'] || '').trim().toLowerCase() === trimmedUser &&
             String(u['Role'] || '').trim().toLowerCase() === 'admin'
      );
      if (adminUser && String(adminUser['Password'] || '').trim() === password) {
        onLoginSuccess({
          username: adminUser['Username'],
          name: adminUser['Nama Lengkap'] || adminUser['Username'],
          role: 'admin'
        });
        setIsLoading(false);
        return;
      }

      setErrorMsg('Username atau password admin salah, atau akun ini bukan Administrator.');
    } else {
      // User portal — allow any non-admin user
      const foundUser = usersList.find(
        u => String(u['Username'] || '').trim().toLowerCase() === trimmedUser
      );

      if (foundUser) {
        const role = String(foundUser['Role'] || 'user').trim().toLowerCase();

        // Block admin accounts from logging in via the user portal
        if (role === 'admin') {
          setErrorMsg('Akun Administrator tidak dapat masuk melalui portal Petugas Lapangan.');
          setIsLoading(false);
          return;
        }

        if (String(foundUser['Password'] || '').trim() === password) {
          onLoginSuccess({
            username: foundUser['Username'],
            name: foundUser['Nama Lengkap'] || foundUser['Username'],
            role: 'user'
          });
          setIsLoading(false);
          return;
        }
      }

      setErrorMsg('Username atau password salah. Pastikan Anda menggunakan akun Petugas Lapangan.');
    }

    setIsLoading(false);
  };

  return (
    <div className="login-overlay">
      <div className="login-card" style={{ maxWidth: loginMode === 'choice' ? 480 : 400 }}>
        {/* Logo Header */}
        <div className="login-header-icon">
          <Database size={26} />
        </div>
        <h2 className="login-title">Sistem Database BSMP</h2>
        <p className="login-subtitle" style={{ marginBottom: loginMode === 'choice' ? 24 : 28 }}>
          {loginMode === 'choice'
            ? 'Pilih portal masuk sesuai dengan peran Anda.'
            : loginMode === 'admin'
            ? 'Masuk sebagai Administrator sistem.'
            : 'Masuk sebagai Petugas Lapangan.'}
        </p>

        {/* Mode: Role Choice */}
        {loginMode === 'choice' && (
          <div className="role-choice-container" style={{ animation: 'fadeIn 0.3s ease' }}>
            {/* Admin Card */}
            <div className="role-card" onClick={() => handleModeSelect('admin')}>
              <div
                className="role-card-icon"
                style={{ background: 'var(--primary-container)', color: 'var(--on-primary-container)' }}
              >
                <ShieldCheck size={24} />
              </div>
              <span className="role-card-title">Administrator</span>
              <span className="role-card-desc">
                Kelola akun pengguna, audit log aktivitas, dan statistik penggunaan sistem.
              </span>
            </div>

            {/* User/Petugas Card */}
            <div className="role-card" onClick={() => handleModeSelect('user')}>
              <div
                className="role-card-icon"
                style={{ background: 'rgba(109, 213, 140, 0.15)', color: 'var(--success)' }}
              >
                <Heart size={24} />
              </div>
              <span className="role-card-title">Petugas Lapangan</span>
              <span className="role-card-desc">
                Tambah dan kelola rekam medis, profil satwa, serta data penimbangan dan obat.
              </span>
            </div>
          </div>
        )}

        {/* Mode: Login Form (Admin or User) */}
        {(loginMode === 'admin' || loginMode === 'user') && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            {/* Role Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 20,
                marginBottom: 20,
                fontSize: '0.78rem',
                fontWeight: 600,
                background: loginMode === 'admin' ? 'var(--primary-container)' : 'rgba(109, 213, 140, 0.12)',
                color: loginMode === 'admin' ? 'var(--on-primary-container)' : 'var(--success)',
                border: `1px solid ${loginMode === 'admin' ? 'rgba(168,199,250,0.2)' : 'rgba(109,213,140,0.2)'}`,
              }}
            >
              {loginMode === 'admin' ? <ShieldCheck size={13} /> : <Users size={13} />}
              <span>{loginMode === 'admin' ? 'Portal Administrator' : 'Portal Petugas Lapangan'}</span>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div
                className="card"
                style={{
                  background: 'var(--danger-container)',
                  borderColor: 'var(--danger)',
                  padding: '12px 16px',
                  marginBottom: 20,
                  display: 'flex',
                  gap: 10,
                  alignItems: 'center',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <ShieldAlert size={16} className="c-danger" style={{ flexShrink: 0 }} />
                <span className="c-danger" style={{ fontSize: '0.8rem', textAlign: 'left' }}>{errorMsg}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="login-form-group">
                <label className="login-label">
                  {loginMode === 'admin' ? 'Username Admin' : 'Username Petugas'}
                </label>
                <input
                  type="text"
                  className="input"
                  required
                  placeholder={loginMode === 'admin' ? 'Masukkan username admin' : 'Masukkan username petugas'}
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  disabled={isLoading}
                  autoFocus
                />
              </div>

              <div className="login-form-group">
                <label className="login-label">Password</label>
                <input
                  type="password"
                  className="input"
                  required
                  placeholder="Masukkan password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary login-btn"
                disabled={isLoading}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                {isLoading ? (
                  <>
                    <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></div>
                    <span>Memeriksa...</span>
                  </>
                ) : (
                  <>
                    <Lock size={15} />
                    <span>Masuk</span>
                  </>
                )}
              </button>
            </form>

            {/* Back Button */}
            <button
              type="button"
              onClick={handleBack}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginTop: 16,
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                width: '100%',
                justifyContent: 'center',
                padding: '6px',
                borderRadius: 'var(--radius-sm)',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              <ChevronLeft size={15} />
              <span>Kembali ke Pilihan Peran</span>
            </button>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: 24, fontSize: '0.68rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: 16 }}>
          Mode Sinkronisasi: <strong>{config.mode.toUpperCase()}</strong>
        </div>
      </div>
    </div>
  );
};
