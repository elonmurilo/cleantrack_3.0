import React, { useEffect, useState, useCallback } from 'react';
import { Activity, Plus } from 'lucide-react';
import { monitoringService } from '../../services/monitoringService';
import { MonitoringEventRow, MonitoringSummary as SummaryData } from '../../types/monitoring';
import MonitoringSummary from '../../components/monitoring/MonitoringSummary';
import SensorEventForm from '../../components/monitoring/SensorEventForm';
import Button from '../../components/common/Button';
import SensorEventList from '../../components/monitoring/SensorEventList';
import { useAuth } from '../../hooks/useAuth';

const MonitoringPage: React.FC = () => {
  const { profile } = useAuth();
  const [events, setEvents] = useState<MonitoringEventRow[]>([]);
  const [activeServices, setActiveServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [fetchedEvents, fetchedServices] = await Promise.all([
        monitoringService.fetchMonitoringEvents(),
        monitoringService.fetchActiveServices()
      ]);
      setEvents(fetchedEvents);
      setActiveServices(fetchedServices);
    } catch (err) {
      console.error('Erro ao carregar dados de monitoramento:', err);
      // Aqui poderíamos ter um toast de erro global, caso implementado no CleanTrack
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    // Poderíamos implementar polling aqui (ex: setInterval) se desejado no futuro.
  }, [loadData]);

  const handleCreateEvent = async (payload: any) => {
    if (!profile) return;
    
    setIsSubmitting(true);
    try {
      await monitoringService.createSensorEvent({
        ...payload,
        origem: 'simulado',
        created_by: profile.id
      });
      // Sucesso, recarrega os dados para mostrar na tabela e atualizar os cards
      await loadData();
    } catch (err) {
      console.error('Erro ao criar evento:', err);
      // Joga o erro para ser capturado e exibido pelo SensorEventForm
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calcular o resumo com base nos dados reais vindos da view
  const calculateSummary = (): SummaryData => {
    const hoje = new Date().toISOString().split('T')[0];
    
    const eventosHoje = events.filter(e => e.registrado_em.startsWith(hoje)).length;
    
    // Contar alertas ativos (apenas considerando os eventos recentes de alerta que não foram resolvidos - simplificação)
    const alertasAtivos = events.filter(e => 
      (e.tipo_evento === 'alerta_atraso' || e.tipo_evento === 'alerta_tempo_excedido') &&
      e.servico_status !== 'concluido' && e.servico_status !== 'cancelado'
    ).length;

    // Servicos finalizados por sensor
    const servicosFinalizadosSensor = events.filter(e => e.tipo_evento === 'servico_finalizado').length;

    return {
      eventosHoje,
      servicosEmExecucao: activeServices.filter(s => s.status === 'em_execucao').length,
      alertasAtivos,
      servicosFinalizadosSensor
    };
  };

  return (
    <div className="page-container">
      <header className="page-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '0.75rem', borderRadius: '8px', color: '#3b82f6' }}>
            <Activity size={28} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-dark)', margin: 0 }}>Monitoramento Inteligente</h1>
            <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>Acompanhe eventos de sensores e alertas em tempo real</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button onClick={() => setIsModalOpen(true)} style={{ whiteSpace: 'nowrap' }}>
            <Plus size={18} /> Novo Evento
          </Button>
        </div>
      </header>

      <div className="page-content">
        <MonitoringSummary data={calculateSummary()} />
        
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-dark)' }}>Últimos Eventos</h2>
          <SensorEventList events={events} isLoading={isLoading} />
        </div>

        <SensorEventForm 
          activeServices={activeServices} 
          onSubmit={handleCreateEvent} 
          isLoading={isSubmitting || isLoading} 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default MonitoringPage;
