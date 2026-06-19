import React from 'react';
import { 
  LayoutDashboard, Heart, Pill, Droplet, Scale, 
  Wind, Activity, Thermometer, FileText, Database,
  Sun, Moon, Download, LogOut, BarChart2, History, Users
} from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isOnline: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onExport: () => void;
  onLogout?: () => void;
  userRole?: 'admin' | 'user';
  isExporting?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ 
  currentTab, 
  setCurrentTab, 
  isOnline,
  theme,
  toggleTheme,
  onExport,
  onLogout,
  userRole,
  isExporting = false
}) => {
  const allTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'Satwa', label: 'Satwa', icon: Heart },
    { id: 'Medicine', label: 'Medicine', icon: Pill },
    { id: 'Blooddraw', label: 'Blooddraw', icon: Droplet },
    { id: 'Weighing', label: 'Weighing', icon: Scale },
    { id: 'Blowhole_Sample', label: 'Blowhole', icon: Wind },
    { id: 'Stomach_Sample', label: 'Stomach', icon: Activity },
    { id: 'Tubing', label: 'Tubing', icon: Thermometer },
    { id: 'Others', label: 'Others', icon: FileText }
  ];

  // Admin tabs: Grafik Ringkasan, Log Aktivitas, Manajemen Pengguna
  const adminTabs = [
    { id: 'dashboard', label: 'Grafik Ringkasan', icon: BarChart2 },
    { id: 'admin-logs', label: 'Log Aktivitas', icon: History },
    { id: 'admin-users', label: 'Manajemen User', icon: Users }
  ];

  // Filter tabs: Admin gets their own set, user gets all sheet tabs
  const tabs = userRole === 'admin' ? adminTabs : allTabs;

  return (
    <>
      {/* Desktop Sidebar Navigation */}
      <aside className="app-sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <Database size={18} />
          </div>
          <span className="logo-title">BSMP</span>
          <span className="logo-badge" style={{ marginLeft: 6 }}>
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>

        {/* Admin role badge */}
        {userRole === 'admin' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 12px',
            marginBottom: 16,
            borderRadius: 'var(--radius-md)',
            background: 'var(--primary-container)',
            border: '1px solid rgba(168,199,250,0.15)',
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--on-primary-container)', letterSpacing: '0.3px' }}>
              🛡️ Mode Administrator
            </span>
          </div>
        )}
        <ul className="sidebar-menu">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <li key={tab.id}>
                <a
                  className={`menu-item ${isActive ? 'active' : ''}`}
                  onClick={() => setCurrentTab(tab.id)}
                >
                  <div className="icon-wrapper">
                    <IconComponent size={18} />
                  </div>
                  <span>{tab.label}</span>
                </a>
              </li>
            );
          })}
        </ul>

        {/* Sidebar Footer with Theme, Export, and Logout controls */}
        <div className="sidebar-footer">
          <button 
            className="sidebar-btn" 
            onClick={toggleTheme} 
            title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          
          {/* Hide export excel for admin since they don't see animal telemetry */}
          {userRole !== 'admin' && (
            <button 
              className="sidebar-btn" 
              onClick={onExport} 
              title={isExporting ? 'Mengunduh...' : 'Ekspor Seluruh Data ke Excel'}
              disabled={isExporting}
              style={{ opacity: isExporting ? 0.7 : 1 }}
            >
              <Download size={16} style={{ animation: isExporting ? 'spin 1s linear infinite' : 'none' }} />
              <span>{isExporting ? 'Mengunduh...' : 'Export Excel'}</span>
            </button>
          )}

          {onLogout && (
            <button 
              className="sidebar-btn" 
              onClick={onLogout} 
              title="Keluar dari Akun"
              style={{ color: 'var(--danger)', marginTop: 4 }}
            >
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Horizontal Scroll Bottom Navigation */}
      <nav className="bottom-nav">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <div
              key={tab.id}
              className={`bottom-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setCurrentTab(tab.id)}
            >
              <div className="icon-wrapper">
                <IconComponent size={18} />
              </div>
              <span>{tab.label}</span>
            </div>
          );
        })}
      </nav>
    </>
  );
};
