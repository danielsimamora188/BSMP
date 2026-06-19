import React, { useState, useEffect, useMemo } from 'react';
import { executeWriteAction, fetchSheetData } from '../utils/sheetSync';
import type { SheetConfig } from '../utils/sheetSync';
import { 
  Users, History, Plus, Edit2, Trash2, Search, 
  RefreshCw, ShieldAlert, X, Info, ShieldCheck,
  BarChart2, TrendingUp, Calendar as CalendarIcon
} from 'lucide-react';

interface AdminDashboardProps {
  config: SheetConfig;
  initialSubTab?: 'analytics' | 'logs' | 'users';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ config, initialSubTab = 'analytics' }) => {
  const [activeSubTab, setActiveSubTab] = useState<'analytics' | 'logs' | 'users'>(initialSubTab);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Data lists
  const [logsList, setLogsList] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);

  // Search terms
  const [searchLogsTerm, setSearchLogsTerm] = useState('');
  const [searchUsersTerm, setSearchUsersTerm] = useState('');

  // User CRUD Modal States
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'update'>('create');
  const [userFormData, setUserFormData] = useState<Record<string, any>>({
    Username: '',
    Password: '',
    'Nama Lengkap': '',
    Role: 'user'
  });
  const [userModalError, setUserModalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmRow, setDeleteConfirmRow] = useState<Record<string, any> | null>(null);

  // Load logs & users
  const loadData = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      // 1. Fetch Logs sheet data
      const logsResult = await fetchSheetData({ ...config, activeSheet: 'Logs' });
      // Sort logs descending (latest first)
      if (logsResult && logsResult.rows) {
        const sorted = [...logsResult.rows].sort((a, b) => {
          return String(b['Tanggal & Waktu'] || '').localeCompare(String(a['Tanggal & Waktu'] || ''));
        });
        setLogsList(sorted);
      }

      // 2. Fetch Users sheet data
      const usersResult = await fetchSheetData({ ...config, activeSheet: 'Users' });
      if (usersResult && usersResult.rows) {
        setUsersList(usersResult.rows);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyelaraskan data admin.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [config]);

  // Sync to initialSubTab when it changes (navbar navigation)
  useEffect(() => {
    setActiveSubTab(initialSubTab);
  }, [initialSubTab]);

  // --- ANALYTICS CALCULATIONS ---
  const kpiStats = useMemo(() => {
    const totalLogs = logsList.length;
    const totalUsers = usersList.length;

    // Find most active user
    const counts: Record<string, number> = {};
    logsList.forEach(log => {
      const u = log['Pengguna'] || 'Unknown';
      counts[u] = (counts[u] || 0) + 1;
    });

    let maxUser = '-';
    let maxCount = 0;
    Object.entries(counts).forEach(([user, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxUser = user;
      }
    });

    const userCountsSorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1]);

    const latestLogTime = logsList.length > 0 ? (logsList[0]['Tanggal & Waktu'] || '-') : '-';

    // Calculate action distribution
    let createCount = 0;
    let updateCount = 0;
    let deleteCount = 0;

    logsList.forEach(log => {
      const act = String(log['Aktivitas'] || '').toUpperCase();
      if (act.includes('CREATE') || act.includes('MENAMBAHKAN') || act.includes('TAMBAH')) {
        createCount++;
      } else if (act.includes('UPDATE') || act.includes('MENGUBAH') || act.includes('EDIT')) {
        updateCount++;
      } else if (act.includes('DELETE') || act.includes('MENGHAPUS') || act.includes('HAPUS')) {
        deleteCount++;
      }
    });

    const actionTotal = createCount + updateCount + deleteCount || 1;

    return {
      totalLogs,
      totalUsers,
      mostActiveUser: maxUser === '-' ? '-' : `${maxUser} (${maxCount} aksi)`,
      latestLogTime,
      userCounts: userCountsSorted,
      actions: {
        create: createCount,
        update: updateCount,
        delete: deleteCount,
        total: actionTotal
      }
    };
  }, [logsList, usersList]);

  // Filter logs based on search
  const filteredLogs = useMemo(() => {
    let result = [...logsList];
    if (searchLogsTerm) {
      const q = searchLogsTerm.toLowerCase();
      result = result.filter(log => {
        return (
          String(log['Pengguna'] || '').toLowerCase().includes(q) ||
          String(log['Aktivitas'] || '').toLowerCase().includes(q) ||
          String(log['Detail'] || '').toLowerCase().includes(q)
        );
      });
    }
    return result;
  }, [logsList, searchLogsTerm]);

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    let result = [...usersList];
    if (searchUsersTerm) {
      const q = searchUsersTerm.toLowerCase();
      result = result.filter(user => {
        return (
          String(user['Username'] || '').toLowerCase().includes(q) ||
          String(user['Nama Lengkap'] || '').toLowerCase().includes(q)
        );
      });
    }
    return result;
  }, [usersList, searchUsersTerm]);

  // User CRUD action handlers
  const openCreateUserModal = () => {
    setModalType('create');
    setUserModalError('');
    setUserFormData({
      Username: '',
      Password: '',
      'Nama Lengkap': '',
      Role: 'user'
    });
    setIsUserModalOpen(true);
  };

  const openEditUserModal = (row: Record<string, any>) => {
    setModalType('update');
    setUserModalError('');
    setUserFormData({ ...row });
    setIsUserModalOpen(true);
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserModalError('');

    const usernameVal = String(userFormData['Username'] || '').trim().toLowerCase();
    if (!usernameVal) {
      setUserModalError('Username wajib diisi!');
      return;
    }
    if (!userFormData['Password'] || String(userFormData['Password']).trim() === '') {
      setUserModalError('Password wajib diisi!');
      return;
    }

    // Protect overriding admin account username
    if (modalType === 'create' && usernameVal === 'admin') {
      setUserModalError('Username "admin" sudah digunakan untuk akun utama!');
      return;
    }

    setIsSubmitting(true);
    try {
      const rowToSave = {
        Username: usernameVal,
        Password: String(userFormData['Password']).trim(),
        'Nama Lengkap': String(userFormData['Nama Lengkap'] || '').trim(),
        Role: String(userFormData['Role'] || 'user').trim()
      };

      const success = await executeWriteAction(
        { ...config, activeSheet: 'Users' },
        modalType === 'create' ? 'create' : 'update',
        rowToSave,
        usernameVal
      );

      if (success) {
        setIsUserModalOpen(false);
        loadData();
      }
    } catch (err: any) {
      setUserModalError(err.message || 'Gagal menyimpan akun user.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUserDelete = async (row: Record<string, any>) => {
    const userVal = String(row['Username'] || '').trim().toLowerCase();
    if (userVal === 'admin') {
      alert('Akun administrator utama tidak bisa dihapus!');
      return;
    }

    try {
      const success = await executeWriteAction(
        { ...config, activeSheet: 'Users' },
        'delete',
        {},
        userVal
      );
      if (success) {
        setDeleteConfirmRow(null);
        loadData();
      }
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus user.');
    }
  };

  return (
    <div className="admin-dashboard-container animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <div>
          <h1 className="page-title">
            {initialSubTab === 'analytics' && 'Grafik Ringkasan'}
            {initialSubTab === 'logs' && 'Log Aktivitas Petugas'}
            {initialSubTab === 'users' && 'Manajemen Pengguna'}
          </h1>
          <p className="page-subtitle">
            {initialSubTab === 'analytics' && 'Statistik dan distribusi aktivitas CRUD seluruh petugas lapangan.'}
            {initialSubTab === 'logs' && 'Riwayat lengkap seluruh aktivitas CRUD yang dilakukan petugas.'}
            {initialSubTab === 'users' && 'Kelola akun petugas lapangan — tambah, ubah, atau hapus akun.'}
          </p>
        </div>
        <button 
          className="btn btn-secondary btn-sm" 
          onClick={loadData} 
          disabled={isLoading}
          style={{ display: 'flex', gap: 6, alignItems: 'center' }}
        >
          <RefreshCw size={14} className={isLoading ? 'spin-anim' : ''} />
          <span>Segarkan</span>
        </button>
      </div>

      {errorMsg && (
        <div className="card" style={{ background: 'var(--danger-container)', borderColor: 'var(--danger)', display: 'flex', gap: 10, alignItems: 'center', padding: 14 }}>
          <ShieldAlert size={18} className="c-danger" />
          <span style={{ fontSize: '0.8rem', color: 'var(--danger)' }}>{errorMsg}</span>
        </div>
      )}

      {/* Navigation tabs — only shown when on the analytics tab (the other tabs are reached via navbar) */}
      {initialSubTab === 'analytics' && (
        <div className="admin-tabs">
          <button 
            className={`admin-tab-btn ${activeSubTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('analytics')}
          >
            <BarChart2 size={16} />
            <span>Grafik Ringkasan</span>
          </button>
          <button 
            className={`admin-tab-btn ${activeSubTab === 'logs' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('logs')}
          >
            <History size={16} />
            <span>Log Aktivitas User</span>
          </button>
          <button 
            className={`admin-tab-btn ${activeSubTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('users')}
          >
            <Users size={16} />
            <span>Manajemen Pengguna (CRUD)</span>
          </button>
        </div>
      )}

      {/* Content Area */}
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 0', gap: 12 }}>
          <div className="spinner"></div>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Memproses data dasbor...</span>
        </div>
      ) : activeSubTab === 'analytics' ? (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* KPI Dashboard Cards */}
          <div className="admin-stats-grid">
            <div className="admin-kpi-card">
              <div className="admin-kpi-icon" style={{ background: 'var(--primary-container)', color: 'var(--primary)' }}>
                <History size={20} />
              </div>
              <div className="admin-kpi-info">
                <span className="admin-kpi-label">Total Aktivitas CRUD</span>
                <span className="admin-kpi-value">{kpiStats.totalLogs}</span>
              </div>
            </div>

            <div className="admin-kpi-card">
              <div className="admin-kpi-icon" style={{ background: 'var(--success-container)', color: 'var(--success)' }}>
                <Users size={20} />
              </div>
              <div className="admin-kpi-info">
                <span className="admin-kpi-label">User Petugas Terdaftar</span>
                <span className="admin-kpi-value">{kpiStats.totalUsers}</span>
              </div>
            </div>

            <div className="admin-kpi-card">
              <div className="admin-kpi-icon" style={{ background: 'rgba(242, 197, 92, 0.1)', color: 'var(--warning)' }}>
                <TrendingUp size={20} />
              </div>
              <div className="admin-kpi-info">
                <span className="admin-kpi-label">Pengguna Teraktif</span>
                <span className="admin-kpi-value" style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                  {kpiStats.mostActiveUser}
                </span>
              </div>
            </div>

            <div className="admin-kpi-card">
              <div className="admin-kpi-icon" style={{ background: 'var(--bg-surface-variant)', color: 'var(--text-secondary)' }}>
                <CalendarIcon size={20} />
              </div>
              <div className="admin-kpi-info">
                <span className="admin-kpi-label">Waktu Log Terakhir</span>
                <span className="admin-kpi-value" style={{ fontSize: '0.78rem', fontWeight: 700, fontFamily: 'monospace' }}>
                  {kpiStats.latestLogTime}
                </span>
              </div>
            </div>
          </div>

          {/* Graphical Distributions Grid */}
          <div className="admin-charts-grid">
            {/* User Activity Distribution */}
            <div className="admin-chart-card">
              <h3 className="admin-chart-title">
                <Users size={16} />
                <span>Kontribusi Aktivitas Petugas</span>
              </h3>
              <div className="chart-container">
                {kpiStats.userCounts.length === 0 ? (
                  <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    Belum ada rekaman aktivitas petugas.
                  </div>
                ) : (
                  kpiStats.userCounts.slice(0, 5).map(([user, count]) => {
                    const percentage = Math.round((count / (kpiStats.totalLogs || 1)) * 100);
                    return (
                      <div className="chart-row" key={user}>
                        <div className="chart-label-row">
                          <span className="chart-label-name">{user}</span>
                          <span className="chart-label-value">{count} aksi ({percentage}%)</span>
                        </div>
                        <div className="chart-bar-bg">
                          <div 
                            className="chart-bar-fill primary" 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* CRUD Operations Distribution */}
            <div className="admin-chart-card">
              <h3 className="admin-chart-title">
                <BarChart2 size={16} />
                <span>Pembagian Kategori CRUD</span>
              </h3>
              <div className="chart-container">
                {[
                  { name: 'CREATE (Tambah Data)', count: kpiStats.actions.create, color: 'success' },
                  { name: 'UPDATE (Ubah Data)', count: kpiStats.actions.update, color: 'warning' },
                  { name: 'DELETE (Hapus Data)', count: kpiStats.actions.delete, color: 'danger' }
                ].map(item => {
                  const percentage = Math.round((item.count / (kpiStats.actions.total || 1)) * 100);
                  return (
                    <div className="chart-row" key={item.name}>
                      <div className="chart-label-row">
                        <span className="chart-label-name">{item.name}</span>
                        <span className="chart-label-value">{item.count} aksi ({percentage}%)</span>
                      </div>
                      <div className="chart-bar-bg">
                        <div 
                          className={`chart-bar-fill ${item.color}`} 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : activeSubTab === 'logs' ? (
        <div>
          {/* Logs Search */}
          <div className="card data-controls" style={{ borderRadius: 'var(--radius-lg)', marginBottom: 16 }}>
            <div className="search-wrapper">
              <Search size={18} />
              <input
                type="text"
                className="input"
                placeholder="Cari log (pengguna, aktivitas, detail)..."
                value={searchLogsTerm}
                onChange={e => setSearchLogsTerm(e.target.value)}
              />
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Total: <strong>{filteredLogs.length}</strong> entri log tercatat
            </div>
          </div>

          {/* Logs List */}
          {filteredLogs.length === 0 ? (
            <div className="card empty-state">
              <Info size={36} className="c-primary" style={{ marginBottom: 12 }} />
              <h3>Belum Ada Log</h3>
              <p>Tidak ditemukan log aktivitas CRUD yang sesuai.</p>
            </div>
          ) : (
            <div className="list-container">
              {filteredLogs.map((log, idx) => (
                <div className="list-row" key={log['ID_Log'] || idx}>
                  <div className="list-row-left" style={{ alignItems: 'center' }}>
                    <div className="list-avatar" style={{ background: 'var(--bg-surface-variant)', width: 36, height: 36, borderRadius: 10 }}>
                      <History size={15} style={{ color: 'var(--text-secondary)' }} />
                    </div>
                    <div className="list-row-body">
                      <span className="list-row-title" style={{ fontSize: '0.85rem' }}>
                        <span className="log-row-user">{log['Pengguna']}</span>
                        <span style={{ margin: '0 8px', color: 'var(--text-muted)' }}>•</span>
                        <span className="log-row-activity">{log['Aktivitas']}</span>
                      </span>
                      <span className="list-row-sub" style={{ marginTop: 2, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        {log['Detail']}
                      </span>
                    </div>
                  </div>
                  <div className="list-row-meta" style={{ justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                      {log['Tanggal & Waktu']}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          {/* Users List Controls */}
          <div className="card data-controls" style={{ borderRadius: 'var(--radius-lg)', marginBottom: 16 }}>
            <div className="search-wrapper">
              <Search size={18} />
              <input
                type="text"
                className="input"
                placeholder="Cari petugas..."
                value={searchUsersTerm}
                onChange={e => setSearchUsersTerm(e.target.value)}
              />
            </div>
            <button className="btn btn-primary btn-sm" onClick={openCreateUserModal}>
              <Plus size={16} />
              <span>Tambah User</span>
            </button>
          </div>

          {/* Users List */}
          {filteredUsers.length === 0 ? (
            <div className="card empty-state">
              <Users size={36} className="c-primary" style={{ marginBottom: 12 }} />
              <h3>Tidak Ada Pengguna</h3>
              <p>Belum ada akun pengguna petugas satwa terdaftar.</p>
            </div>
          ) : (
            <div className="list-container">
              {filteredUsers.map((user, idx) => {
                const username = String(user['Username'] || '').trim().toLowerCase();
                const isSystemAdmin = username === 'admin';
                return (
                  <div className="list-row" key={user['Username'] || idx}>
                    <div className="list-row-left" style={{ alignItems: 'center' }}>
                      <div className="list-avatar" style={{ background: isSystemAdmin ? 'var(--primary-container)' : 'rgba(255,255,255,0.04)', width: 38, height: 38, borderRadius: 12 }}>
                        {isSystemAdmin ? (
                          <ShieldCheck size={18} style={{ color: 'var(--primary)' }} />
                        ) : (
                          <Users size={16} style={{ color: 'var(--text-secondary)' }} />
                        )}
                      </div>
                      <div className="list-row-body">
                        <span className="list-row-title">
                          {user['Nama Lengkap'] || user['Username']}
                          {isSystemAdmin && (
                            <span className="badge badge-info" style={{ marginLeft: 8, fontSize: '0.62rem', padding: '1px 6px' }}>
                              SYSTEM ADMIN
                            </span>
                          )}
                        </span>
                        <span className="list-row-sub">
                          Username: <strong>{user['Username']}</strong> &nbsp;·&nbsp; Password: <span style={{ fontFamily: 'monospace' }}>{user['Password']}</span>
                        </span>
                      </div>
                    </div>
                    <div className="list-row-meta">
                      {!isSystemAdmin ? (
                        <div className="list-row-actions">
                          <button 
                            className="btn btn-secondary btn-icon-only list-btn" 
                            onClick={() => openEditUserModal(user)}
                            title="Ubah Detail User"
                          >
                            <Edit2 size={13} className="c-primary" />
                          </button>
                          <button 
                            className="btn btn-secondary btn-icon-only list-btn" 
                            onClick={() => setDeleteConfirmRow(user)}
                            title="Hapus Akun User"
                          >
                            <Trash2 size={13} className="c-danger" />
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Terkunci</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* User CRUD Modal */}
      {isUserModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="card-title" style={{ margin: 0 }}>
                {modalType === 'create' ? 'Tambah Pengguna Baru' : 'Ubah Pengguna'}
              </h3>
              <button className="btn btn-secondary btn-sm btn-icon-only" onClick={() => setIsUserModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleUserSubmit}>
              <div className="modal-body">
                {userModalError && (
                  <div className="card" style={{ background: 'var(--danger-container)', borderColor: 'var(--danger)', padding: 12, marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
                    <ShieldAlert size={18} className="c-danger" />
                    <span className="c-danger" style={{ fontSize: '0.85rem' }}>{userModalError}</span>
                  </div>
                )}
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label className="stat-label" style={{ marginBottom: 6, display: 'block' }}>Username</label>
                    <input
                      type="text"
                      className="input"
                      required
                      placeholder="Contoh: petugas2"
                      disabled={modalType === 'update'}
                      value={userFormData.Username || ''}
                      onChange={e => setUserFormData({ ...userFormData, Username: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="stat-label" style={{ marginBottom: 6, display: 'block' }}>Password</label>
                    <input
                      type="text"
                      className="input"
                      required
                      placeholder="Masukkan password baru"
                      value={userFormData.Password || ''}
                      onChange={e => setUserFormData({ ...userFormData, Password: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="stat-label" style={{ marginBottom: 6, display: 'block' }}>Nama Lengkap</label>
                    <input
                      type="text"
                      className="input"
                      required
                      placeholder="Contoh: Budi Santoso"
                      value={userFormData['Nama Lengkap'] || ''}
                      onChange={e => setUserFormData({ ...userFormData, 'Nama Lengkap': e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="stat-label" style={{ marginBottom: 6, display: 'block' }}>Role</label>
                    <select
                      className="input"
                      value={userFormData.Role || 'user'}
                      onChange={e => setUserFormData({ ...userFormData, Role: e.target.value })}
                    >
                      <option value="user">User Biasa (Petugas)</option>
                      <option value="admin">Administrator (Akses Penuh)</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsUserModalOpen(false)}
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

      {/* Delete User Confirmation */}
      {deleteConfirmRow && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3 className="card-title c-danger" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Trash2 size={20} />
                Hapus Akun
              </h3>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-primary)' }}>
                Apakah Anda yakin ingin menghapus akun pengguna <strong>{deleteConfirmRow['Nama Lengkap'] || deleteConfirmRow['Username']}</strong>?
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 8 }}>
                Sesi login pengguna ini akan hangus dan mereka tidak dapat masuk kembali.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirmRow(null)}>
                Batal
              </button>
              <button className="btn btn-danger" onClick={() => handleUserDelete(deleteConfirmRow)}>
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
