import React, { useState } from 'react';
import { GOOGLE_APPS_SCRIPT_CODE } from '../utils/sheetSync';
import { Copy, Check, FileText, HelpCircle } from 'lucide-react';

export const HelpGuide: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    {
      title: 'Buat Spreadsheet Google Sheets',
      desc: 'Buat spreadsheet baru di Google Drive Anda. Di bagian bawah spreadsheet, pastikan Anda membuat lembar kerja (Sheet Tab) dengan nama yang persis sama dengan tabel aplikasi, contohnya: "Medicine", "Blooddraw", "Weighing", "Morfometri (Kedatangan TSI)", "Blowhole_Sample", atau lainnya.'
    },
    {
      title: 'Tulis Baris Header di Spreadsheet',
      desc: 'Masukkan nama kolom pada baris paling atas (Baris 1) di Google Sheet Anda. Contoh untuk sheet "Medicine": ID_medicine (di kolom A), NAMA SATWA (kolom B), KATEGORI (kolom C), NAME OF MEDICINE (kolom D), START (kolom E), STOP (kolom F), NOTE (kolom G).'
    },
    {
      title: 'Buka Google Apps Script',
      desc: 'Di menu atas Google Sheets, klik menu "Extensions" (Ekstensi) > "Apps Script". Ini akan membuka tab baru berisi editor skrip Google.'
    },
    {
      title: 'Salin & Tempel Kode Skrip API',
      desc: 'Hapus semua kode bawaan di editor, lalu salin kode skrip di bawah ini dan tempelkan ke dalam editor Apps Script. Tekan ikon simpan (💾) di bagian atas editor.'
    },
    {
      title: 'Terapkan (Deploy) Sebagai Aplikasi Web',
      desc: 'Klik tombol "Deploy" di kanan atas > "New deployment". Pilih jenis "Web app" (klik ikon roda gigi di samping tulisan select type jika belum muncul). Konfigurasikan: \n- Description: API Database Satwa\n- Execute as: Me (Email Anda)\n- Who has access: Anyone (Siapa saja, termasuk akun anonim)\n\nLalu klik Deploy dan setujui izin akses akun Google Anda.'
    },
    {
      title: 'Hubungkan ke Aplikasi HP',
      desc: 'Salin "Web App URL" yang Anda dapatkan setelah deployment berhasil (berakhiran /exec). Buka menu "Koneksi" di aplikasi ini, ubah mode ke "CRUD", tempelkan link tersebut ke kolom input, lalu klik Simpan.'
    }
  ];

  return (
    <div>
      <h1 className="page-title">Panduan Setup Spreadsheet</h1>
      <p className="page-subtitle">Ikuti langkah mudah di bawah ini untuk menggunakan Google Sheets sebagai database utama Anda.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        
        {/* Step list */}
        <div className="card">
          <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <HelpCircle size={18} className="c-primary" />
            Langkah-Langkah Setup
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
            {steps.map((step, idx) => (
              <div key={idx} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ 
                  background: 'var(--primary-gradient)', 
                  color: 'white', 
                  width: '28px', 
                  height: '28px', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  flexShrink: 0,
                  boxShadow: '0 2px 8px var(--primary-glow)'
                }}>
                  {idx + 1}
                </div>
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: 4 }}>{step.title}</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', whiteSpace: 'pre-line', lineHeight: '1.4' }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Code Block Panel */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 className="card-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileText size={18} className="c-warning" />
              Kode Google Apps Script
            </h2>
            <button className="btn btn-secondary btn-sm" onClick={handleCopy}>
              {copied ? <Check size={14} className="c-success" /> : <Copy size={14} />}
              <span>{copied ? 'Tersalin' : 'Salin Kode'}</span>
            </button>
          </div>
          
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Salin script berikut secara lengkap dan tempel di editor Google Apps Script Anda untuk menghubungkan data:
          </p>

          <div className="code-snippet-box">
            <pre>
              <code>{GOOGLE_APPS_SCRIPT_CODE}</code>
            </pre>
          </div>
        </div>

      </div>
    </div>
  );
};
