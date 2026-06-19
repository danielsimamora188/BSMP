import React, { useMemo, useEffect, useRef, useCallback } from 'react';
import type { SheetData } from '../utils/sheetSync';
import { 
  Heart, BarChart3, Scale, Activity
} from 'lucide-react';

interface DashboardProps {
  data: SheetData;
  preset: string;
  theme?: string;
  counts?: Record<string, number>;
  avgWeight?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, theme, counts, avgWeight }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Core telemetry calculation
  const stats = useMemo(() => {
    // We aggregate data from all local storage datasets
    const getLength = (key: string) => {
      if (counts && counts[key] !== undefined) {
        return counts[key];
      }
      // Fallback dari INITIAL_DATASETS
      switch (key) {
        case 'Satwa': return 7;
        case 'Medicine': return 28;
        case 'Blooddraw': return 7;
        case 'Weighing': return 6;
        case 'Blowhole_Sample': return 4;
        case 'Stomach_Sample': return 0;
        case 'Tubing': return 2;
        case 'Others': return 3;
        default: return 0;
      }
    };

    const datasets = [
      { name: 'Satwa', count: getLength('Satwa') },
      { name: 'Medicine', count: getLength('Medicine') },
      { name: 'Blooddraw', count: getLength('Blooddraw') },
      { name: 'Weighing', count: getLength('Weighing') },
      { name: 'Blowhole', count: getLength('Blowhole_Sample') },
      { name: 'Stomach', count: getLength('Stomach_Sample') },
      { name: 'Tubing', count: getLength('Tubing') },
      { name: 'Others', count: getLength('Others') }
    ];

    const totalRecords = datasets.reduce((acc, curr) => acc + (curr.name !== 'Satwa' ? curr.count : 0), 0);
    
    // Dynamic lists for dolphins from Satwa sheet data
    const satwaRows = data && data.rows ? data.rows : [];
    const satwaRegistry = satwaRows.map(row => {
      const name = String(row['Nama Satwa'] || '').toUpperCase();
      const desc = String(row['Keterangan'] || row['Species'] || 'Spesies tidak diketahui');
      const tag = String(row['Status Kesehatan'] || 'Sehat');
      
      let badge = 'badge-success';
      const tagLower = tag.toLowerCase();
      if (tagLower.includes('rawat')) {
        badge = 'badge-danger';
      } else if (tagLower.includes('pantau')) {
        badge = 'badge-warning';
      } else if (tagLower.includes('stabil')) {
        badge = 'badge-info';
      }
      
      return { name, desc, tag, badge };
    });

    return {
      totalRecords,
      totalSatwa: getLength('Satwa'),
      avgWeight: avgWeight || '0 Kg',
      datasets,
      satwaRegistry
    };
  }, [data, counts, avgWeight]);

  // Read live CSS variable values for canvas rendering
  const getCssVar = useCallback((varName: string) => {
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  }, []);

  // Draw Minimalist Chart
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    ctx.clearRect(0, 0, width, height);

    const dataPoints = stats.datasets.filter(d => d.name !== 'Satwa');
    const maxVal = Math.max(...dataPoints.map(d => d.count), 1);

    const paddingLeft = 40;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 30;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    // Read theme-aware colors from CSS variables
    const gridColor = getCssVar('--border-color') || '#2d2f31';
    const labelColor = getCssVar('--text-muted') || '#8e918f';
    const barColor = getCssVar('--primary') || '#a8c7fa';
    const axisLabelColor = getCssVar('--text-secondary') || '#c4c7c5';

    // Draw thin solid grid lines (Material 3 style)
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 3; i++) {
      const y = paddingTop + (chartHeight * i) / 3;
      ctx.beginPath();
      ctx.moveTo(paddingLeft, y);
      ctx.lineTo(width - paddingRight, y);
      ctx.stroke();

      // Labels Y
      ctx.fillStyle = labelColor;
      ctx.font = '10px Outfit';
      ctx.textAlign = 'right';
      const val = Math.round(maxVal - (maxVal * i) / 3);
      ctx.fillText(val.toString(), paddingLeft - 8, y + 3);
    }

    // Draw bars
    const barSpacing = chartWidth / dataPoints.length;
    const barWidth = Math.min(24, barSpacing * 0.5);

    dataPoints.forEach((dp, index) => {
      const x = paddingLeft + (index * barSpacing) + (barSpacing - barWidth) / 2;
      const barHeight = (dp.count / maxVal) * chartHeight;
      const y = paddingTop + chartHeight - barHeight;

      // Theme-aware bar color
      ctx.fillStyle = barColor;
      
      // Rounded top rectangle
      ctx.beginPath();
      const radius = 6;
      if (barHeight > radius) {
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + barWidth - radius, y);
        ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
        ctx.lineTo(x + barWidth, y + barHeight);
        ctx.lineTo(x, y + barHeight);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
      } else {
        ctx.rect(x, y, barWidth, barHeight);
      }
      ctx.fill();

      // Label X
      ctx.fillStyle = axisLabelColor;
      ctx.font = '10px Outfit';
      ctx.textAlign = 'center';
      ctx.fillText(dp.name, x + barWidth / 2, paddingTop + chartHeight + 16);
    });

  }, [stats, getCssVar, theme]);

  return (
    <div>
      <h1 className="page-title">Dasbor Satwa</h1>
      <p className="page-subtitle">Ringkasan cepat kesehatan, telemetri berat, dan diagnosis rekam medis satwa.</p>

      {/* Grid Layout of Widget cards (Material 3 Style) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '16px' }}>
        
        {/* Row 1: Telemetry widgets */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          <div className="card stat-card" style={{ borderRadius: 'var(--radius-xl)' }}>
            <div className="stat-icon bg-primary-glow" style={{ color: 'var(--on-primary-container)', background: 'var(--primary-container)' }}>
              <Heart size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Total Rekam Medis</span>
              <span className="stat-value">{stats.totalRecords} Catatan</span>
            </div>
          </div>

          <div className="card stat-card" style={{ borderRadius: 'var(--radius-xl)' }}>
            <div className="stat-icon bg-success-glow" style={{ color: 'var(--success)', background: 'var(--success-container)' }}>
              <Scale size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Rata-rata Berat</span>
              <span className="stat-value">{stats.avgWeight}</span>
            </div>
          </div>
        </div>

        {/* Row 2: Animal registry widget */}
        <div className="card" style={{ borderRadius: 'var(--radius-xl)' }}>
          <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.98rem' }}>
            <Activity size={16} className="c-primary" />
            Status Kesehatan Lumba-Lumba (TSI)
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
            {stats.satwaRegistry.map((satwa, idx) => (
              <div 
                key={idx} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '10px 14px', 
                  background: 'var(--bg-primary)', 
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>{satwa.name}</strong>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{satwa.desc}</span>
                </div>
                <span className={`badge ${satwa.badge}`}>{satwa.tag}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Row 3: Simple Analytics Bar Chart */}
        <div className="card" style={{ borderRadius: 'var(--radius-xl)' }}>
          <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.98rem' }}>
            <BarChart3 size={16} className="c-primary" />
            Penyebaran Rekam Medis per Kategori
          </h2>
          <div style={{ position: 'relative', width: '100%', height: '180px', marginTop: 12 }}>
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }}></canvas>
          </div>
        </div>

      </div>
    </div>
  );
};
