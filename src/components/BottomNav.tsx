import React from 'react';
import { 
  LayoutDashboard, Heart, Pill, Droplet, Scale, 
  Wind, Activity, Thermometer, FileText, Database,
  Sun, Moon, Download
} from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isOnline: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onExport: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ 
  currentTab, 
  setCurrentTab, 
  isOnline,
  theme,
  toggleTheme,
  onExport
}) => {
  const tabs = [
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

        {/* Sidebar Footer with Theme and Export controls */}
        <div className="sidebar-footer">
          <button 
            className="sidebar-btn" 
            onClick={toggleTheme} 
            title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button 
            className="sidebar-btn" 
            onClick={onExport} 
            title="Ekspor Seluruh Data ke Excel"
          >
            <Download size={16} />
            <span>Export Excel</span>
          </button>
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
