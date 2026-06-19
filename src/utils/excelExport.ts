import { INITIAL_DATASETS, fetchSheetData } from './sheetSync';
import type { SheetConfig } from './sheetSync';

const DATA_SHEET_NAMES = [
  'Satwa',
  'Medicine',
  'Blooddraw',
  'Weighing',
  'Blowhole_Sample',
  'Stomach_Sample',
  'Tubing',
  'Others'
];

/**
 * Fetch all sheet data and produce an Excel (SpreadsheetML) download.
 * Works in all three modes: demo (INITIAL_DATASETS), csv (INITIAL_DATASETS fallback),
 * and crud (fetches live data from the GAS server).
 * All date columns are normalised to "dd MMMM yyyy" (Indonesian) format.
 */
export async function exportAllToExcel(config?: SheetConfig): Promise<void> {
  let xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
          xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:x="urn:schemas-microsoft-com:office:excel"
          xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
          xmlns:html="http://www.w3.org/TR/REC-html40">
  <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
    <Author>BSMP App</Author>
    <Created>${new Date().toISOString()}</Created>
  </DocumentProperties>
`;

  for (const sheetName of DATA_SHEET_NAMES) {
    let data: { headers: string[]; rows: Record<string, any>[] };

    if (config && config.mode === 'crud') {
      try {
        data = await fetchSheetData({ ...config, activeSheet: sheetName });
      } catch (e) {
        // Fallback ke INITIAL_DATASETS jika server gagal
        console.warn(`Failed to fetch ${sheetName} from server, using preset data.`, e);
        data = INITIAL_DATASETS[sheetName] || { headers: [], rows: [] };
      }
    } else {
      // demo & csv mode: gunakan INITIAL_DATASETS
      data = INITIAL_DATASETS[sheetName] || { headers: [], rows: [] };
    }

    const { headers, rows } = data;

    // Excel worksheet names must not exceed 31 characters
    xml += `  <Worksheet ss:Name="${escapeXml(sheetName)}">
    <Table>
`;

    // Header row
    if (headers.length > 0) {
      xml += `      <Row>\n`;
      headers.forEach(h => {
        const cleanH = escapeXml(String(h));
        xml += `        <Cell><Data ss:Type="String">${cleanH}</Data></Cell>\n`;
      });
      xml += `      </Row>\n`;
    }

    // Data rows
    rows.forEach(row => {
      xml += `      <Row>\n`;
      headers.forEach(h => {
        const val = row[h] !== undefined ? row[h] : '';
        // Format date columns as "dd MMMM yyyy" Indonesian
        const isDateHeader = isDateColumn(h);
        const displayVal = isDateHeader
          ? formatDateIndonesianExport(String(val))
          : String(val);
        const cleanVal = escapeXml(displayVal);

        // Only treat as Number if it's not a date column and is a plain number
        const isNum = !isDateHeader && !isNaN(Number(val)) && val !== '' && val !== '-';
        const type = isNum ? 'Number' : 'String';
        xml += `        <Cell><Data ss:Type="${type}">${cleanVal}</Data></Cell>\n`;
      });
      xml += `      </Row>\n`;
    });

    xml += `    </Table>
  </Worksheet>\n`;
  }

  xml += `</Workbook>`;

  // Create Blob and trigger download
  const blob = new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `BSMP_Export_${new Date().toISOString().slice(0, 10)}.xls`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ─── Date helpers ─── */

/** Headers that contain date values (case-insensitive check) */
function isDateColumn(header: string): boolean {
  const h = header.toUpperCase();
  return (
    h === 'DATE' ||
    h === 'START' ||
    h === 'STOP' ||
    h.includes('TANGGAL') ||
    h.includes('KEDATANGAN')
  );
}

const INDONESIAN_MONTHS_EXPORT = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const MONTHS_MAP_EXPORT: Record<string, number> = {
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

function padD(n: number): string { return n < 10 ? `0${n}` : `${n}`; }

/** Convert any date value to "dd MMMM yyyy" Indonesian for Excel export */
function formatDateIndonesianExport(val: string): string {
  if (!val || val === '-' || val === 'null' || val.trim() === '') return val;
  const clean = val.trim();

  // 1. "dd MonthName yyyy" – already has a word month name
  const parts = clean.split(/\s+/);
  if (parts.length === 3) {
    const d = parseInt(parts[0], 10);
    const mName = parts[1].toLowerCase();
    const y = parseInt(parts[2], 10);
    if (!isNaN(d) && !isNaN(y) && y > 1900 && y < 2100) {
      const mIdx = MONTHS_MAP_EXPORT[mName];
      if (mIdx !== undefined) {
        return `${padD(d)} ${INDONESIAN_MONTHS_EXPORT[mIdx]} ${y}`;
      }
    }
  }

  // 2. "dd/mm/yyyy" or "dd-mm-yyyy"
  const dmyMatch = clean.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (dmyMatch) {
    const d = parseInt(dmyMatch[1], 10);
    const m = parseInt(dmyMatch[2], 10) - 1;
    const y = parseInt(dmyMatch[3], 10);
    if (m >= 0 && m < 12) return `${padD(d)} ${INDONESIAN_MONTHS_EXPORT[m]} ${y}`;
  }

  // 3. "yyyy-mm-dd"
  const ymdMatch = clean.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (ymdMatch) {
    const y = parseInt(ymdMatch[1], 10);
    const m = parseInt(ymdMatch[2], 10) - 1;
    const d = parseInt(ymdMatch[3], 10);
    if (m >= 0 && m < 12) return `${padD(d)} ${INDONESIAN_MONTHS_EXPORT[m]} ${y}`;
  }

  // 4. JS Date fallback
  const parsed = new Date(clean);
  if (!isNaN(parsed.getTime())) {
    return `${padD(parsed.getDate())} ${INDONESIAN_MONTHS_EXPORT[parsed.getMonth()]} ${parsed.getFullYear()}`;
  }

  return clean;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
