import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';
import { ServiceReportData } from '../../services/serviceReportService';

/* ── Cores do design system ────────────────────────────── */
const COLORS = {
  gold: '#EBB43F',
  goldDark: '#D4A030',
  goldLight: '#F7C96B',
  textDark: '#1D1D1F',
  textMuted: '#86868B',
  white: '#FFFFFF',
  lightBg: '#F5F5F7',
  border: '#E5E5E5',
  accentBlue: '#007AFF',
  accentGreen: '#34C759',
};

/* ── Estilos globais do PDF ────────────────────────────── */
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: COLORS.textDark,
    paddingTop: 80,
    paddingBottom: 50,
    paddingHorizontal: 35,
    backgroundColor: COLORS.white,
  },

  /* Header */
  header: {
    backgroundColor: COLORS.gold,
    borderRadius: 6,
    padding: 18,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'column',
  },
  headerCompany: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.white,
    marginBottom: 3,
  },
  headerSubtitle: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.85)',
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  headerRef: {
    fontSize: 8,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },

  /* Seções */
  section: {
    marginBottom: 10,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 6,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.white,
    backgroundColor: COLORS.textDark,
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  sectionBody: {
    padding: 12,
  },

  /* Linhas de dados */
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.textMuted,
    width: 130,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  value: {
    fontSize: 10,
    color: COLORS.textDark,
    flex: 1,
  },

  /* Grid de dados (2 colunas) */
  dataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dataGridItem: {
    width: '50%',
    paddingRight: 8,
    marginBottom: 6,
  },
  dataGridLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  dataGridValue: {
    fontSize: 10,
    color: COLORS.textDark,
  },

  /* Status badges */
  statusBadge: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },

  /* Valor em destaque */
  valueHighlight: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.goldDark,
  },

  /* Fotos */
  photoSection: {
    marginBottom: 8,
  },
  photoGroupTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.gold,
    backgroundColor: COLORS.lightBg,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  photoCard: {
    width: '48%',
    marginBottom: 10,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 6,
    overflow: 'hidden',
  },
  photoImage: {
    width: '100%',
    height: 150,
    objectFit: 'cover',
  },
  photoCaption: {
    fontSize: 8,
    color: COLORS.textMuted,
    padding: 6,
    backgroundColor: COLORS.lightBg,
    textAlign: 'center',
  },

  /* Observações */
  observacoes: {
    fontSize: 9,
    color: COLORS.textDark,
    backgroundColor: COLORS.lightBg,
    padding: 10,
    borderRadius: 4,
    marginTop: 4,
    lineHeight: 1.5,
  },

  /* Mensagem de ausência */
  emptyMessage: {
    fontSize: 9,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    padding: 12,
    textAlign: 'center',
  },

  /* Rodapé */
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 35,
    right: 35,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: `1px solid ${COLORS.border}`,
    paddingTop: 8,
  },
  footerText: {
    fontSize: 7,
    color: COLORS.textMuted,
  },

  /* Separador horizontal */
  divider: {
    borderBottom: `1px solid ${COLORS.border}`,
    marginVertical: 8,
  },
});

/* ── Helpers ───────────────────────────────────────────── */

const formatDateTime = (dateStr?: string | null): string => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatCurrency = (value?: number): string => {
  if (value === undefined || value === null) return '—';
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

const formatMinutes = (minutes?: number): string => {
  if (!minutes) return '—';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  return `${h}h ${m > 0 ? `${m}min` : ''}`.trim();
};

const getStatusLabel = (status: string): string => {
  const map: Record<string, string> = {
    aberto: 'Aberto',
    em_execucao: 'Em Execução',
    concluido: 'Concluído',
    cancelado: 'Cancelado',
    agendado: 'Agendado',
    finalizado: 'Finalizado',
  };
  return map[status] || status;
};

const getStatusColor = (status: string): { bg: string; text: string } => {
  const map: Record<string, { bg: string; text: string }> = {
    aberto: { bg: '#E1F3FF', text: '#007AFF' },
    em_execucao: { bg: '#FFF9E8', text: '#D4A030' },
    concluido: { bg: '#E1F9EB', text: '#34C759' },
    cancelado: { bg: '#FFEBEB', text: '#FF3B30' },
    agendado: { bg: '#E1F3FF', text: '#007AFF' },
    finalizado: { bg: '#E1F9EB', text: '#34C759' },
  };
  return map[status] || { bg: '#F0F0F0', text: '#666' };
};

const getVehicleTypeLabel = (tipo?: string): string => {
  if (tipo === 'moto') return 'Moto';
  return 'Carro';
};

const getPhotoTypeLabel = (tipo: string): string => {
  const map: Record<string, string> = {
    antes: 'Antes',
    depois: 'Depois',
    geral: 'Geral',
  };
  return map[tipo] || tipo;
};

/* ── DataField component ───────────────────────────────── */

const DataField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.dataGridItem}>
    <Text style={styles.dataGridLabel}>{label}</Text>
    <Text style={styles.dataGridValue}>{value}</Text>
  </View>
);

/* ── StatusBadge component ─────────────────────────────── */

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const colors = getStatusColor(status);
  return (
    <Text
      style={[
        styles.statusBadge,
        { backgroundColor: colors.bg, color: colors.text },
      ]}
    >
      {getStatusLabel(status)}
    </Text>
  );
};

/* ── Seção: Cliente ────────────────────────────────────── */

const ClienteSection: React.FC<{ data: ServiceReportData }> = ({ data }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Dados do Cliente</Text>
    <View style={styles.sectionBody}>
      <View style={styles.dataGrid}>
        <DataField label="Nome" value={data.cliente.nome} />
        <DataField label="Telefone" value={data.cliente.telefone || '—'} />
        <DataField label="E-mail" value={data.cliente.email || '—'} />
      </View>
    </View>
  </View>
);

/* ── Seção: Veículo ────────────────────────────────────── */

const VeiculoSection: React.FC<{ data: ServiceReportData }> = ({ data }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Dados do Veículo</Text>
    <View style={styles.sectionBody}>
      {data.veiculo ? (
        <View style={styles.dataGrid}>
          <DataField label="Tipo" value={getVehicleTypeLabel(data.veiculo.tipo_veiculo)} />
          <DataField label="Marca" value={data.veiculo.marca} />
          <DataField label="Modelo" value={data.veiculo.modelo} />
          <DataField label="Placa" value={data.veiculo.placa || '—'} />
          <DataField label="Cor" value={data.veiculo.cor || '—'} />
          <DataField label="Ano" value={data.veiculo.ano ? String(data.veiculo.ano) : '—'} />
        </View>
      ) : (
        <Text style={styles.emptyMessage}>Sem veículo vinculado.</Text>
      )}
    </View>
  </View>
);

/* ── Seção: Agendamento ────────────────────────────────── */

const AgendamentoSection: React.FC<{ data: ServiceReportData }> = ({ data }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Agendamento</Text>
    <View style={styles.sectionBody}>
      {data.agendamento ? (
        <>
          <View style={styles.dataGrid}>
            <DataField label="Título" value={data.agendamento.titulo} />
            <View style={styles.dataGridItem}>
              <Text style={styles.dataGridLabel}>STATUS</Text>
              <StatusBadge status={data.agendamento.status} />
            </View>
            <DataField label="Início Agendado" value={formatDateTime(data.agendamento.inicio_agendado)} />
            <DataField label="Fim Agendado" value={formatDateTime(data.agendamento.fim_agendado)} />
          </View>
          {data.agendamento.descricao_servico && (
            <>
              <View style={styles.divider} />
              <Text style={styles.dataGridLabel}>Descrição</Text>
              <Text style={styles.observacoes}>{data.agendamento.descricao_servico}</Text>
            </>
          )}
          {data.agendamento.observacoes && (
            <>
              <View style={styles.divider} />
              <Text style={styles.dataGridLabel}>Observações</Text>
              <Text style={styles.observacoes}>{data.agendamento.observacoes}</Text>
            </>
          )}
        </>
      ) : (
        <Text style={styles.emptyMessage}>Serviço sem agendamento vinculado.</Text>
      )}
    </View>
  </View>
);

/* ── Seção: Serviço Realizado ──────────────────────────── */

const ServicoSection: React.FC<{ data: ServiceReportData }> = ({ data }) => {
  const s = data.servico;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Serviço Realizado</Text>
      <View style={styles.sectionBody}>
        <View style={styles.dataGrid}>
          <DataField label="Título" value={s.titulo} />
          <View style={styles.dataGridItem}>
            <Text style={styles.dataGridLabel}>STATUS</Text>
            <StatusBadge status={s.status} />
          </View>
          <View style={styles.dataGridItem}>
            <Text style={styles.dataGridLabel}>VALOR COBRADO</Text>
            <Text style={styles.valueHighlight}>{formatCurrency(s.valor_cobrado)}</Text>
          </View>
          <DataField label="Tempo Estimado" value={formatMinutes(s.tempo_estimado_minutos)} />
          <DataField label="Tempo Real" value={formatMinutes(s.tempo_real_minutos)} />
          <DataField label="Início Realizado" value={formatDateTime(s.inicio_realizado_em)} />
          <DataField label="Fim Realizado" value={formatDateTime(s.fim_realizado_em)} />
        </View>

        {s.descricao_servico && (
          <>
            <View style={styles.divider} />
            <Text style={styles.dataGridLabel}>Descrição do Serviço</Text>
            <Text style={styles.observacoes}>{s.descricao_servico}</Text>
          </>
        )}

        {s.observacoes && (
          <>
            <View style={styles.divider} />
            <Text style={styles.dataGridLabel}>Observações</Text>
            <Text style={styles.observacoes}>{s.observacoes}</Text>
          </>
        )}
      </View>
    </View>
  );
};

/* ── Seção: Relatório Fotográfico ──────────────────────── */

const FotosSection: React.FC<{ data: ServiceReportData }> = ({ data }) => {
  if (data.fotos.length === 0) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Relatório Fotográfico</Text>
        <Text style={styles.emptyMessage}>Nenhuma foto registrada para este serviço.</Text>
      </View>
    );
  }

  // Agrupar por tipo: antes → depois → geral
  const grouped: Record<string, typeof data.fotos> = {
    antes: [],
    depois: [],
    geral: [],
  };

  data.fotos.forEach((foto) => {
    const key = foto.tipo in grouped ? foto.tipo : 'geral';
    grouped[key].push(foto);
  });

  const groups = (['antes', 'depois', 'geral'] as const).filter(
    (key) => grouped[key].length > 0
  );

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Relatório Fotográfico</Text>
      <View style={styles.sectionBody}>
        {groups.map((groupKey) => (
          <View key={groupKey} style={styles.photoSection}>
            <Text style={styles.photoGroupTitle}>
              {getPhotoTypeLabel(groupKey)} ({grouped[groupKey].length})
            </Text>
            <View style={styles.photoGrid}>
              {grouped[groupKey].map((foto) => (
                <View key={foto.id} style={styles.photoCard} wrap={false}>
                  <Image src={foto.signedUrl} style={styles.photoImage} />
                  <Text style={styles.photoCaption}>
                    {foto.legenda || getPhotoTypeLabel(foto.tipo)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

/* ── Documento Principal ───────────────────────────────── */

interface ServiceReportPdfProps {
  data: ServiceReportData;
}

const ServiceReportPdf: React.FC<ServiceReportPdfProps> = ({ data }) => {
  const emissao = formatDateTime(data.geradoEm);
  const refId = data.servico.id.slice(0, 8).toUpperCase();

  return (
    <Document
      title={`Relatório de Serviço - ${data.cliente.nome}`}
      author={data.empresa.nome_empresa}
      subject="Relatório de Serviço Realizado"
      creator="CleanTrack 3.0"
    >
      <Page size="A4" style={styles.page} wrap>
        {/* Cabeçalho */}
        <View style={styles.header} fixed>
          <View style={styles.headerLeft}>
            <Text style={styles.headerCompany}>{data.empresa.nome_empresa}</Text>
            <Text style={styles.headerSubtitle}>Relatório de Serviço Realizado</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={[styles.headerSubtitle, { textAlign: 'right' }]}>
              Emitido em: {emissao}
            </Text>
            <Text style={styles.headerRef}>REF: {refId}</Text>
          </View>
        </View>

        {/* Seções de dados */}
        <ClienteSection data={data} />
        <VeiculoSection data={data} />
        <AgendamentoSection data={data} />
        <ServicoSection data={data} />

        {/* Relatório fotográfico — flui na mesma página se houver espaço */}
        <FotosSection data={data} />

        {/* Rodapé */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            {data.empresa.nome_empresa} — Relatório gerado automaticamente pelo CleanTrack 3.0
          </Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) => `Página ${pageNumber} / ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
};

export default ServiceReportPdf;
