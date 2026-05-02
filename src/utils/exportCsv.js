export function exportProjectionCsv(rows) {
  const keys = Object.keys(rows[0] || {});
  const csv = [keys.join(','), ...rows.map((row) => keys.map((key) => JSON.stringify(row[key] ?? '')).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'net-worth-projection.csv';
  anchor.click();
  URL.revokeObjectURL(url);
}
