import { serviceRecordService } from './serviceRecordService';
import { clientService } from './clientService';
import { vehicleService } from './vehicleService';
import { appointmentService } from './appointmentService';
import { servicePhotoService } from './servicePhotoService';
import { settingsService } from './settingsService';
import { ServiceRecord } from '../types/serviceRecord';
import { Cliente } from '../types/client';
import { ClientVehicle } from '../types/vehicle';
import { Appointment } from '../types/appointment';
import { ServicePhoto } from '../types/servicePhoto';
import { SystemSettings } from '../types/settings';

/**
 * Foto com signed URL resolvida para uso no PDF.
 */
export interface ReportPhoto extends ServicePhoto {
  signedUrl: string;
}

/**
 * Estrutura consolidada com todos os dados necessários para gerar o PDF.
 */
export interface ServiceReportData {
  empresa: SystemSettings;
  servico: ServiceRecord;
  cliente: Cliente;
  veiculo: ClientVehicle | null;
  agendamento: Appointment | null;
  fotos: ReportPhoto[];
  geradoEm: string;
}

/**
 * Sanitiza string para uso em nome de arquivo.
 * Remove acentos, caracteres especiais, converte espaços em hífens, lowercase.
 */
const sanitizeFileName = (str: string): string => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-zA-Z0-9\s-]/g, '') // remove caracteres especiais
    .replace(/\s+/g, '-') // espaços → hífens
    .toLowerCase()
    .replace(/-+/g, '-') // múltiplos hífens → um
    .replace(/^-|-$/g, ''); // remove hífens nas pontas
};

export const serviceReportService = {
  /**
   * Busca e consolida todos os dados necessários para o relatório PDF.
   */
  getServiceReportData: async (serviceId: string): Promise<ServiceReportData> => {
    // 1. Buscar serviço realizado
    const servico = await serviceRecordService.getServiceRecordById(serviceId);

    // 2. Buscar dados completos em paralelo
    const [empresa, cliente, veiculo, agendamento, todasMidias] = await Promise.all([
      // Configurações da empresa
      settingsService.getSettings().catch((err) => {
        console.warn('[Relatório] Erro ao buscar configurações da empresa:', err);
        return null;
      }),

      // Cliente completo (com telefone, email)
      clientService.getClientById(servico.cliente_id),

      // Veículo completo (com cor, ano) — pode não existir
      servico.veiculo_id
        ? vehicleService.getVehicleById(servico.veiculo_id).catch((err) => {
            console.warn('[Relatório] Erro ao buscar veículo:', err);
            return null;
          })
        : Promise.resolve(null),

      // Agendamento — pode não existir
      servico.agendamento_id
        ? appointmentService.getAppointmentById(servico.agendamento_id).catch((err) => {
            console.warn('[Relatório] Erro ao buscar agendamento:', err);
            return null;
          })
        : Promise.resolve(null),

      // Todas as mídias ativas do serviço
      servicePhotoService.listPhotosByService(serviceId),
    ]);

    // 3. Filtrar apenas fotos (ignorar vídeos)
    const fotosAtivas = todasMidias.filter(
      (m) => m.tipo_midia === 'foto' && m.ativo
    );

    // 4. Gerar signed URLs para cada foto
    const fotos: ReportPhoto[] = await Promise.all(
      fotosAtivas.map(async (foto) => {
        try {
          const signedUrl = await servicePhotoService.getMediaSignedUrl(
            foto.caminho_arquivo,
            foto.bucket
          );
          return { ...foto, signedUrl };
        } catch (err) {
          console.warn(`[Relatório] Erro ao gerar signed URL para foto ${foto.id}:`, err);
          return { ...foto, signedUrl: '' };
        }
      })
    );

    // 5. Filtrar fotos com URL válida
    const fotosComUrl = fotos.filter((f) => f.signedUrl !== '');

    // 6. Usar settings padrão se não conseguiu buscar
    const empresaFinal = empresa || ({
      nome_empresa: 'CleanTrack',
      telefone_empresa: null,
      email_empresa: null,
    } as SystemSettings);

    return {
      empresa: empresaFinal,
      servico,
      cliente,
      veiculo,
      agendamento,
      fotos: fotosComUrl,
      geradoEm: new Date().toISOString(),
    };
  },

  /**
   * Gera nome amigável e sanitizado para o arquivo PDF.
   * Formato: relatorio-servico-{YYYY-MM-DD}-{nome-cliente}.pdf
   */
  generateFileName: (clienteNome: string): string => {
    const dataFormatada = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const nomeSanitizado = sanitizeFileName(clienteNome);
    return `relatorio-servico-${dataFormatada}-${nomeSanitizado}.pdf`;
  },
};
