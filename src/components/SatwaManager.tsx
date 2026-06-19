import React, { useState } from 'react';
import { executeWriteAction } from '../utils/sheetSync';
import type { SheetData, SheetConfig } from '../utils/sheetSync';
import { 
  Search, Plus, Edit2, Trash2, Info, X, ShieldAlert, 
  Ruler, User, Calendar, Tag, ChevronDown, ChevronUp,
  Upload
} from 'lucide-react';

const formatDateIndonesian = (dateStr: string): string => {
  if (!dateStr || dateStr === '-') return '-';
  const cleanStr = dateStr.trim();
  
  // 1. Check split-by-space: e.g. "21 April 2014" or "13 June 2014"
  const parts = cleanStr.split(/\s+/);
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const monthName = parts[1].toLowerCase();
    const year = parseInt(parts[2], 10);
    
    if (!isNaN(day) && !isNaN(year) && year > 1900 && year < 2100) {
      const indonesianMonthsMap: Record<string, string> = {
        'jan': 'Januari', 'januari': 'Januari', 'january': 'Januari',
        'feb': 'Februari', 'februari': 'Februari', 'february': 'Februari',
        'mar': 'Maret', 'maret': 'Maret', 'march': 'Maret',
        'apr': 'April', 'april': 'April',
        'mei': 'Mei', 'may': 'Mei',
        'jun': 'Juni', 'juni': 'Juni', 'june': 'Juni',
        'jul': 'Juli', 'juli': 'Juli', 'july': 'Juli',
        'agu': 'Agustus', 'agustus': 'Agustus', 'august': 'Agustus', 'agt': 'Agustus',
        'sep': 'September', 'september': 'September',
        'okt': 'Oktober', 'oktober': 'Oktober', 'october': 'Oktober',
        'nov': 'November', 'november': 'November',
        'des': 'Desember', 'desember': 'Desember', 'december': 'Desember'
      };
      
      const matchedMonth = indonesianMonthsMap[monthName];
      if (matchedMonth) {
        const dayStr = day < 10 ? `0${day}` : `${day}`;
        return `${dayStr} ${matchedMonth} ${year}`;
      }
    }
  }
  
  // 2. Check formats like "21/04/2014" or "2014-04-21"
  const dmyRegex = /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/;
  const ymdRegex = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/;
  
  let day: number | null = null;
  let monthIndex: number | null = null;
  let year: number | null = null;
  
  if (dmyRegex.test(cleanStr)) {
    const match = cleanStr.match(dmyRegex)!;
    day = parseInt(match[1], 10);
    monthIndex = parseInt(match[2], 10) - 1;
    year = parseInt(match[3], 10);
  } else if (ymdRegex.test(cleanStr)) {
    const match = cleanStr.match(ymdRegex)!;
    day = parseInt(match[3], 10);
    monthIndex = parseInt(match[2], 10) - 1;
    year = parseInt(match[1], 10);
  }
  
  if (day !== null && monthIndex !== null && year !== null && monthIndex >= 0 && monthIndex < 12) {
    const indonesianMonths = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    return `${dayStr} ${indonesianMonths[monthIndex]} ${year}`;
  }
  
  // 3. Fallback to normal JS Date parsing
  const parsedDate = new Date(cleanStr);
  if (!isNaN(parsedDate.getTime())) {
    const dayVal = parsedDate.getDate();
    const monthVal = parsedDate.getMonth();
    const yearVal = parsedDate.getFullYear();
    
    const indonesianMonths = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    const dayStr = dayVal < 10 ? `0${dayVal}` : `${dayVal}`;
    return `${dayStr} ${indonesianMonths[monthVal]} ${yearVal}`;
  }
  
  return cleanStr;
};

const formatDateForInput = (dateStr: string): string => {
  if (!dateStr || dateStr === '-') return '';
  const cleanStr = dateStr.trim();
  
  // 1. Try split-by-space
  const parts = cleanStr.split(/\s+/);
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const monthName = parts[1].toLowerCase();
    const year = parseInt(parts[2], 10);
    
    if (!isNaN(day) && !isNaN(year) && year > 1900 && year < 2100) {
      const indonesianMonthsMap: Record<string, number> = {
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
      
      const monthIndex = indonesianMonthsMap[monthName];
      if (monthIndex !== undefined) {
        const dayStr = day < 10 ? `0${day}` : `${day}`;
        const monthStr = (monthIndex + 1) < 10 ? `0${monthIndex + 1}` : `${monthIndex + 1}`;
        return `${year}-${monthStr}-${dayStr}`;
      }
    }
  }
  
  // 2. Check formats like "21/04/2014" or "2014-04-21"
  const dmyRegex = /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/;
  const ymdRegex = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/;
  
  if (dmyRegex.test(cleanStr)) {
    const match = cleanStr.match(dmyRegex)!;
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const monthStr = month < 10 ? `0${month}` : `${month}`;
    return `${year}-${monthStr}-${dayStr}`;
  } else if (ymdRegex.test(cleanStr)) {
    const match = cleanStr.match(ymdRegex)!;
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const day = parseInt(match[3], 10);
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const monthStr = month < 10 ? `0${month}` : `${month}`;
    return `${year}-${monthStr}-${dayStr}`;
  }
  
  // 3. Fallback to parsing as Date
  const parsedDate = new Date(cleanStr);
  if (!isNaN(parsedDate.getTime())) {
    const year = parsedDate.getFullYear();
    const month = parsedDate.getMonth() + 1;
    const day = parsedDate.getDate();
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const monthStr = month < 10 ? `0${month}` : `${month}`;
    return `${year}-${monthStr}-${dayStr}`;
  }
  
  return '';
};

const compressImage = (file: File, maxWidth: number = 400, maxHeight: number = 400, quality: number = 0.7): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Gagal memproses canvas gambar'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

interface SatwaManagerProps {
  data: SheetData;
  config: SheetConfig;
  onRefresh: () => void;
}

export const SatwaManager: React.FC<SatwaManagerProps> = ({ data, config, onRefresh }) => {
  const { headers, rows } = data;

  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSatwa, setExpandedSatwa] = useState<Record<string, boolean>>({});

  // Modal forms
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'update'>('create');
  const [selectedRow, setSelectedRow] = useState<Record<string, any> | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Drag and drop state for image uploader
  const [isDragging, setIsDragging] = useState(false);
  
  // Delete confirmation
  const [deleteConfirmRow, setDeleteConfirmRow] = useState<Record<string, any> | null>(null);


  const primaryIdKey = headers[0] || 'Nama Satwa';

  const toggleExpand = (name: string) => {
    setExpandedSatwa(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  // Filter out placeholder blank rows & search queries
  const filteredRows = useMemoRows();
  function useMemoRows() {
    return React.useMemo(() => {
      let results = [...rows];
      
      // Filter out blank rows
      results = results.filter(row => {
        const nameVal = String(row[primaryIdKey] || '').trim();
        return nameVal !== '' && nameVal !== '-';
      });

      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        results = results.filter(row => {
          return Object.entries(row).some(([k, v]) => {
            if (k === '__rowNum__') return false;
            return String(v).toLowerCase().includes(query);
          });
        });
      }

      return results;
    }, [rows, searchTerm]);
  }

  const openCreateModal = () => {
    setModalType('create');
    setSelectedRow(null);
    setErrorMsg('');
    
    const initialForm: Record<string, any> = {};
    headers.forEach(h => {
      initialForm[h] = '';
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
      setErrorMsg(`Kolom Nama Satwa wajib diisi!`);
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
      setErrorMsg(err.message || 'Gagal menyimpan perubahan.');
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
      alert(err.message || 'Gagal menghapus satwa.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <h1 className="page-title">Manajemen Satwa</h1>
          <p className="page-subtitle">Daftar satwa laut beserta spesifikasi morfometrik dan profil kedatangan.</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={openCreateModal}>
          <Plus size={16} />
          <span>Tambah Satwa</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="card data-controls" style={{ borderRadius: 'var(--radius-lg)', marginBottom: 20 }}>
        <div className="search-wrapper">
          <Search size={18} />
          <input
            type="text"
            className="input"
            placeholder="Cari satwa (nama, species, dll)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          Terdaftar <strong>{filteredRows.length}</strong> satwa
        </div>
      </div>

      {/* Satwa Gallery Grid */}
      {filteredRows.length === 0 ? (
        <div className="card empty-state">
          <Info size={40} className="c-primary" style={{ marginBottom: 12 }} />
          <h3>Tidak Ada Data Satwa</h3>
          <p>Belum ada profil satwa yang cocok dengan pencarian Anda.</p>
        </div>
      ) : (
        <div className="satwa-grid">
          {filteredRows.map((row, idx) => {
            const name = String(row[primaryIdKey]);
            const image = String(row['Gambar']).trim();
            const species = String(row['Species']).trim();
            const gender = String(row['Jenis Kelamin']).trim();
            const tsi = formatDateIndonesian(String(row['Kedatangan TSI']).trim());
            const sbj = formatDateIndonesian(String(row['Kedatangan SBJ']).trim());

            const isExpanded = !!expandedSatwa[name];
            const hasImage = image !== '' && image !== '-' && image !== 'null';

            return (
              <div className="satwa-card" key={idx}>
                {/* Image Section */}
                <div className="satwa-img-wrapper">
                  {hasImage ? (
                    <img 
                      src={image} 
                      alt={name} 
                      className="satwa-img"
                      onError={(e) => {
                        // fallback if image fails to load
                        (e.target as HTMLImageElement).style.display = 'none';
                        const parent = (e.target as HTMLElement).parentElement;
                        if (parent) {
                          const fallback = parent.querySelector('.fallback-container');
                          if (fallback) fallback.classList.remove('d-none');
                        }
                      }}
                    />
                  ) : null}
                  
                  {/* Fallback avatar */}
                  <div className={`satwa-img-fallback fallback-container ${hasImage ? 'd-none' : ''}`} style={{ display: hasImage ? 'none' : 'flex' }}>
                    {name.slice(0, 2).toUpperCase()}
                  </div>
                </div>

                {/* Body details */}
                <div className="satwa-body">
                  <div className="satwa-title-row">
                    <h3 className="satwa-name">{name}</h3>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-secondary btn-sm btn-icon-only" onClick={() => openEditModal(row)}>
                        <Edit2 size={12} className="c-primary" />
                      </button>
                      <button className="btn btn-secondary btn-sm btn-icon-only" onClick={() => setDeleteConfirmRow(row)}>
                        <Trash2 size={12} className="c-danger" />
                      </button>
                    </div>
                  </div>

                  <div className="satwa-meta-row">
                    <span className="satwa-tag" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Tag size={10} />
                      {species === '-' || species === '' ? 'Spesies: -' : species}
                    </span>
                    <span className="satwa-tag" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <User size={10} />
                      {gender === '-' || gender === '' ? 'Gender: -' : gender}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 14 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Calendar size={12} className="c-primary" />
                      Kedatangan SBJ: <strong>{sbj === '-' || !sbj ? '-' : sbj}</strong>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Calendar size={12} className="c-primary" />
                      Kedatangan TSI: <strong>{tsi === '-' || !tsi ? '-' : tsi}</strong>
                    </span>
                  </div>

                  {/* Morphometrics Spec Sheet Toggle */}
                  <button 
                    className="btn satwa-expand-btn btn-sm" 
                    onClick={() => toggleExpand(name)}
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6 }}
                  >
                    <Ruler size={13} />
                    <span>{isExpanded ? 'Sembunyikan Morfometri' : 'Lihat Morfometri'}</span>
                    {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>

                  {/* Collapsible Morphometrics specs */}
                  {isExpanded && (
                    <div className="spec-grid" style={{ animation: 'fadeIn 0.2s' }}>
                      <div className="spec-item">
                        <div className="spec-label">Ekor (P / L)</div>
                        <div className="spec-value">
                          {row['Ekor (P) (cm)'] !== '-' && row['Ekor (P) (cm)'] ? `${row['Ekor (P) (cm)']} x ${row['Ekor (L) (cm)']} cm` : <span className="badge-empty">Belum Dicatat</span>}
                        </div>
                      </div>
                      <div className="spec-item">
                        <div className="spec-label">Flipper (P / L)</div>
                        <div className="spec-value">
                          {row['Flipper (P) (cm)'] !== '-' && row['Flipper (P) (cm)'] ? `${row['Flipper (P) (cm)']} x ${row['Flipper (L) (cm)']} cm` : <span className="badge-empty">Belum Dicatat</span>}
                        </div>
                      </div>
                      <div className="spec-item">
                        <div className="spec-label">Dorsal (L / T)</div>
                        <div className="spec-value">
                          {row['Dorsal (L) (cm)'] !== '-' && row['Dorsal (L) (cm)'] ? `${row['Dorsal (L) (cm)']} x ${row['Dorsal (T) (cm)']} cm` : <span className="badge-empty">Belum Dicatat</span>}
                        </div>
                      </div>
                      <div className="spec-item">
                        <div className="spec-label">Panjang Tubuh</div>
                        <div className="spec-value">{row['P. Tubuh (cm)'] && row['P. Tubuh (cm)'] !== '-' ? `${row['P. Tubuh (cm)']} cm` : <span className="badge-empty">Belum Dicatat</span>}</div>
                      </div>
                      <div className="spec-item">
                        <div className="spec-label">P. Moncong</div>
                        <div className="spec-value">{row['P. Moncong (cm)'] && row['P. Moncong (cm)'] !== '-' ? `${row['P. Moncong (cm)']} cm` : <span className="badge-empty">Belum Dicatat</span>}</div>
                      </div>
                      <div className="spec-item">
                        <div className="spec-label">Lingkar Badan</div>
                        <div className="spec-value">{row['Ling. Badan (cm)'] && row['Ling. Badan (cm)'] !== '-' ? `${row['Ling. Badan (cm)']} cm` : <span className="badge-empty">Belum Dicatat</span>}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CRUD Form Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="card-title" style={{ margin: 0 }}>
                {modalType === 'create' ? 'Tambah Profil Satwa Baru' : 'Ubah Profil Satwa'}
              </h3>
              <button className="btn btn-secondary btn-sm btn-icon-only" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {errorMsg && (
                  <div className="card" style={{ background: 'var(--danger-glow)', borderColor: 'var(--danger)', padding: 12, marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
                    <ShieldAlert size={18} className="c-danger" />
                    <span className="c-danger" style={{ fontSize: '0.85rem' }}>{errorMsg}</span>
                  </div>
                )}
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {headers.map((header, idx) => {
                    const h = header.toUpperCase();
                    const isId     = idx === 0; // 'Nama Satwa'
                    const isGender = h.includes('GENDER') || h.includes('KELAMIN');
                    const isDate   = h.includes('KEDATANGAN') || h.includes('DATE') || h.includes('TANGGAL');
                    const isNumber = h.includes('(CM)');
                    const isImage  = h.includes('GAMBAR') || h.includes('IMAGE') || h.includes('FOTO');

                    if (isId) return (
                      <div key={header}>
                        <label className="stat-label" style={{ marginBottom: 6, display: 'block' }}>
                          {header} <span style={{ color: 'var(--text-muted)' }}>(Kunci Utama)</span>
                        </label>
                        <input
                          type="text"
                          className="input"
                          required
                          placeholder="Contoh: SAKA"
                          disabled={modalType === 'update'}
                          value={formData[header] || ''}
                          onChange={e => setFormData({ ...formData, [header]: e.target.value.toUpperCase() })}
                        />
                      </div>
                    );

                    if (isGender) return (
                      <div key={header}>
                        <label className="stat-label" style={{ marginBottom: 6, display: 'block' }}>{header}</label>
                        <select className="input" value={formData[header] || 'Jantan'}
                          onChange={e => setFormData({ ...formData, [header]: e.target.value })}>
                          <option value="Jantan">♂ Jantan</option>
                          <option value="Betina">♀ Betina</option>
                          <option value="-">— Tidak Diketahui</option>
                        </select>
                      </div>
                    );

                    if (isDate) return (
                      <div key={header}>
                        <label className="stat-label" style={{ marginBottom: 6, display: 'block' }}>{header}</label>
                        <input
                          type="date"
                          className="input"
                          value={formatDateForInput(formData[header] || '')}
                          onChange={e => setFormData({ ...formData, [header]: e.target.value })}
                        />
                      </div>
                    );

                    if (isNumber) return (
                      <div key={header}>
                        <label className="stat-label" style={{ marginBottom: 6, display: 'block' }}>{header}</label>
                        <input
                          type="number"
                          className="input"
                          step="0.1"
                          min="0"
                          placeholder="cm"
                          value={formData[header] === '-' ? '' : (formData[header] || '')}
                          onChange={e => setFormData({ ...formData, [header]: e.target.value || '-' })}
                        />
                      </div>
                    );

                    if (isImage) {
                      const imageVal = formData[header] || '';
                      const hasUploadedImage = imageVal !== '' && imageVal !== '-' && imageVal !== 'null';

                      const handleFileChange = async (file: File) => {
                        if (!file.type.startsWith('image/')) {
                          alert('File yang diunggah harus berupa gambar!');
                          return;
                        }
                        setIsSubmitting(true);
                        try {
                          const base64Data = await compressImage(file);
                          setFormData(prev => ({ ...prev, [header]: base64Data }));
                        } catch (err) {
                          alert('Gagal memproses gambar. Coba file gambar lain.');
                          console.error(err);
                        } finally {
                          setIsSubmitting(false);
                        }
                      };

                      return (
                        <div key={header} className="image-upload-container">
                          <label className="stat-label" style={{ marginBottom: 6, display: 'block' }}>
                            {header}
                          </label>

                          {hasUploadedImage ? (
                            <div className="image-upload-preview-wrapper animate-fade-in">
                              <img
                                src={imageVal}
                                alt="Pratinjau Satwa"
                                className="image-upload-preview"
                              />
                              <div className="image-upload-preview-overlay">
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm"
                                  onClick={() => setFormData({ ...formData, [header]: '-' })}
                                >
                                  Hapus Gambar
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div
                              className={`image-upload-dropzone ${isDragging ? 'dragging' : ''}`}
                              onDragOver={(e) => {
                                e.preventDefault();
                                setIsDragging(true);
                              }}
                              onDragLeave={() => setIsDragging(false)}
                              onDrop={(e) => {
                                e.preventDefault();
                                setIsDragging(false);
                                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                  handleFileChange(e.dataTransfer.files[0]);
                                }
                              }}
                              onClick={() => {
                                const fileInput = document.getElementById('satwa-file-input');
                                if (fileInput) fileInput.click();
                              }}
                            >
                              <Upload size={24} />
                              <span className="image-upload-text">
                                Tarik & Lepas atau <strong>Klik untuk Upload Gambar</strong>
                              </span>
                              <span className="image-upload-hint">
                                Gambar otomatis diperkecil agar pas dan cepat dimuat
                              </span>
                              <input
                                id="satwa-file-input"
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleFileChange(e.target.files[0]);
                                  }
                                }}
                              />
                            </div>
                          )}
                        </div>
                      );
                    }

                    return (
                      <div key={header}>
                        <label className="stat-label" style={{ marginBottom: 6, display: 'block' }}>{header}</label>
                        <input
                          type="text"
                          className="input"
                          value={formData[header] || ''}
                          onChange={e => setFormData({ ...formData, [header]: e.target.value })}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmRow && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3 className="card-title c-danger" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Trash2 size={20} />
                Konfirmasi Hapus
              </h3>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-primary)' }}>
                Apakah Anda yakin ingin menghapus profil satwa <strong>{String(deleteConfirmRow[primaryIdKey])}</strong>?
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 8 }}>
                Semua rekaman morfometri untuk satwa ini akan hilang dari tampilan.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirmRow(null)}>
                Batal
              </button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirmRow)}>
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
