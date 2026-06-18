import { useState, useEffect } from 'react';
import { fetchSheetData, getConfig } from './utils/sheetSync';
import type { SheetConfig, SheetData } from './utils/sheetSync';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './components/Dashboard';
import { SatwaManager } from './components/SatwaManager';
import { DataManager } from './components/DataManager';
import { exportAllToExcel } from './utils/excelExport';
import { Database, RefreshCw, AlertTriangle, Sun, Moon, Download } from 'lucide-react';

function App() {
  const [config, setConfig] = useState<SheetConfig>(getConfig());
  const [sheetData, setSheetData] = useState<SheetData>({ headers: [], rows: [] });
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [connectionStatus, setConnectionStatus] = useState<{ status: 'success' | 'error' | 'idle'; message: string }>({
    status: 'idle',
    message: ''
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
    if (currentTab !== 'dashboard') {
      const newConfig = { ...config, activeSheet: currentTab };
      setConfig(newConfig);
      loadData(newConfig);
    } else {
      // In dashboard view, load a dummy fetch or simple loading state
      setIsLoading(false);
    }
  }, [currentTab]);

  const handleRefresh = () => {
    loadData(config);
  };

  const isOnline = config.mode === 'demo' || connectionStatus.status === 'success';

  return (
    <div className="app-container">
      {/* Top Android Header */}
      <header className="app-header">
        <div className="logo-section">
          <div className="logo-icon">
            <Database size={18} />
          </div>
          <span className="logo-title">BSMP</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button 
            className="btn btn-secondary btn-sm btn-icon-only" 
            onClick={handleExport}
            title="Ekspor Excel"
          >
            <Download size={14} />
          </button>
          <button 
            className="btn btn-secondary btn-sm btn-icon-only" 
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <button 
            className="btn btn-secondary btn-sm btn-icon-only" 
            onClick={handleRefresh}
            disabled={isLoading}
            title="Sinkronisasi"
          >
            <RefreshCw size={14} className={isLoading ? 'spin-anim' : ''} style={{ animation: isLoading ? 'spin 1s linear infinite' : 'none' }} />
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
              <Dashboard data={sheetData} preset={config.activeSheet} theme={theme} />
            )}

            {currentTab === 'Satwa' && (
              <SatwaManager data={sheetData} config={config} onRefresh={handleRefresh} />
            )}

            {currentTab !== 'dashboard' && currentTab !== 'Satwa' && (
              <DataManager data={sheetData} config={config} onRefresh={handleRefresh} />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
