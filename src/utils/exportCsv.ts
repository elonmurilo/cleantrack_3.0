export const exportToCsv = (filename: string, headers: string[], data: any[][]) => {
  // Configurar delimitador e BOM para Excel (pt-BR)
  const delimiter = ';';
  const BOM = '\uFEFF';

  // Processar o cabeçalho e as linhas escapando strings com aspas duplas, se houver o delimitador
  const processRow = (row: any[]) => {
    return row.map(item => {
      if (item === null || item === undefined) return '';
      const stringItem = String(item);
      // Se tiver ; ou quebra de linha ou " escapamos o texto em aspas e dobramos aspas internas
      if (stringItem.includes(delimiter) || stringItem.includes('\n') || stringItem.includes('"')) {
        return `"${stringItem.replace(/"/g, '""')}"`;
      }
      return stringItem;
    }).join(delimiter);
  };

  const csvContent = [
    processRow(headers),
    ...data.map(processRow)
  ].join('\n');

  // Adicionar o BOM ao conteúdo para forçar o Excel a ler como UTF-8
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Criar e forçar o download
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
