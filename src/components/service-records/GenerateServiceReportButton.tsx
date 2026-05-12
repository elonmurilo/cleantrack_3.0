import React, { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { FileText, Loader2 } from 'lucide-react';
import Button from '../common/Button';
import ServiceReportPdf from './ServiceReportPdf';
import { serviceReportService } from '../../services/serviceReportService';

interface GenerateServiceReportButtonProps {
  serviceId: string;
}

const GenerateServiceReportButton: React.FC<GenerateServiceReportButtonProps> = ({ serviceId }) => {
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      // 1. Buscar dados consolidados
      const data = await serviceReportService.getServiceReportData(serviceId);

      // 2. Gerar blob do PDF
      const blob = await pdf(<ServiceReportPdf data={data} />).toBlob();

      // 3. Gerar nome do arquivo
      const fileName = serviceReportService.generateFileName(data.cliente.nome);

      // 4. Disparar download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);

    } catch (error: any) {
      console.error('[Relatório PDF] Erro ao gerar relatório:', error);
      const msg = error?.message || 'Erro desconhecido ao gerar relatório.';
      alert(`Erro ao gerar relatório PDF: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="action"
      onClick={handleGenerate}
      disabled={loading}
      title={loading ? 'Gerando relatório...' : 'Gerar relatório PDF'}
      style={{
        backgroundColor: 'transparent',
        color: '#EBB43F',
        border: '1px solid #FFF9E8',
        padding: '0.4rem',
        opacity: loading ? 0.6 : 1,
        cursor: loading ? 'not-allowed' : 'pointer',
      }}
    >
      {loading ? (
        <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
      ) : (
        <FileText size={16} />
      )}
    </Button>
  );
};

export default GenerateServiceReportButton;
