// Types for our SheetSync application
export interface SheetConfig {
  mode: 'demo' | 'csv' | 'crud';
  csvUrl: string;
  gasUrl: string;
  activeSheet: string;
}

export interface SheetData {
  headers: string[];
  rows: Record<string, any>[];
}

// Available Sheets/Tables List
export const SHEET_NAMES = [
  'Satwa',
  'Medicine',
  'Blooddraw',
  'Weighing',
  'Blowhole_Sample',
  'Stomach_Sample',
  'Tubing',
  'Others',
  'Users',
  'Logs'
];

// User's Real Datasets pre-populated
export const INITIAL_DATASETS: Record<string, SheetData> = {
  'Satwa': {
    headers: [
      'Nama Satwa', 'Species', 'Gambar', 'Jenis Kelamin', 'Kedatangan SBJ', 'Kedatangan TSI', 
      'Ekor (P) (cm)', 'Ekor (L) (cm)', 'Flipper (P) (cm)', 'Flipper (L) (cm)', 
      'Dorsal (L) (cm)', 'Dorsal (T) (cm)', 'P. Tubuh (cm)', 'P. Moncong (cm)', 'Ling. Badan (cm)',
      'Status Kesehatan', 'Keterangan'
    ],
    rows: [
      { 
        'Nama Satwa': 'LEON', 
        'Species': 'Tursiops Aduncus', 
        'Gambar': 'https://lh3.googleusercontent.com/d/15KOUT0u0h5iIb1CipzmX0tIbc2X50vdL', 
        'Jenis Kelamin': 'Jantan', 
        'Kedatangan SBJ': '21 April 2014', 
        'Kedatangan TSI': '13 Juni 2014', 
        'Ekor (P) (cm)': '56', 'Ekor (L) (cm)': '18', 'Flipper (P) (cm)': '34', 'Flipper (L) (cm)': '18', 
        'Dorsal (L) (cm)': '29', 'Dorsal (T) (cm)': '22', 'P. Tubuh (cm)': '230', 'P. Moncong (cm)': '14', 'Ling. Badan (cm)': '112',
        'Status Kesehatan': 'Sehat', 'Keterangan': 'Tursiops Aduncus (SBJ: 2014)'
      },
      { 
        'Nama Satwa': 'MANYU', 
        'Species': 'Tursiops Aduncus', 
        'Gambar': 'https://lh3.googleusercontent.com/d/1of1E3t8fjQF0QXNGTB3x6IYtXEZ3DTKt', 
        'Jenis Kelamin': 'Jantan', 
        'Kedatangan SBJ': '8 Januari 2016', 
        'Kedatangan TSI': '30 Maret 2016', 
        'Ekor (P) (cm)': '-', 'Ekor (L) (cm)': '-', 'Flipper (P) (cm)': '34', 'Flipper (L) (cm)': '14', 
        'Dorsal (L) (cm)': '24', 'Dorsal (T) (cm)': '21', 'P. Tubuh (cm)': '211', 'P. Moncong (cm)': '13', 'Ling. Badan (cm)': '-',
        'Status Kesehatan': 'Sehat', 'Keterangan': 'Tursiops Aduncus (SBJ: 2016)'
      },
      { 
        'Nama Satwa': 'CENGHO', 
        'Species': 'Tursiops Aduncus', 
        'Gambar': 'https://lh3.googleusercontent.com/d/1fUoLKAdX5bc-4M7h9ItpSioJXvgqA5fU', 
        'Jenis Kelamin': 'Jantan', 
        'Kedatangan SBJ': '-', 
        'Kedatangan TSI': '15 Januari 2016', 
        'Ekor (P) (cm)': '58', 'Ekor (L) (cm)': '20', 'Flipper (P) (cm)': '36', 'Flipper (L) (cm)': '16', 
        'Dorsal (L) (cm)': '21', 'Dorsal (T) (cm)': '36', 'P. Tubuh (cm)': '213', 'P. Moncong (cm)': '16', 'Ling. Badan (cm)': '110',
        'Status Kesehatan': 'Sehat', 'Keterangan': 'Tursiops Aduncus (TSI: 2016)'
      },
      { 
        'Nama Satwa': 'ABU', 
        'Species': 'Tursiops Aduncus', 
        'Gambar': 'https://lh3.googleusercontent.com/d/1NBzUaNI61LNVqsYRN486d_DRt6FKKD08', 
        'Jenis Kelamin': 'Jantan', 
        'Kedatangan SBJ': '8 Januari 2016', 
        'Kedatangan TSI': '23 Maret 2016', 
        'Ekor (P) (cm)': '52', 'Ekor (L) (cm)': '18', 'Flipper (P) (cm)': '39', 'Flipper (L) (cm)': '19', 
        'Dorsal (L) (cm)': '20', 'Dorsal (T) (cm)': '38', 'P. Tubuh (cm)': '216', 'P. Moncong (cm)': '14', 'Ling. Badan (cm)': '213',
        'Status Kesehatan': 'Sehat', 'Keterangan': 'Tursiops Aduncus (SBJ: 2016)'
      },
      { 
        'Nama Satwa': 'SAKA', 'Species': '-', 'Gambar': '-', 'Jenis Kelamin': '-', 'Kedatangan SBJ': '-', 'Kedatangan TSI': '-', 
        'Ekor (P) (cm)': '-', 'Ekor (L) (cm)': '-', 'Flipper (P) (cm)': '-', 'Flipper (L) (cm)': '-', 
        'Dorsal (L) (cm)': '-', 'Dorsal (T) (cm)': '-', 'P. Tubuh (cm)': '-', 'P. Moncong (cm)': '-', 'Ling. Badan (cm)': '-',
        'Status Kesehatan': 'Perawatan', 'Keterangan': 'Dalam Perawatan Medis Intensif'
      },
      { 
        'Nama Satwa': 'SINYORITA', 'Species': '-', 'Gambar': '-', 'Jenis Kelamin': '-', 'Kedatangan SBJ': '-', 'Kedatangan TSI': '-', 
        'Ekor (P) (cm)': '-', 'Ekor (L) (cm)': '-', 'Flipper (P) (cm)': '-', 'Flipper (L) (cm)': '-', 
        'Dorsal (L) (cm)': '-', 'Dorsal (T) (cm)': '-', 'P. Tubuh (cm)': '-', 'P. Moncong (cm)': '-', 'Ling. Badan (cm)': '-',
        'Status Kesehatan': 'Pemantauan', 'Keterangan': 'Dalam Pemantauan Berkala'
      },
      { 
        'Nama Satwa': 'WINTER', 'Species': '-', 'Gambar': '-', 'Jenis Kelamin': '-', 'Kedatangan SBJ': '-', 'Kedatangan TSI': '-', 
        'Ekor (P) (cm)': '-', 'Ekor (L) (cm)': '-', 'Flipper (P) (cm)': '-', 'Flipper (L) (cm)': '-', 
        'Dorsal (L) (cm)': '-', 'Dorsal (T) (cm)': '-', 'P. Tubuh (cm)': '-', 'P. Moncong (cm)': '-', 'Ling. Badan (cm)': '-',
        'Status Kesehatan': 'Stabil', 'Keterangan': 'Kondisi Kesehatan Stabil'
      }
    ]
  },
  'Medicine': {
    headers: ['ID_medicine', 'NAMA SATWA', 'KATEGORI', 'NAME OF MEDICINE', 'START', 'STOP', 'NOTE'],
    rows: [
      { 'ID_medicine': '133101', 'NAMA SATWA': 'SAKA', 'KATEGORI': 'Medicine', 'NAME OF MEDICINE': 'Meloxicam 1,5 tab x 1', 'START': '31 May 2025', 'STOP': '07 Juny 2025', 'NOTE': '03/08/2025 Erlamycetin(salep) 3x Cair habis' },
      { 'ID_medicine': '890830', 'NAMA SATWA': 'SAKA', 'KATEGORI': 'Medicine', 'NAME OF MEDICINE': 'Omeprazole 1x1', 'START': '31 May 2025', 'STOP': '07 Juny 2025', 'NOTE': '16/08/2025 Erlamycetin(salep) 3x, diganti Erlamycetin cair' },
      { 'ID_medicine': '544447', 'NAMA SATWA': 'SAKA', 'KATEGORI': 'Medicine', 'NAME OF MEDICINE': 'Bintamox 2x2', 'START': '31 May 2025', 'STOP': '07 Juny 2025', 'NOTE': '-' },
      { 'ID_medicine': '518945', 'NAMA SATWA': 'SAKA', 'KATEGORI': 'Medicine', 'NAME OF MEDICINE': 'Meloxicam 1,5 x 1', 'START': '24 July 2025', 'STOP': '29 July 2025', 'NOTE': '-' },
      { 'ID_medicine': '374455', 'NAMA SATWA': 'SAKA', 'KATEGORI': 'Medicine', 'NAME OF MEDICINE': 'Tobro 3x2 tetes', 'START': '24 July 2025', 'STOP': '03 August 2025', 'NOTE': '-' },
      { 'ID_medicine': '799265', 'NAMA SATWA': 'SAKA', 'KATEGORI': 'Medicine', 'NAME OF MEDICINE': 'Erlamycetin 3x2 tetes', 'START': '24 July 2025', 'STOP': '27 August 2025', 'NOTE': '-' },
      { 'ID_medicine': '575566', 'NAMA SATWA': 'SAKA', 'KATEGORI': 'Medicine', 'NAME OF MEDICINE': 'Cairan NS 3x2 tetes', 'START': '24 July 2025', 'STOP': '-', 'NOTE': '-' },
      { 'ID_medicine': '198391', 'NAMA SATWA': 'SAKA', 'KATEGORI': 'Medicine', 'NAME OF MEDICINE': 'Tarivid 3x2 tetes', 'START': '26 August 2025', 'STOP': '16 October 2025', 'NOTE': 'Tarivid 3x2 pengganti Erlamycetin 3x2' },
      { 'ID_medicine': '453987', 'NAMA SATWA': 'SAKA', 'KATEGORI': 'Medicine', 'NAME OF MEDICINE': 'BIO ATP 1x1', 'START': '13 September 2025', 'STOP': '24 September 2025', 'NOTE': '-' },
      { 'ID_medicine': '577752', 'NAMA SATWA': 'SAKA', 'KATEGORI': 'Medicine', 'NAME OF MEDICINE': 'Fufang 1x1', 'START': '13 September 2025', 'STOP': '24 September 2025', 'NOTE': '-' },
      { 'ID_medicine': '419165', 'NAMA SATWA': 'SAKA', 'KATEGORI': 'Medicine', 'NAME OF MEDICINE': 'Meloxicam 1x 1,5', 'START': '13 September 2025', 'STOP': '24 September 2025', 'NOTE': '-' },
      { 'ID_medicine': '913388', 'NAMA SATWA': 'SAKA', 'KATEGORI': 'Medicine', 'NAME OF MEDICINE': 'Siclidon 2x2', 'START': '17 September 2025', 'STOP': '-', 'NOTE': 'Pemberian Siclidon hanya 1x saja' },
      { 'ID_medicine': '500142', 'NAMA SATWA': 'SAKA', 'KATEGORI': 'Medicine', 'NAME OF MEDICINE': 'Vit K 1x 3,5', 'START': '17 September 2025', 'STOP': '04 October 2025', 'NOTE': '-' },
      { 'ID_medicine': '123820', 'NAMA SATWA': 'SAKA', 'KATEGORI': 'Medicine', 'NAME OF MEDICINE': 'Matovit 1x2', 'START': '18 September 2025', 'STOP': '-', 'NOTE': '-' },
      { 'ID_medicine': '329357', 'NAMA SATWA': 'SAKA', 'KATEGORI': 'Medicine', 'NAME OF MEDICINE': 'Doxycycline 2x2', 'START': '18 September 2025', 'STOP': '27 September 2025', 'NOTE': '-' },
      { 'ID_medicine': '422026', 'NAMA SATWA': 'SAKA', 'KATEGORI': 'Medicine', 'NAME OF MEDICINE': 'BIO ATP 2hari x 1', 'START': '24 September 2025', 'STOP': '-', 'NOTE': 'BIO ATP 2hari x 1 ganti dosis' },
      { 'ID_medicine': '950482', 'NAMA SATWA': 'SAKA', 'KATEGORI': 'Medicine', 'NAME OF MEDICINE': 'Omeprazole 1x2', 'START': '24 September 2025', 'STOP': '01 October 2025', 'NOTE': '-' },
      { 'ID_medicine': '810566', 'NAMA SATWA': 'SAKA', 'KATEGORI': 'Medicine', 'NAME OF MEDICINE': 'Erlamycetin 3x2 tetes', 'START': '16 October 2025', 'STOP': '22 October 2025', 'NOTE': '-' },
      { 'ID_medicine': '667679', 'NAMA SATWA': 'SAKA', 'KATEGORI': 'Medicine', 'NAME OF MEDICINE': 'Akilen 3x2', 'START': '22 October 2025', 'STOP': '-', 'NOTE': 'Akilen 3x2 Pengganti Erlamycetin 3x2 tetes' },
      { 'ID_medicine': '750394', 'NAMA SATWA': 'SAKA', 'KATEGORI': 'Medicine', 'NAME OF MEDICINE': 'Neurobion 2x1', 'START': '7 Januari 2026', 'STOP': '-', 'NOTE': 'Pengganti Mazuri 2x1 karena stok habis' },
      { 'ID_medicine': '342615', 'NAMA SATWA': 'SAKA', 'KATEGORI': 'Medicine', 'NAME OF MEDICINE': 'Enervon C 1x1', 'START': '10 Februari 2026', 'STOP': '14 April 2026', 'NOTE': '-' },
      { 'ID_medicine': '874998', 'NAMA SATWA': 'SAKA', 'KATEGORI': 'Medicine', 'NAME OF MEDICINE': 'Fufang 1x1 8 HARI', 'START': '28 April 2023', 'STOP': '2 Mei 2023', 'NOTE': '-' },
      { 'ID_medicine': '137902', 'NAMA SATWA': 'SAKA', 'KATEGORI': 'Medicine', 'NAME OF MEDICINE': 'Fufang 1x1', 'START': '22 Mei 2023', 'STOP': '30 Mei 2023', 'NOTE': '-' },
      { 'ID_medicine': '137901', 'NAMA SATWA': 'SINYORITA', 'KATEGORI': 'Medicine', 'NAME OF MEDICINE': 'BIO ATP 2hari x 1 tablet', 'START': '20 Desember 2025', 'STOP': '-', 'NOTE': '-' },
      { 'ID_medicine': '275299', 'NAMA SATWA': 'SINYORITA', 'KATEGORI': 'Medicine', 'NAME OF MEDICINE': 'Neurobion 2x1', 'START': '7 Januari 2026', 'STOP': '-', 'NOTE': 'Pengganti Mazuri 2x1 karena stok habis' },
      { 'ID_medicine': '598815', 'NAMA SATWA': 'WINTER', 'KATEGORI': 'Medicine', 'NAME OF MEDICINE': 'BIO ATP 2hari x 1 tablet', 'START': '20 Desember 2025', 'STOP': '-', 'NOTE': '-' },
      { 'ID_medicine': '501651', 'NAMA SATWA': 'WINTER', 'KATEGORI': 'Medicine', 'NAME OF MEDICINE': 'Neurobion 2x1', 'START': '7 Januari 2026', 'STOP': '-', 'NOTE': 'Pengganti Mazuri 2x1 karena stok habis' },
      { 'ID_medicine': '789400', 'NAMA SATWA': 'WINTER', 'KATEGORI': 'Medicine', 'NAME OF MEDICINE': 'Omeprazole 1x2', 'START': '25 Mei 2026', 'STOP': '-', 'NOTE': '-' }
    ]
  },
  'Blooddraw': {
    headers: ['ID_Blooddraw', 'NAMA SATWA', 'KATEGORI', 'DATE', 'DOCTOR', 'SUCCEEDED / FAILED'],
    rows: [
      { 'ID_Blooddraw': '381121', 'NAMA SATWA': 'SAKA', 'KATEGORI': 'Blooddraw', 'DATE': '08 January 2025', 'DOCTOR': 'Dr. Ditto', 'SUCCEEDED / FAILED': 'FALSE' },
      { 'ID_Blooddraw': '672458', 'NAMA SATWA': 'SAKA', 'KATEGORI': 'Blooddraw', 'DATE': '09 January 2025', 'DOCTOR': 'Dr. Ditto & Mas Sigit', 'SUCCEEDED / FAILED': 'FALSE' },
      { 'ID_Blooddraw': '536934', 'NAMA SATWA': 'SAKA', 'KATEGORI': 'Blooddraw', 'DATE': '27 July 2025', 'DOCTOR': 'Dr. Ditto', 'SUCCEEDED / FAILED': 'TRUE' },
      { 'ID_Blooddraw': '538673', 'NAMA SATWA': 'SAKA', 'KATEGORI': 'Blooddraw', 'DATE': '12 September 2025', 'DOCTOR': 'Mas Sigit', 'SUCCEEDED / FAILED': 'TRUE' },
      { 'ID_Blooddraw': '341023', 'NAMA SATWA': 'SINYORITA', 'KATEGORI': 'Blooddraw', 'DATE': '08 January 2025', 'DOCTOR': 'Dr. Ditto', 'SUCCEEDED / FAILED': 'TRUE' },
      { 'ID_Blooddraw': '688845', 'NAMA SATWA': 'SINYORITA', 'KATEGORI': 'Blooddraw', 'DATE': '27 July 2025', 'DOCTOR': 'Dr. Ditto', 'SUCCEEDED / FAILED': 'TRUE' },
      { 'ID_Blooddraw': '448963', 'NAMA SATWA': 'WINTER', 'KATEGORI': 'Blooddraw', 'DATE': '27 July 2025', 'DOCTOR': 'Dr. Ditto', 'SUCCEEDED / FAILED': 'FALSE' }
    ]
  },
  'Weighing': {
    headers: ['ID_Weighning', 'NAMA SATWA', 'KATEGORI', 'DATE', 'HEAVY', 'NOTE'],
    rows: [
      { 'ID_Weighning': '342919', 'NAMA SATWA': 'SAKA', 'KATEGORI': 'Weighing', 'DATE': '19 May 2025', 'HEAVY': '116,5 Kg', 'NOTE': '' },
      { 'ID_Weighning': '811057', 'NAMA SATWA': 'SAKA', 'KATEGORI': 'Weighing', 'DATE': '25 August 2025', 'HEAVY': '109,5 Kg', 'NOTE': '' },
      { 'ID_Weighning': '997336', 'NAMA SATWA': 'SINYORITA', 'KATEGORI': 'Weighing', 'DATE': '19 May 2025', 'HEAVY': '96,5 Kg', 'NOTE': '' },
      { 'ID_Weighning': '739380', 'NAMA SATWA': 'SINYORITA', 'KATEGORI': 'Weighing', 'DATE': '25 August 2025', 'HEAVY': '92,0 Kg', 'NOTE': '' },
      { 'ID_Weighning': '229352', 'NAMA SATWA': 'WINTER', 'KATEGORI': 'Weighing', 'DATE': '19 January 2025', 'HEAVY': '95,0 Kg', 'NOTE': '' },
      { 'ID_Weighning': '735602', 'NAMA SATWA': 'WINTER', 'KATEGORI': 'Weighing', 'DATE': '28 August 2025', 'HEAVY': '85,0 Kg', 'NOTE': '' }
    ]
  },
  'Blowhole_Sample': {
    headers: ['ID_Blowhole_Sample', 'NAMA SATWA', 'KATEGORI', 'DATE', 'DOCTOR'],
    rows: [
      { 'ID_Blowhole_Sample': '409039', 'NAMA SATWA': 'SAKA', 'KATEGORI': 'Sample Blowhole', 'DATE': '06 January 2025', 'DOCTOR': 'Dr. Ditto' },
      { 'ID_Blowhole_Sample': '951634', 'NAMA SATWA': 'SAKA', 'KATEGORI': 'Sample Blowhole', 'DATE': '08 January 2025', 'DOCTOR': 'Dr. Ditto' },
      { 'ID_Blowhole_Sample': '285441', 'NAMA SATWA': 'SINYORITA', 'KATEGORI': 'Sample Blowhole', 'DATE': '06 January 2025', 'DOCTOR': 'Dr. Ditto' },
      { 'ID_Blowhole_Sample': '688917', 'NAMA SATWA': 'SINYORITA', 'KATEGORI': 'Sample Blowhole', 'DATE': '08 January 2025', 'DOCTOR': 'Dr. Ditto' }
    ]
  },
  'Stomach_Sample': {
    headers: ['ID_Stomach_Sample', 'NAMA SATWA', 'KATEGORI', 'DATE', 'DOCTOR', 'NOTE'],
    rows: []
  },
  'Tubing': {
    headers: ['ID_Tubing', 'NAMA SATWA', 'KATEGORI', 'DATE', 'ML', 'NOTE'],
    rows: [
      { 'ID_Tubing': '352109', 'NAMA SATWA': 'SAKA', 'KATEGORI': 'Tubing', 'DATE': '02 January 2025', 'ML': '1500 ML', 'NOTE': '' },
      { 'ID_Tubing': '824724', 'NAMA SATWA': 'SINYORITA', 'KATEGORI': 'Tubing', 'DATE': '01 January 2025', 'ML': '1500 ML', 'NOTE': '' }
    ]
  },
  'Others': {
    headers: ['ID_Others', 'NAMA SATWA', 'KATEGORI', 'DATE', 'INFORMATION'],
    rows: [
      { 'ID_Others': '416645', 'NAMA SATWA': 'SAKA', 'KATEGORI': 'Others', 'DATE': '24 July 2025', 'INFORMATION': 'Pemberian cairan NS dan obat tetes mata oleh Dr. Ditto' },
      { 'ID_Others': '548825', 'NAMA SATWA': 'SAKA', 'KATEGORI': 'Others', 'DATE': '17 September 2025', 'INFORMATION': 'Penanganan mata Saka oleh Dr. Ditto karena keluar darah' },
      { 'ID_Others': '296495', 'NAMA SATWA': 'SAKA', 'KATEGORI': 'Others', 'DATE': '10 October 2025', 'INFORMATION': 'Pengecekan mata oleh Dokter Internal & External didampingi oleh Dr. Yohana dan Dr. Bongot' }
    ]
  },
  'Users': {
    headers: ['Username', 'Password', 'Nama Lengkap', 'Role'],
    rows: [
      { 'Username': 'admin', 'Password': 'admin123', 'Nama Lengkap': 'Administrator Utama', 'Role': 'admin' },
      { 'Username': 'petugas1', 'Password': 'user123', 'Nama Lengkap': 'Ahmad Fauzi', 'Role': 'user' }
    ]
  },
  'Logs': {
    headers: ['ID_Log', 'Tanggal & Waktu', 'Pengguna', 'Aktivitas', 'Detail'],
    rows: []
  }
};

// ─── Config Storage (localStorage only for user session preferences, NOT data) ───
const CONFIG_KEY = 'sheetsync_config';

export function saveConfig(config: SheetConfig) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

export function getConfig(): SheetConfig {
  const defaultGasUrl = import.meta.env.VITE_GAS_URL || '';
  const defaultMode = (import.meta.env.VITE_DEFAULT_MODE as 'demo' | 'csv' | 'crud') || (defaultGasUrl ? 'crud' : 'demo');

  const saved = localStorage.getItem(CONFIG_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        mode: parsed.mode || defaultMode,
        csvUrl: parsed.csvUrl || '',
        gasUrl: parsed.gasUrl || defaultGasUrl,
        activeSheet: parsed.activeSheet || SHEET_NAMES[0]
      };
    } catch (e) {
      // ignore
    }
  }
  return {
    mode: defaultMode,
    csvUrl: '',
    gasUrl: defaultGasUrl,
    activeSheet: SHEET_NAMES[0]
  };
}

// ─── Fetch list of animal names from the Satwa sheet ───
export async function fetchSatwaNames(config: SheetConfig): Promise<string[]> {
  const fallback = INITIAL_DATASETS['Satwa'].rows
    .map(r => String(r['Nama Satwa'] || '').trim().toUpperCase())
    .filter(n => n && n !== '-');

  if (config.mode === 'demo') {
    return fallback;
  }

  if (config.mode === 'crud') {
    if (!config.gasUrl) return fallback;
    try {
      const fetchUrl = `${config.gasUrl}${config.gasUrl.includes('?') ? '&' : '?'}action=read&sheetName=Satwa`;
      const response = await fetch(fetchUrl);
      if (!response.ok) return fallback;
      const resJson = await response.json();
      if (resJson.status === 'success' && Array.isArray(resJson.data) && resJson.data.length > 0) {
        const names: string[] = [];
        resJson.data.forEach((row: Record<string, any>) => {
          const name = String(row['Nama Satwa'] || '').trim().toUpperCase();
          if (name && name !== '-' && name !== '') names.push(name);
        });
        return names.length > 0 ? names : fallback;
      }
      return fallback;
    } catch (e) {
      return fallback;
    }
  }

  return fallback;
}

// Robust CSV Parser
export function parseCSV(text: string): SheetData {
  const rows: any[][] = [];
  let currentRow: any[] = [];
  let inQuotes = false;
  let cell = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        cell += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(cell.trim());
      cell = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++; // skip \n
      }
      currentRow.push(cell.trim());
      rows.push(currentRow);
      currentRow = [];
      cell = '';
    } else {
      cell += char;
    }
  }

  if (cell || currentRow.length > 0) {
    currentRow.push(cell.trim());
    rows.push(currentRow);
  }

  const cleanRows = rows.filter(r => {
    if (r.length === 0) return false;
    const isPlaceholder = r.every(cellVal => {
      const trimmed = cellVal.trim();
      return trimmed === '' || trimmed === '-' || trimmed === 'null' || trimmed === undefined;
    });
    return !isPlaceholder;
  });

  if (cleanRows.length === 0) {
    return { headers: [], rows: [] };
  }

  const headers = cleanRows[0];
  const items: Record<string, any>[] = [];

  for (let i = 1; i < cleanRows.length; i++) {
    const row = cleanRows[i];
    const item: Record<string, any> = {};
    let hasVal = false;
    for (let j = 0; j < headers.length; j++) {
      const val = row[j] !== undefined ? row[j] : '';
      item[headers[j]] = val;
      if (val !== '' && val !== '-') hasVal = true;
    }
    if (hasVal) {
      item['__rowNum__'] = i + 1;
      items.push(item);
    }
  }

  return { headers, rows: items };
}

// Fetch manager — all data comes from spreadsheet/INITIAL_DATASETS, never localStorage
export async function fetchSheetData(config: SheetConfig): Promise<SheetData> {
  if (config.mode === 'demo') {
    // Return directly from INITIAL_DATASETS — no localStorage
    return INITIAL_DATASETS[config.activeSheet] || { headers: [], rows: [] };
  }

  if (config.mode === 'csv') {
    if (!config.csvUrl) throw new Error('Link CSV Google Sheets tidak boleh kosong!');
    try {
      const response = await fetch(config.csvUrl);
      if (!response.ok) throw new Error('Gagal mengunduh spreadsheet.');
      const csvText = await response.text();
      return parseCSV(csvText);
    } catch (e: any) {
      console.error(e);
      throw new Error(`Koneksi CSV Gagal: ${e.message}`);
    }
  }

  if (config.mode === 'crud') {
    if (!config.gasUrl) throw new Error('URL Apps Script Web App tidak boleh kosong!');
    const fetchUrl = `${config.gasUrl}${config.gasUrl.includes('?') ? '&' : '?'}action=read&sheetName=${encodeURIComponent(config.activeSheet)}`;
    
    try {
      const response = await fetch(fetchUrl);
      if (!response.ok) throw new Error('Gagal terhubung ke Apps Script.');
      const resJson = await response.json();
      if (resJson.status === 'success') {
        const rows = resJson.data || [];
        let headers: string[] = [];
        if (rows.length > 0) {
          headers = Object.keys(rows[0]).filter(k => k !== '__rowNum__');
        } else {
          headers = INITIAL_DATASETS[config.activeSheet]?.headers || [];
        }
        return { headers, rows };
      } else {
        throw new Error(resJson.message || 'Respons API bermasalah');
      }
    } catch (e: any) {
      console.error(e);
      throw new Error(`Koneksi CRUD Gagal: ${e.message}`);
    }
  }

  return { headers: [], rows: [] };
}

// Fetch dashboard count summary and stats for all sheets
export async function fetchDashboardCounts(config: SheetConfig): Promise<{ counts: Record<string, number>; avgWeight: string }> {
  const getAvgWeightFromRows = (rows: Record<string, any>[]): string => {
    let totalWeight = 0;
    let weightCount = 0;
    rows.forEach(r => {
      const heavyStr = String(r['HEAVY'] || '');
      if (heavyStr) {
        const cleanStr = heavyStr.replace(',', '.').replace(/[^0-9.]/g, '');
        const num = parseFloat(cleanStr);
        if (!isNaN(num)) {
          totalWeight += num;
          weightCount++;
        }
      }
    });
    if (weightCount > 0) {
      const avg = totalWeight / weightCount;
      return avg.toFixed(1).replace('.', ',') + ' Kg';
    }
    return '0 Kg';
  };

  if (config.mode === 'demo') {
    const counts: Record<string, number> = {};
    SHEET_NAMES.forEach(name => {
      counts[name] = (INITIAL_DATASETS[name]?.rows || []).length;
    });
    const weighingData = INITIAL_DATASETS['Weighing']?.rows || [];
    const avgWeight = getAvgWeightFromRows(weighingData);
    return { counts, avgWeight };
  }

  if (config.mode === 'csv') {
    const counts: Record<string, number> = {};
    SHEET_NAMES.forEach(name => {
      counts[name] = INITIAL_DATASETS[name]?.rows.length || 0;
    });
    const weighingData = INITIAL_DATASETS['Weighing']?.rows || [];
    const avgWeight = getAvgWeightFromRows(weighingData);
    return { counts, avgWeight };
  }

  if (config.mode === 'crud') {
    if (!config.gasUrl) throw new Error('URL Apps Script Web App tidak boleh kosong!');
    const fetchUrl = `${config.gasUrl}${config.gasUrl.includes('?') ? '&' : '?'}action=dashboard`;
    try {
      const response = await fetch(fetchUrl);
      if (!response.ok) throw new Error('Gagal terhubung ke Apps Script.');
      const resJson = await response.json();
      if (resJson.status === 'success' && resJson.counts) {
        return {
          counts: resJson.counts,
          avgWeight: resJson.avgWeight || '98,2 Kg'
        };
      } else {
        throw new Error(resJson.message || 'Respons API bermasalah');
      }
    } catch (e: any) {
      console.warn('Dashboard fetch failed, falling back to INITIAL_DATASETS:', e);
      const counts: Record<string, number> = {};
      SHEET_NAMES.forEach(name => {
        counts[name] = INITIAL_DATASETS[name]?.rows.length || 0;
      });
      const weighingData = INITIAL_DATASETS['Weighing']?.rows || [];
      const avgWeight = getAvgWeightFromRows(weighingData);
      return { counts, avgWeight };
    }
  }

  return { counts: {}, avgWeight: '0 Kg' };
}

// Initialize empty Google Sheets database with INITIAL_DATASETS presets
export async function initializeSpreadsheetData(config: SheetConfig): Promise<boolean> {
  if (config.mode !== 'crud') return false;
  if (!config.gasUrl) throw new Error('URL Apps Script Web App tidak boleh kosong!');
  try {
    const cleanDatasets: Record<string, any[]> = {};
    
    SHEET_NAMES.forEach(sheetName => {
      const data = INITIAL_DATASETS[sheetName];
      if (data && data.rows) {
        cleanDatasets[sheetName] = data.rows.map(row => {
          const cleanRow = { ...row };
          delete cleanRow['__rowNum__'];
          return cleanRow;
        });
      } else {
        cleanDatasets[sheetName] = [];
      }
    });

    const response = await fetch(config.gasUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        action: 'initialize',
        datasets: cleanDatasets
      })
    });
    
    if (!response.ok) throw new Error('Gagal menghubungkan ke Apps Script.');
    const text = await response.text();
    let result;
    try {
      result = JSON.parse(text);
    } catch (err) {
      throw new Error('Respons API tidak valid JSON.');
    }
    
    return result && result.status === 'success';
  } catch (e) {
    console.error('Database initialization failed:', e);
    return false;
  }
}

// Asynchronous audit logging helper
async function logAction(config: SheetConfig, action: string, sheetName: string, rowData: Record<string, any>, idValue?: any) {
  if (sheetName === 'Logs') return; // Prevent loops
  
  try {
    const loggedUserStr = localStorage.getItem('bsmp_current_user');
    let username = 'System';
    if (loggedUserStr) {
      try {
        const parsed = JSON.parse(loggedUserStr);
        username = parsed.username || 'System';
      } catch (e) {
        // ignore
      }
    }

    const logId = Math.floor(100000 + Math.random() * 900000).toString();
    const nowStr = new Date().toLocaleString('id-ID');

    const firstKey = Object.keys(rowData)[0] || '';
    const rowIdVal = idValue || rowData[firstKey] || '-';

    let detailMsg = '';
    if (action === 'create') {
      detailMsg = `Menambahkan data baru di ${sheetName} (ID: ${rowIdVal})`;
    } else if (action === 'update') {
      detailMsg = `Mengubah data di ${sheetName} (ID: ${rowIdVal})`;
    } else if (action === 'delete') {
      detailMsg = `Menghapus data di ${sheetName} (ID: ${rowIdVal})`;
    }

    const logRow = {
      'ID_Log': logId,
      'Tanggal & Waktu': nowStr,
      'Pengguna': username,
      'Aktivitas': `${action.toUpperCase()} - ${sheetName}`,
      'Detail': detailMsg
    };

    // Trigger silent write to 'Logs'
    await executeWriteAction({ ...config, activeSheet: 'Logs' }, 'create', logRow);
  } catch (err) {
    console.error('Error logging user action:', err);
  }
}

// Write actions — demo mode uses in-memory INITIAL_DATASETS (not localStorage)
export async function executeWriteAction(
  config: SheetConfig,
  action: 'create' | 'update' | 'delete',
  rowData: Record<string, any>,
  idValue?: any
): Promise<boolean> {
  if (config.mode === 'demo') {
    const current = INITIAL_DATASETS[config.activeSheet] || { headers: [], rows: [] };
    const idKey = current.headers[0];

    let newRows = [...current.rows];

    if (action === 'create') {
      newRows.push({ ...rowData });
    } else if (action === 'update') {
      newRows = newRows.map(row => {
        if (String(row[idKey]) === String(idValue)) {
          return { ...row, ...rowData };
        }
        return row;
      });
    } else if (action === 'delete') {
      newRows = newRows.filter(row => String(row[idKey]) !== String(idValue));
    }
    
    // Update in-memory INITIAL_DATASETS so UI is consistent within the session
    INITIAL_DATASETS[config.activeSheet] = { headers: current.headers, rows: newRows };
    
    // Log asynchronously
    logAction(config, action, config.activeSheet, rowData, idValue);
    return true;
  }

  if (config.mode === 'crud') {
    if (!config.gasUrl) throw new Error('URL Apps Script Web App tidak boleh kosong!');
    
    try {
      const response = await fetch(config.gasUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          action,
          sheetName: config.activeSheet,
          rowData,
          id: idValue
        })
      });
      
      const text = await response.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch (err) {
        throw new Error('Respons API tidak valid JSON.');
      }
      
      if (result && result.status === 'success') {
        // Log asynchronously
        logAction(config, action, config.activeSheet, rowData, idValue);
        return true;
      } else {
        throw new Error(result?.message || 'Aksi gagal dieksekusi di Spreadsheet.');
      }
    } catch (e: any) {
      console.error(e);
      throw new Error(`Gagal menyimpan perubahan: ${e.message}`);
    }
  }

  throw new Error('Mode saat ini tidak mendukung modifikasi data.');
}

// Google Apps Script template supporting the Satwa layout
export const GOOGLE_APPS_SCRIPT_CODE = `// Copy-paste kode ini ke Spreadsheet Anda (Extensions > Apps Script)
// Deploy sebagai Web App. Setel "Execute as: Me" dan "Who has access: Anyone".

function doGet(e) {
  var action = e.parameter.action || "read";
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  if (action === "dashboard") {
    var counts = {};
    var sheetNames = ["Satwa", "Medicine", "Blooddraw", "Weighing", "Blowhole_Sample", "Stomach_Sample", "Tubing", "Others", "Users", "Logs"];
    for (var i = 0; i < sheetNames.length; i++) {
      var name = sheetNames[i];
      var sheet = ss.getSheetByName(name);
      if (!sheet) {
        counts[name] = 0;
      } else {
        var dataRange = sheet.getDataRange();
        var data = dataRange.getValues();
        var count = 0;
        for (var r = 1; r < data.length; r++) {
          var hasRowData = false;
          for (var c = 0; c < data[r].length; c++) {
            if (data[r][c] !== "") {
              hasRowData = true;
              break;
            }
          }
          if (hasRowData) count++;
        }
        counts[name] = count;
      }
    }

    var avgWeight = "0 Kg";
    var weighingSheet = ss.getSheetByName("Weighing");
    if (weighingSheet) {
      var wData = weighingSheet.getDataRange().getValues();
      var wHeaders = wData[0];
      var heavyColIndex = wHeaders.indexOf("HEAVY");
      if (heavyColIndex !== -1) {
        var totalWeight = 0;
        var weightCount = 0;
        for (var r = 1; r < wData.length; r++) {
          var heavyStr = String(wData[r][heavyColIndex] || '');
          if (heavyStr) {
            var cleanStr = heavyStr.replace(',', '.').replace(/[^0-9.]/g, '');
            var num = parseFloat(cleanStr);
            if (!isNaN(num)) {
              totalWeight += num;
              weightCount++;
            }
          }
        }
        if (weightCount > 0) {
          var avg = totalWeight / weightCount;
          avgWeight = avg.toFixed(1).replace('.', ',') + ' Kg';
        }
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success", counts: counts, avgWeight: avgWeight }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  var sheetName = e.parameter.sheetName || "Satwa";
  var sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    setupDefaultHeaders(sheet, sheetName);
  }
  
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) {
    return ContentService.createTextOutput(JSON.stringify({ status: "success", data: [] }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  var headers = data[0];
  var rows = [];
  
  for (var i = 1; i < data.length; i++) {
    var row = {};
    var hasData = false;
    for (var j = 0; j < headers.length; j++) {
      var headerVal = headers[j];
      if (headerVal === "") continue;
      row[headerVal] = data[i][j];
      if (data[i][j] !== "") hasData = true;
    }
    if (hasData) {
      row["__rowNum__"] = i + 1;
      rows.push(row);
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({ status: "success", data: rows }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var postData = JSON.parse(e.postData.contents);
    var action = postData.action;
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    if (action === "initialize") {
      var datasets = postData.datasets;
      for (var name in datasets) {
        var targetSheet = ss.getSheetByName(name);
        if (!targetSheet) {
          targetSheet = ss.insertSheet(name);
          setupDefaultHeaders(targetSheet, name);
        }
        var values = targetSheet.getDataRange().getValues();
        if (values.length <= 1) {
          var rowsToInsert = datasets[name];
          var sheetHeaders = targetSheet.getDataRange().getValues()[0];
          for (var i = 0; i < rowsToInsert.length; i++) {
            var rowObj = rowsToInsert[i];
            var newRow = [];
            for (var h = 0; h < sheetHeaders.length; h++) {
              var header = sheetHeaders[h];
              newRow.push(rowObj[header] !== undefined ? rowObj[header] : "");
            }
            targetSheet.appendRow(newRow);
          }
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Basis data berhasil diinisialisasi" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    var sheetName = postData.sheetName || "Satwa";
    var rowData = postData.rowData;
    var sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      setupDefaultHeaders(sheet, sheetName);
    }
    
    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    
    if (action === "create") {
      var newRow = [];
      for (var i = 0; i < headers.length; i++) {
        var header = headers[i];
        newRow.push(rowData[header] !== undefined ? rowData[header] : "");
      }
      sheet.appendRow(newRow);
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Baris baru ditambahkan" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    var idKey = headers[0];
    var idValue = postData.id;
    
    if (!idValue) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "ID diperlukan untuk ubah/hapus" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    var rowIndex = -1;
    for (var r = 1; r < data.length; r++) {
      if (String(data[r][0]) === String(idValue)) {
        rowIndex = r + 1;
        break;
      }
    }
    
    if (rowIndex === -1) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Baris dengan ID " + idValue + " tidak ditemukan." }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (action === "update") {
      for (var c = 0; c < headers.length; c++) {
        var headerName = headers[c];
        if (rowData[headerName] !== undefined) {
          sheet.getRange(rowIndex, c + 1).setValue(rowData[headerName]);
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Data berhasil diperbarui" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (action === "delete") {
      sheet.deleteRow(rowIndex);
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Data berhasil dihapus" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Aksi tidak valid" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function setupDefaultHeaders(sheet, name) {
  var headersMap = {
    'Satwa': ['Nama Satwa', 'Species', 'Gambar', 'Jenis Kelamin', 'Kedatangan SBJ', 'Kedatangan TSI', 'Ekor (P) (cm)', 'Ekor (L) (cm)', 'Flipper (P) (cm)', 'Flipper (L) (cm)', 'Dorsal (L) (cm)', 'Dorsal (T) (cm)', 'P. Tubuh (cm)', 'P. Moncong (cm)', 'Ling. Badan (cm)', 'Status Kesehatan', 'Keterangan'],
    'Medicine': ['ID_medicine', 'NAMA SATWA', 'KATEGORI', 'NAME OF MEDICINE', 'START', 'STOP', 'NOTE'],
    'Blooddraw': ['ID_Blooddraw', 'NAMA SATWA', 'KATEGORI', 'DATE', 'DOCTOR', 'SUCCEEDED / FAILED'],
    'Weighing': ['ID_Weighning', 'NAMA SATWA', 'KATEGORI', 'DATE', 'HEAVY', 'NOTE'],
    'Blowhole_Sample': ['ID_Blowhole_Sample', 'NAMA SATWA', 'KATEGORI', 'DATE', 'DOCTOR'],
    'Stomach_Sample': ['ID_Stomach_Sample', 'NAMA SATWA', 'KATEGORI', 'DATE', 'DOCTOR', 'NOTE'],
    'Tubing': ['ID_Tubing', 'NAMA SATWA', 'KATEGORI', 'DATE', 'ML', 'NOTE'],
    'Others': ['ID_Others', 'NAMA SATWA', 'KATEGORI', 'DATE', 'INFORMATION'],
    'Users': ['Username', 'Password', 'Nama Lengkap', 'Role'],
    'Logs': ['ID_Log', 'Tanggal & Waktu', 'Pengguna', 'Aktivitas', 'Detail']
  };
  
  var headers = headersMap[name] || ["ID", "NAMA SATWA", "KATEGORI", "TANGGAL", "KETERANGAN"];
  sheet.appendRow(headers);
}
`;
