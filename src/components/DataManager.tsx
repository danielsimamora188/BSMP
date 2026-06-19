import React, { useState, useMemo } from 'react';
import { executeWriteAction } from '../utils/sheetSync';
import type { SheetData, SheetConfig } from '../utils/sheetSync';
import {
  Search, Plus, Edit2, Trash2, Info, X, ShieldAlert,
  Filter, CheckCircle, XCircle, ChevronRight
} from 'lucide-react';

/* ─── Date formatting helpers ─── */
const INDONESIAN_MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const INDONESIAN_MONTHS_MAP: Record<string, number> = {
  'jan': 0, 'januari': 0, 'january': 0,
  'feb': 1, 'februari': 1, 'february': 1,
  'mar': 2, 'maret': 2, 'march': 2,
  'apr': 3, 'april': 3,
  'mei': 4, 'may': 4,
  'jun': 5, 'juni': 5, 'june': 5,
  'jul': 6, 'juli': 6, 'july': 6,
  'agu': 7, 'agustus': 7, 'august': 7, 'agt': 7,
  'sep': 8, 'september': 8,
  'okt': 9, 'oktober': 9, 'october': 9,
  'nov': 10, 'november': 10,
  'des': 11, 'desember': 11, 'december': 11
};

const padDay = (d: number) => (d < 10 ? `0${d}` : `${d}`);

/** Convert any date string to "dd MMMM yyyy" Indonesian format for display */
const formatDateIndonesian = (dateStr: string): string => {
  if (!dateStr || dateStr === '-' || dateStr === 'null') return '-';
  const clean = dateStr.trim();

  // 1. Already "dd MonthName yyyy" (with any month name)
  const parts = clean.split(/\s+/);
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const mName = parts[1].toLowerCase();
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && !isNaN(year) && year > 1900 && year < 2100) {
      const mIdx = INDONESIAN_MONTHS_MAP[mName];
      if (mIdx !== undefined) {
        return `${padDay(day)} ${INDONESIAN_MONTHS[mIdx]} ${year}`;
      }
    }
  }

  // 2. "dd/mm/yyyy" or "dd-mm-yyyy"
  const dmyMatch = clean.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (dmyMatch) {
    const d = parseInt(dmyMatch[1], 10);
    const m = parseInt(dmyMatch[2], 10) - 1;
    const y = parseInt(dmyMatch[3], 10);
    if (m >= 0 && m < 12) return `${padDay(d)} ${INDONESIAN_MONTHS[m]} ${y}`;
  }

  // 3. "yyyy-mm-dd" (from <input type="date">)
  const ymdMatch = clean.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (ymdMatch) {
    const y = parseInt(ymdMatch[1], 10);
    const m = parseInt(ymdMatch[2], 10) - 1;
    const d = parseInt(ymdMatch[3], 10);
    if (m >= 0 && m < 12) return `${padDay(d)} ${INDONESIAN_MONTHS[m]} ${y}`;
  }

  // 4. JS Date fallback
  const parsed = new Date(clean);
  if (!isNaN(parsed.getTime())) {
    return `${padDay(parsed.getDate())} ${INDONESIAN_MONTHS[parsed.getMonth()]} ${parsed.getFullYear()}`;
  }

  return clean;
};

/** Convert stored date (any format) to "yyyy-mm-dd" for <input type="date"> value */
const formatDateForInput = (dateStr: string): string => {
  if (!dateStr || dateStr === '-') return '';
  const clean = dateStr.trim();

  const parts = clean.split(/\s+/);
  if (parts.length === 3) {
    const d = parseInt(parts[0], 10);
    const mIdx = INDONESIAN_MONTHS_MAP[parts[1].toLowerCase()];
    const y = parseInt(parts[2], 10);
    if (!isNaN(d) && mIdx !== undefined && !isNaN(y)) {
      return `${y}-${String(mIdx + 1).padStart(2, '0')}-${padDay(d)}`;
    }
  }

  const dmyMatch = clean.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (dmyMatch) {
    const d = parseInt(dmyMatch[1], 10);
    const m = parseInt(dmyMatch[2], 10);
    const y = parseInt(dmyMatch[3], 10);
    return `${y}-${String(m).padStart(2, '0')}-${padDay(d)}`;
  }

  const ymdMatch = clean.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (ymdMatch) return clean.replace(/\//g, '-');

  const parsed = new Date(clean);
  if (!isNaN(parsed.getTime())) {
    const y = parsed.getFullYear();
    const m = String(parsed.getMonth() + 1).padStart(2, '0');
    const d = String(parsed.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  return '';
};

interface DataManagerProps {
  data: SheetData;
  config: SheetConfig;
  onRefresh: () => void;
  /** Daftar nama satwa yang diambil dari sheet Satwa (diisi dari App.tsx) */
  satwaNames?: string[];
}

export const DataManager: React.FC<DataManagerProps> = ({ data, config, onRefresh, satwaNames: satwaNamesProp }) => {
  const { headers, rows } = data;

  const [searchTerm, setSearchTerm] = useState('');
  const [animalFilter, setAnimalFilter] = useState('ALL');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'update'>('create');
  const [selectedRow, setSelectedRow] = useState<Record<string, any> | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete confirmation
  const [deleteConfirmRow, setDeleteConfirmRow] = useState<Record<string, any> | null>(null);

  const primaryIdKey = headers[0] || '';

  // Detect animal name column
  const animalHeader = useMemo(() => {
    return headers.find(h => h.toUpperCase().includes('NAMA') || h.toUpperCase().includes('SATWA')) || '';
  }, [headers]);

  // Daftar nama satwa: prioritaskan prop dari App (diambil dari Satwa sheet),
  // fallback ke nama-nama unik yang ada di baris data saat ini.
  const animalList = useMemo(() => {
    // Gunakan prop satwaNames jika tersedia dan tidak kosong
    if (satwaNamesProp && satwaNamesProp.length > 0) {
      return satwaNamesProp;
    }
    // Fallback: ambil dari baris data aktif
    if (!animalHeader) return [];
    const names = new Set<string>();
    rows.forEach(r => {
      const name = r[animalHeader];
      if (name && String(name).trim() !== '-' && String(name).trim() !== '') {
        names.add(String(name).trim().toUpperCase());
      }
    });
    return Array.from(names);
  }, [satwaNamesProp, rows, animalHeader]);

  // Search & Filter rows
  const filteredRows = useMemo(() => {
    let results = [...rows];

    results = results.filter(row => {
      const allDashes = Object.entries(row).every(([k, v]) => {
        if (k === '__rowNum__') return true;
        const val = String(v).trim();
        return val === '-' || val === '';
      });
      return !allDashes;
    });

    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      results = results.filter(row =>
        Object.entries(row).some(([key, val]) => {
          if (key === '__rowNum__') return false;
          return String(val).toLowerCase().includes(query);
        })
      );
    }

    if (animalFilter !== 'ALL' && animalHeader) {
      results = results.filter(row => String(row[animalHeader]).trim().toUpperCase() === animalFilter);
    }

    return results;
  }, [rows, searchTerm, animalFilter, animalHeader]);

  const openCreateModal = () => {
    setModalType('create');
    setSelectedRow(null);
    setErrorMsg('');
    const initialForm: Record<string, any> = {};
    headers.forEach((h, idx) => {
      if (idx === 0 && (h.toUpperCase().includes('ID') || h.toUpperCase().includes('KODE'))) {
        initialForm[h] = Math.floor(100000 + Math.random() * 900000).toString();
      } else if (h.toUpperCase() === 'KATEGORI') {
        initialForm[h] = config.activeSheet;
      } else if (h === animalHeader && animalFilter !== 'ALL') {
        initialForm[h] = animalFilter;
      } else if (h === animalHeader && animalList.length > 0) {
        initialForm[h] = animalList[0];
      } else {
        initialForm[h] = '';
      }
    });
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (row: Record<string, any>) => {
    setModalType('update');
    setSelectedRow(row);
    setErrorMsg('');
    setFormData({ ...row });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!formData[primaryIdKey] || String(formData[primaryIdKey]).trim() === '') {
      setErrorMsg(`Kolom Kunci Utama (${primaryIdKey}) wajib diisi!`);
      return;
    }
    setIsSubmitting(true);
    try {
      const idVal = modalType === 'update' && selectedRow ? selectedRow[primaryIdKey] : undefined;
      const success = await executeWriteAction(
        config,
        modalType === 'create' ? 'create' : 'update',
        formData,
        idVal || formData[primaryIdKey]
      );
      if (success) {
        setIsModalOpen(false);
        onRefresh();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (row: Record<string, any>) => {
    const idVal = row[primaryIdKey];
    if (!idVal) return;
    try {
      const success = await executeWriteAction(config, 'delete', {}, idVal);
      if (success) {
        setDeleteConfirmRow(null);
        onRefresh();
      }
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus data.');
    }
  };

  const renderVal = (val: any) => {
    const s = String(val ?? '').trim();
    if (s === '' || s === '-' || s === 'null') return <span className="badge-empty">—</span>;
    return s;
  };

  /* ─── PER-SHEET ROW RENDERERS ─── */

  const renderMedicineRow = (row: Record<string, any>, idx: number) => {
    const isCompleted = row['STOP'] && row['STOP'] !== '-';
    return (
      <div className="list-row" key={idx}>
        <div className="list-row-left">
          <div className="list-avatar" style={{ background: isCompleted ? 'var(--success-container)' : 'var(--primary-container)' }}>
            {isCompleted
              ? <CheckCircle size={16} style={{ color: 'var(--success)' }} />
              : <ChevronRight size={16} style={{ color: 'var(--on-primary-container)' }} />}
          </div>
          <div className="list-row-body">
            <span className="list-row-title">{row['NAME OF MEDICINE']}</span>
            <span className="list-row-sub">
              {row['NAMA SATWA']} &nbsp;·&nbsp; {formatDateIndonesian(row['START'])} → {row['STOP'] === '-' || !row['STOP'] ? 'Sekarang' : formatDateIndonesian(row['STOP'])}
            </span>
            {row['NOTE'] && row['NOTE'] !== '-' && (
              <span className="list-row-note">{row['NOTE']}</span>
            )}
          </div>
        </div>
        <div className="list-row-meta">
          <span className={`badge ${isCompleted ? 'badge-success' : 'badge-warning'}`}>
            {isCompleted ? 'Selesai' : 'Aktif'}
          </span>
          <div className="list-row-actions">
            <button className="btn btn-secondary btn-icon-only list-btn" onClick={() => openEditModal(row)}><Edit2 size={13} className="c-primary" /></button>
            <button className="btn btn-secondary btn-icon-only list-btn" onClick={() => setDeleteConfirmRow(row)}><Trash2 size={13} className="c-danger" /></button>
          </div>
        </div>
      </div>
    );
  };

  const renderBlooddrawRow = (row: Record<string, any>, idx: number) => {
    const isSuccess = String(row['SUCCEEDED / FAILED']).toUpperCase() === 'TRUE';
    return (
      <div className="list-row" key={idx}>
        <div className="list-row-left">
          <div className="list-avatar" style={{ background: isSuccess ? 'var(--success-container)' : 'var(--danger-container)' }}>
            {isSuccess
              ? <CheckCircle size={16} style={{ color: 'var(--success)' }} />
              : <XCircle size={16} style={{ color: 'var(--danger)' }} />}
          </div>
          <div className="list-row-body">
            <span className="list-row-title">{row['NAMA SATWA']}</span>
            <span className="list-row-sub">{formatDateIndonesian(row['DATE'])} &nbsp;·&nbsp; {row['DOCTOR']}</span>
          </div>
        </div>
        <div className="list-row-meta">
          <span className={`badge ${isSuccess ? 'badge-success' : 'badge-danger'}`}>
            {isSuccess ? 'Berhasil' : 'Gagal'}
          </span>
          <div className="list-row-actions">
            <button className="btn btn-secondary btn-icon-only list-btn" onClick={() => openEditModal(row)}><Edit2 size={13} className="c-primary" /></button>
            <button className="btn btn-secondary btn-icon-only list-btn" onClick={() => setDeleteConfirmRow(row)}><Trash2 size={13} className="c-danger" /></button>
          </div>
        </div>
      </div>
    );
  };

  const renderWeighingRow = (row: Record<string, any>, idx: number) => (
    <div className="list-row" key={idx}>
      <div className="list-row-left">
        <div className="list-avatar" style={{ background: '#1a3a2a' }}>
          <span style={{ color: 'var(--success)', fontWeight: 800, fontSize: '0.7rem' }}>KG</span>
        </div>
        <div className="list-row-body">
          <span className="list-row-title">{row['NAMA SATWA']}</span>
          <span className="list-row-sub">{formatDateIndonesian(row['DATE'])}{row['NOTE'] && row['NOTE'] !== '' ? ` · ${row['NOTE']}` : ''}</span>
        </div>
      </div>
      <div className="list-row-meta">
        <span className="list-weight-val">{row['HEAVY']}</span>
        <div className="list-row-actions">
          <button className="btn btn-secondary btn-icon-only list-btn" onClick={() => openEditModal(row)}><Edit2 size={13} className="c-primary" /></button>
          <button className="btn btn-secondary btn-icon-only list-btn" onClick={() => setDeleteConfirmRow(row)}><Trash2 size={13} className="c-danger" /></button>
        </div>
      </div>
    </div>
  );

  const renderTubingRow = (row: Record<string, any>, idx: number) => (
    <div className="list-row" key={idx}>
      <div className="list-row-left">
        <div className="list-avatar" style={{ background: '#1a2e3a' }}>
          <span style={{ color: '#f2c55c', fontWeight: 800, fontSize: '0.65rem' }}>ML</span>
        </div>
        <div className="list-row-body">
          <span className="list-row-title">{row['NAMA SATWA']}</span>
          <span className="list-row-sub">{formatDateIndonesian(row['DATE'])}{row['NOTE'] && row['NOTE'] !== '' ? ` · ${row['NOTE']}` : ''}</span>
        </div>
      </div>
      <div className="list-row-meta">
        <span className="list-weight-val" style={{ color: '#f2c55c' }}>{row['ML']}</span>
        <div className="list-row-actions">
          <button className="btn btn-secondary btn-icon-only list-btn" onClick={() => openEditModal(row)}><Edit2 size={13} className="c-primary" /></button>
          <button className="btn btn-secondary btn-icon-only list-btn" onClick={() => setDeleteConfirmRow(row)}><Trash2 size={13} className="c-danger" /></button>
        </div>
      </div>
    </div>
  );

  const renderSampleRow = (row: Record<string, any>, idx: number) => (
    <div className="list-row" key={idx}>
      <div className="list-row-left">
        <div className="list-avatar" style={{ background: 'var(--primary-container)' }}>
          <ChevronRight size={16} style={{ color: 'var(--on-primary-container)' }} />
        </div>
        <div className="list-row-body">
          <span className="list-row-title">{row['NAMA SATWA']}</span>
          <span className="list-row-sub">{formatDateIndonesian(row['DATE'])} &nbsp;·&nbsp; {row['DOCTOR']}</span>
          {row['NOTE'] && row['NOTE'] !== '-' && (
            <span className="list-row-note">{row['NOTE']}</span>
          )}
        </div>
      </div>
      <div className="list-row-meta">
        <div className="list-row-actions">
          <button className="btn btn-secondary btn-icon-only list-btn" onClick={() => openEditModal(row)}><Edit2 size={13} className="c-primary" /></button>
          <button className="btn btn-secondary btn-icon-only list-btn" onClick={() => setDeleteConfirmRow(row)}><Trash2 size={13} className="c-danger" /></button>
        </div>
      </div>
    </div>
  );

  const renderOthersRow = (row: Record<string, any>, idx: number) => (
    <div className="list-row" key={idx}>
      <div className="list-row-left">
        <div className="list-avatar" style={{ background: '#2a1a3a' }}>
          <ChevronRight size={16} style={{ color: '#c9a6ff' }} />
        </div>
        <div className="list-row-body">
          <span className="list-row-title">{row['NAMA SATWA']}</span>
          <span className="list-row-sub">{formatDateIndonesian(row['DATE'])}</span>
          {row['INFORMATION'] && (
            <span className="list-row-note">{row['INFORMATION']}</span>
          )}
        </div>
      </div>
      <div className="list-row-meta">
        <div className="list-row-actions">
          <button className="btn btn-secondary btn-icon-only list-btn" onClick={() => openEditModal(row)}><Edit2 size={13} className="c-primary" /></button>
          <button className="btn btn-secondary btn-icon-only list-btn" onClick={() => setDeleteConfirmRow(row)}><Trash2 size={13} className="c-danger" /></button>
        </div>
      </div>
    </div>
  );

  const renderGenericRow = (row: Record<string, any>, idx: number) => {
    const displayCols = headers.filter(h => h !== primaryIdKey && h !== '__rowNum__');
    const mainCol = displayCols[0] || '';
    const subCols = displayCols.slice(1, 3);
    return (
      <div className="list-row" key={idx}>
        <div className="list-row-left">
          <div className="list-avatar" style={{ background: 'var(--bg-surface-variant)' }}>
            <ChevronRight size={16} style={{ color: 'var(--text-secondary)' }} />
          </div>
          <div className="list-row-body">
            <span className="list-row-title">{renderVal(row[mainCol])}</span>
            {subCols.length > 0 && (
              <span className="list-row-sub">
                {subCols.map(c => renderVal(row[c])).join(' · ')}
              </span>
            )}
          </div>
        </div>
        <div className="list-row-meta">
          <div className="list-row-actions">
            <button className="btn btn-secondary btn-icon-only list-btn" onClick={() => openEditModal(row)}><Edit2 size={13} className="c-primary" /></button>
            <button className="btn btn-secondary btn-icon-only list-btn" onClick={() => setDeleteConfirmRow(row)}><Trash2 size={13} className="c-danger" /></button>
          </div>
        </div>
      </div>
    );
  };

  const renderRow = (row: Record<string, any>, idx: number) => {
    switch (config.activeSheet) {
      case 'Medicine':        return renderMedicineRow(row, idx);
      case 'Blooddraw':       return renderBlooddrawRow(row, idx);
      case 'Weighing':        return renderWeighingRow(row, idx);
      case 'Tubing':          return renderTubingRow(row, idx);
      case 'Blowhole_Sample':
      case 'Stomach_Sample':  return renderSampleRow(row, idx);
      case 'Others':          return renderOthersRow(row, idx);
      default:                return renderGenericRow(row, idx);
    }
  };

  /* ─── Subtitle per sheet ─── */
  const sheetSubtitle: Record<string, string> = {
    Medicine:        'Riwayat pemberian obat dan suplemen per satwa.',
    Blooddraw:       'Rekaman pengambilan sampel darah beserta hasil.',
    Weighing:        'Riwayat penimbangan berat badan satwa.',
    Blowhole_Sample: 'Rekaman pengambilan sampel blowhole.',
    Stomach_Sample:  'Rekaman pengambilan sampel lambung.',
    Tubing:          'Rekaman pemberian cairan melalui selang.',
    Others:          'Catatan medis dan penanganan lainnya.',
  };

  return (
    <div>
      {/* Page header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h1 className="page-title">{config.activeSheet.replace('_', ' ')}</h1>
          <p className="page-subtitle">{sheetSubtitle[config.activeSheet] || 'Rekam medis satwa.'}</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={openCreateModal}>
          <Plus size={16} />
          <span>Tambah</span>
        </button>
      </div>

      {/* Search + Filter */}
      <div className="card data-controls" style={{ borderRadius: 'var(--radius-lg)', marginBottom: 16 }}>
        <div className="search-wrapper">
          <Search size={18} />
          <input
            type="text"
            className="input"
            placeholder={`Cari di tabel ${config.activeSheet.replace('_', ' ')}...`}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        {animalHeader && animalList.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Filter size={14} className="c-primary" />
            <select
              className="input"
              style={{ padding: '6px 12px', height: 36, borderRadius: 18, minWidth: 130 }}
              value={animalFilter}
              onChange={e => setAnimalFilter(e.target.value)}
            >
              <option value="ALL">Semua Satwa</option>
              {animalList.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              {filteredRows.length} entri
            </span>
          </div>
        )}
      </div>

      {/* LIST */}
      {filteredRows.length === 0 ? (
        <div className="card empty-state">
          <Info size={40} className="c-primary" style={{ marginBottom: 12 }} />
          <h3 style={{ color: 'var(--text-primary)', marginBottom: 6 }}>Belum Ada Data</h3>
          <p>Belum ada data yang sesuai. Gunakan tombol + Tambah untuk memulai.</p>
        </div>
      ) : (
        <div className="list-container">
          {filteredRows.map((row, idx) => renderRow(row, idx))}
        </div>
      )}

      {/* ─── CRUD Modal ─── */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="card-title" style={{ margin: 0 }}>
                {modalType === 'create' ? 'Tambah Data Baru' : 'Ubah Data Rekaman'}
              </h3>
              <button className="btn btn-secondary btn-sm btn-icon-only" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {errorMsg && (
                  <div className="card" style={{ background: 'var(--danger-container)', borderColor: 'var(--danger)', padding: 12, marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
                    <ShieldAlert size={18} className="c-danger" />
                    <span className="c-danger" style={{ fontSize: '0.85rem' }}>{errorMsg}</span>
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {headers.map((header, idx) => {
                    const h = header.toUpperCase();
                    const isId       = idx === 0;
                    const isAnimal   = header === animalHeader;
                    const isSucceeded = h.includes('SUCCEEDED') || h.includes('FAILED');
                    const isDate     = h === 'DATE' || h === 'START' || h === 'STOP' || h.includes('TANGGAL');
                    const isNumber   = h.includes('HEAVY') || h === 'ML' || h.includes('(CM)');
                    const isTextarea = h === 'NOTE' || h === 'INFORMATION' || h === 'CATATAN' || h === 'KETERANGAN';
                    const isKategori = h === 'KATEGORI';

                    if (isId) return (
                      <div key={header}>
                        <label className="stat-label" style={{ marginBottom: 6, display: 'block' }}>{header} <span style={{ color: 'var(--text-muted)' }}>(Kunci Utama)</span></label>
                        <input type="text" className="input" required disabled={modalType === 'update'}
                          value={formData[header] || ''}
                          onChange={e => setFormData({ ...formData, [header]: e.target.value })} />
                      </div>
                    );

                    if (isKategori) return (
                      <div key={header}>
                        <label className="stat-label" style={{ marginBottom: 6, display: 'block' }}>{header}</label>
                        <input type="text" className="input" readOnly
                          value={formData[header] || config.activeSheet}
                          style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                      </div>
                    );

                    if (isAnimal) return (
                      <div key={header}>
                        <label className="stat-label" style={{ marginBottom: 6, display: 'block' }}>{header}</label>
                        <select className="input" value={formData[header] || (animalList[0] || '')}
                          onChange={e => setFormData({ ...formData, [header]: e.target.value })}>
                          {animalList.length === 0 ? (
                            <option value="">— Belum ada satwa —</option>
                          ) : (
                            animalList.map(n => (
                              <option key={n} value={n}>{n}</option>
                            ))
                          )}
                        </select>
                      </div>
                    );

                    if (isSucceeded) return (
                      <div key={header}>
                        <label className="stat-label" style={{ marginBottom: 6, display: 'block' }}>{header}</label>
                        <select className="input" value={formData[header] || 'TRUE'}
                          onChange={e => setFormData({ ...formData, [header]: e.target.value })}>
                          <option value="TRUE">✅ TRUE — Berhasil</option>
                          <option value="FALSE">❌ FALSE — Gagal</option>
                        </select>
                      </div>
                    );

                    if (isDate) return (
                      <div key={header}>
                        <label className="stat-label" style={{ marginBottom: 6, display: 'block' }}>{header}</label>
                        <input type="date" className="input"
                          value={formatDateForInput(formData[header] || '')}
                          onChange={e => setFormData({ ...formData, [header]: formatDateIndonesian(e.target.value) })} />
                      </div>
                    );

                    if (isNumber) return (
                      <div key={header}>
                        <label className="stat-label" style={{ marginBottom: 6, display: 'block' }}>{header}</label>
                        <input type="number" className="input" step="0.1" min="0"
                          value={formData[header] || ''}
                          onChange={e => setFormData({ ...formData, [header]: e.target.value })} />
                      </div>
                    );

                    if (isTextarea) return (
                      <div key={header}>
                        <label className="stat-label" style={{ marginBottom: 6, display: 'block' }}>{header}</label>
                        <textarea className="input" rows={3}
                          style={{ resize: 'vertical', minHeight: 72 }}
                          value={formData[header] || ''}
                          onChange={e => setFormData({ ...formData, [header]: e.target.value })} />
                      </div>
                    );

                    return (
                      <div key={header}>
                        <label className="stat-label" style={{ marginBottom: 6, display: 'block' }}>{header}</label>
                        <input type="text" className="input" value={formData[header] || ''}
                          onChange={e => setFormData({ ...formData, [header]: e.target.value })} />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Batal</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Delete Confirmation ─── */}
      {deleteConfirmRow && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 400 }}>
            <div className="modal-header">
              <h3 className="card-title c-danger" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Trash2 size={18} /> Konfirmasi Hapus
              </h3>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-primary)' }}>
                Apakah Anda yakin ingin menghapus data dengan ID&nbsp;
                <strong>{String(deleteConfirmRow[primaryIdKey])}</strong>?
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirmRow(null)}>Batal</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirmRow)}>Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
