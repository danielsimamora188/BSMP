import React, { useState } from 'react';
import { SHEET_NAMES } from '../utils/sheetSync';
import type { SheetConfig } from '../utils/sheetSync';
import { Save, AlertCircle, CheckCircle2, ShieldCheck, Database } from 'lucide-react';

interface SyncSettingsProps {
  config: SheetConfig;
  onConfigChange: (newConfig: SheetConfig) => void;
  connectionStatus: { status: 'success' | 'error' | 'idle'; message: string };
  isTesting: boolean;
}

export const SyncSettings: React.FC<SyncSettingsProps> = ({
  config,
  onConfigChange,
  connectionStatus,
  isTesting
}) => {
  const [mode, setMode] = useState<'demo' | 'csv' | 'crud'>(config.mode);
  const [csvUrl, setCsvUrl] = useState(config.csvUrl);
  const [gasUrl, setGasUrl] = useState(config.gasUrl);
  const [activeSheet, setActiveSheet] = useState(config.activeSheet);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onConfigChange({
      mode,
      csvUrl,
      gasUrl,
      activeSheet
    });
  };

  return (
    <div>
      <h1 className="page-title">Koneksi Database</h1>
      <p className="page-subtitle">Hubungkan aplikasi Anda ke spreadsheet Google Sheets sebagai basis data real-time.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', alignItems: 'start' }}>
        
        {/* Main Sync settings form */}
        <div className="card">
          <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Database size={18} className="c-primary" />
            Konfigurasi Sumber Data
          </h2>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {!!import.meta.env.VITE_GAS_URL && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 12, 
                padding: '12px 16px', 
                background: 'rgba(59, 130, 246, 0.08)', 
                border: '1px solid rgba(59, 130, 246, 0.2)', 
                borderRadius: 'var(--radius-md)',
                marginBottom: 4
              }}>
                <ShieldCheck className="c-primary" size={20} style={{ flexShrink: 0 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Koneksi Cloud Terkonfigurasi Global
                  </span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                    Aplikasi terhubung ke basis data cloud terpusat via Vercel/Environment Variables.
                  </span>
                </div>
              </div>
            )}
            {/* Mode selection cards */}
            <div>
              <label className="stat-label" style={{ marginBottom: 8, display: 'block' }}>Pilih Mode Sinkronisasi</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
                
                <div 
                  className={`card ${mode === 'demo' ? 'active' : ''}`}
                  style={{ 
                    cursor: 'pointer', 
                    padding: 16, 
                    borderWidth: 2, 
                    borderColor: mode === 'demo' ? 'var(--primary)' : 'var(--border-color)',
                    background: mode === 'demo' ? 'rgba(59, 130, 246, 0.05)' : 'var(--bg-card)'
                  }}
                  onClick={() => setMode('demo')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.95rem' }}>1. Mode Demo / Offline</strong>
                    <span className="badge badge-success">Instan & Stabil</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 6 }}>
                    Menggunakan data tiruan satwa laut yang tersimpan lokal di browser. Bisa CRUD langsung tanpa setel spreadsheet.
                  </p>
                </div>

                <div 
                  className={`card ${mode === 'csv' ? 'active' : ''}`}
                  style={{ 
                    cursor: 'pointer', 
                    padding: 16, 
                    borderWidth: 2, 
                    borderColor: mode === 'csv' ? 'var(--primary)' : 'var(--border-color)',
                    background: mode === 'csv' ? 'rgba(59, 130, 246, 0.05)' : 'var(--bg-card)'
                  }}
                  onClick={() => setMode('csv')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.95rem' }}>2. Mode CSV (Hanya Baca / Read-Only)</strong>
                    <span className="badge badge-info">Mudah Dibuat</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 6 }}>
                    Menampilkan data dari Google Sheet secara publik melalui link CSV. Tidak mendukung penambahan atau edit data dari aplikasi.
                  </p>
                </div>

                <div 
                  className={`card ${mode === 'crud' ? 'active' : ''}`}
                  style={{ 
                    cursor: 'pointer', 
                    padding: 16, 
                    borderWidth: 2, 
                    borderColor: mode === 'crud' ? 'var(--primary)' : 'var(--border-color)',
                    background: mode === 'crud' ? 'rgba(59, 130, 246, 0.05)' : 'var(--bg-card)'
                  }}
                  onClick={() => setMode('crud')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.95rem' }}>3. Mode CRUD (Baca & Tulis Real-time)</strong>
                    <span className="badge badge-warning">Fitur Penuh</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 6 }}>
                    Menghubungkan aplikasi ke Google Sheet menggunakan script khusus. Mendukung penambahan, edit, dan hapus data secara instan dari HP Anda.
                  </p>
                </div>

              </div>
            </div>

            {/* Target Sheet Selection */}
            <div>
              <label className="stat-label" style={{ marginBottom: 6, display: 'block' }}>Kategori Lembar Kerja Aktif</label>
              <select
                className="input"
                value={activeSheet}
                onChange={(e) => setActiveSheet(e.target.value)}
              >
                {SHEET_NAMES.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                Pilih kategori tabel yang ingin Anda tampilkan saat ini.
              </p>
            </div>

            {/* Mode-specific Fields */}
            {mode === 'csv' && (
              <div>
                <label className="stat-label" style={{ marginBottom: 6, display: 'block' }}>Link CSV Publik Google Sheets</label>
                <input
                  type="url"
                  className="input"
                  placeholder="https://docs.google.com/spreadsheets/d/e/.../pub?output=csv"
                  value={csvUrl}
                  onChange={(e) => setCsvUrl(e.target.value)}
                  required={mode === 'csv'}
                />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  Tebalkan file &gt; Bagikan &gt; Publikasikan ke web &gt; Pilih CSV &gt; Salin tautannya.
                </p>
              </div>
            )}

            {mode === 'crud' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label className="stat-label" style={{ margin: 0 }}>URL Web App Google Apps Script</label>
                  {!!import.meta.env.VITE_GAS_URL && (
                    <span className="badge badge-info" style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '4px' }}>
                      Bawaan Sistem (.env)
                    </span>
                  )}
                </div>
                <input
                  type="url"
                  className="input"
                  placeholder="https://script.google.com/macros/s/.../exec"
                  value={gasUrl}
                  onChange={(e) => setGasUrl(e.target.value)}
                  required={mode === 'crud'}
                />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  Didapatkan setelah menyebarkan (deploy) Google Apps Script sebagai aplikasi web dengan akses "Siapa Saja".
                </p>
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }} disabled={isTesting}>
              <Save size={18} />
              <span>{isTesting ? 'Menguji Koneksi...' : 'Simpan & Hubungkan'}</span>
            </button>
          </form>
        </div>

        {/* Connection Status Panel */}
        <div className="card">
          <h2 className="card-title">Status Koneksi</h2>
          
          {connectionStatus.status === 'success' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 12, background: 'var(--success-glow)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 className="c-success" size={20} />
                <strong className="c-success" style={{ fontSize: '0.9rem' }}>Terhubung Sukses</strong>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {connectionStatus.message}
              </p>
            </div>
          )}

          {connectionStatus.status === 'error' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 12, background: 'var(--danger-glow)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertCircle className="c-danger" size={20} />
                <strong className="c-danger" style={{ fontSize: '0.9rem' }}>Koneksi Gagal</strong>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {connectionStatus.message}
              </p>
            </div>
          )}

          {connectionStatus.status === 'idle' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 12, background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShieldCheck className="c-warning" size={20} />
                <strong className="c-warning" style={{ fontSize: '0.9rem' }}>Menunggu Konfigurasi</strong>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Tekan tombol "Simpan & Hubungkan" untuk mengaktifkan sumber data baru.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
