import { getLocalData } from './sheetSync';

export function exportAllToExcel() {
  const sheetNames = [
    'Satwa',
    'Medicine',
    'Blooddraw',
    'Weighing',
    'Blowhole_Sample',
    'Stomach_Sample',
    'Tubing',
    'Others'
  ];

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

  sheetNames.forEach(sheetName => {
    // Retrieve latest local storage or preset data
    const data = getLocalData(sheetName);
    const { headers, rows } = data;

    // Excel worksheet names must not exceed 31 characters
    // 'Blowhole_Sample' is 15 chars, which is perfectly safe.
    xml += `  <Worksheet ss:Name="${sheetName}">
    <Table>
`;

    // Headers Row
    if (headers.length > 0) {
      xml += `      <Row>\n`;
      headers.forEach(h => {
        const cleanH = escapeXml(String(h));
        xml += `        <Cell><Data ss:Type="String">${cleanH}</Data></Cell>\n`;
      });
      xml += `      </Row>\n`;
    }

    // Data Rows
    rows.forEach(row => {
      xml += `      <Row>\n`;
      headers.forEach(h => {
        const val = row[h] !== undefined ? row[h] : '';
        const cleanVal = escapeXml(String(val));
        
        // Detect numeric values for proper Excel cell types
        const isNum = !isNaN(Number(val)) && val !== '' && val !== '-';
        const type = isNum ? 'Number' : 'String';
        xml += `        <Cell><Data ss:Type="${type}">${cleanVal}</Data></Cell>\n`;
      });
      xml += `      </Row>\n`;
    });

    xml += `    </Table>
  </Worksheet>\n`;
  });

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
