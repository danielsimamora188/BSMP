import { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { fetchSheetData, getConfig } from './utils/sheetSync';
import type { SheetConfig, SheetData } from './utils/sheetSync';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './components/Dashboard';
import { SatwaManager } from './components/SatwaManager';
import { DataManager } from './components/DataManager';
import { Login } from './components/Login';
import { AdminDashboard } from './components/AdminDashboard';
import { exportAllToExcel } from './utils/excelExport';
import { Database, RefreshCw, AlertTriangle, Sun, Moon, Download, LogOut } from 'lucide-react';

function App() {
  const [config, setConfig] = useState<SheetConfig>(getConfig());
  const [sheetData, setSheetData] = useState<SheetData>({ headers: [], rows: [] });
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [connectionStatus, setConnectionStatus] = useState<{ status: 'success' | 'error' | 'idle'; message: string }>({
    status: 'idle',
    message: ''
  });

  // User state for login system
  const [currentUser, setCurrentUser] = useState<{ username: string; name: string; role: 'admin' | 'user' } | null>(() => {
    const saved = localStorage.getItem('bsmp_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return null;
  });

  // Manage Theme (Dark / Light)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('bsmp_theme') as 'light' | 'dark') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('bsmp_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleExport = () => {
    exportAllToExcel();
  };

  // Fetch sheet data from chosen source
  const loadData = async (activeConfig: SheetConfig) => {
    // If Admin is looking at dashboard, we don't load sheetData for standard sheets
    if (currentTab === 'dashboard' && currentUser?.role === 'admin') {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const result = await fetchSheetData(activeConfig);
      setSheetData(result);
      setConnectionStatus({
        status: 'success',
        message: 'Data berhasil dimuat.'
      });
    } catch (e: any) {
      console.error(e);
      setConnectionStatus({
        status: 'error',
        message: e.message || 'Koneksi gagal. Periksa kembali jaringan Anda.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Synchronize active sheet database load when current tab changes
  useEffect(() => {
    if (!currentUser) return;

    // Admin tabs (dashboard, admin-logs, admin-users) don't load sheet data
    const isAdminTab = currentTab === 'dashboard' || currentTab.startsWith('admin-');
    if (currentUser.role === 'admin' || isAdminTab) {
      setIsLoading(false);
      return;
    }

    if (currentTab !== 'dashboard') {
      const newConfig = { ...config, activeSheet: currentTab };
      setConfig(newConfig);
      loadData(newConfig);
    } else {
      loadData(config);
    }
  }, [currentTab, currentUser]);

  const handleRefresh = () => {
    loadData(config);
  };

  const handleLoginSuccess = (user: { username: string; name: string; role: 'admin' | 'user' }) => {
    setCurrentUser(user);
    localStorage.setItem('bsmp_current_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('bsmp_current_user');
    setCurrentTab('dashboard');
  };

  // If not logged in, render the login form
  if (!currentUser) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
        <Login config={config} onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  const isOnline = config.mode === 'demo' || connectionStatus.status === 'success';

  return (
    <div className="app-container animate-fade-in">
      {/* Top Android Header */}
      <header className="app-header">
        <div className="logo-section">
          <div className="logo-icon">
            <Database size={18} />
          </div>
          <span className="logo-title">BSMP</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {currentUser.role !== 'admin' && (
            <button 
              className="btn btn-secondary btn-sm btn-icon-only" 
              onClick={handleExport}
              title="Ekspor Excel"
            >
              <Download size={14} />
            </button>
          )}
          <button 
            className="btn btn-secondary btn-sm btn-icon-only" 
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          {(currentUser.role !== 'admin' && currentTab !== 'dashboard') ? (
            <button 
              className="btn btn-secondary btn-sm btn-icon-only" 
              onClick={handleRefresh}
              disabled={isLoading}
              title="Sinkronisasi"
            >
              <RefreshCw size={14} className={isLoading ? 'spin-anim' : ''} style={{ animation: isLoading ? 'spin 1s linear infinite' : 'none' }} />
            </button>
          ) : null}
          <button 
            className="btn btn-secondary btn-sm btn-icon-only" 
            onClick={handleLogout}
            title="Keluar"
            style={{ color: 'var(--danger)' }}
          >
            <LogOut size={14} />
          </button>
        </div>
      </header>

      {/* Navigation (Desktop Sidebar & Mobile Scrollable Bottom Tabs) */}
      <BottomNav 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        isOnline={isOnline} 
        theme={theme}
        toggleTheme={toggleTheme}
        onExport={handleExport}
        onLogout={handleLogout}
        userRole={currentUser.role}
      />

      {/* Primary Page Content */}
      <main className="page-content">
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: 16 }}>
            <div className="spinner"></div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Sinkronisasi data...</p>
          </div>
        ) : (
          <>
            {connectionStatus.status === 'error' && currentTab !== 'dashboard' && (
              <div 
                className="card" 
                style={{ 
                   background: 'var(--danger-container)', 
                   borderColor: 'var(--danger)', 
                   marginBottom: 16, 
                   display: 'flex', 
                   alignItems: 'center', 
                   gap: 10,
                   padding: '10px 14px' 
                }}
              >
                <AlertTriangle size={18} className="c-danger" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '0.78rem', color: 'var(--danger)' }}>
                  Gagal menghubungkan ke lembar kerja. Menggunakan cache lokal sementara.
                </span>
              </div>
            )}

            {currentTab === 'dashboard' && (
              currentUser.role === 'admin' ? (
                <AdminDashboard config={config} initialSubTab="analytics" />
              ) : (
                <Dashboard data={sheetData} preset={config.activeSheet} theme={theme} />
              )
            )}

            {currentTab === 'admin-logs' && currentUser.role === 'admin' && (
              <AdminDashboard config={config} initialSubTab="logs" />
            )}

            {currentTab === 'admin-users' && currentUser.role === 'admin' && (
              <AdminDashboard config={config} initialSubTab="users" />
            )}

            {currentTab === 'Satwa' && (
              <SatwaManager data={sheetData} config={config} onRefresh={handleRefresh} />
            )}

            {currentTab !== 'dashboard' && currentTab !== 'Satwa' && !currentTab.startsWith('admin-') && (
              <DataManager data={sheetData} config={config} onRefresh={handleRefresh} />
            )}
          </>
        )}
      </main>
      <Analytics />
    </div>
  );
}

export default App;
