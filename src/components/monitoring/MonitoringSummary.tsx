import React from 'react';
import { Activity, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { MonitoringSummary as SummaryData } from '../../types/monitoring';

interface MonitoringSummaryProps {
  data: SummaryData;
}

const MonitoringSummary: React.FC<MonitoringSummaryProps> = ({ data }) => {
  return (
    <div className="dashboard-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
      
      <div className="stat-card" style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className="stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '1rem', borderRadius: '50%' }}>
          <Activity size={24} />
        </div>
        <div className="stat-details">
          <h3 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Eventos Hoje</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-dark)' }}>{data.eventosHoje}</p>
        </div>
      </div>

      <div className="stat-card" style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className="stat-icon" style={{ backgroundColor: 'rgba(234, 179, 8, 0.1)', color: '#eab308', padding: '1rem', borderRadius: '50%' }}>
          <Clock size={24} />
        </div>
        <div className="stat-details">
          <h3 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Em Execução</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-dark)' }}>{data.servicosEmExecucao}</p>
        </div>
      </div>

      <div className="stat-card" style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className="stat-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '50%' }}>
          <AlertTriangle size={24} />
        </div>
        <div className="stat-details">
          <h3 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Alertas Ativos</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-dark)' }}>{data.alertasAtivos}</p>
        </div>
      </div>

      <div className="stat-card" style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className="stat-icon" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '1rem', borderRadius: '50%' }}>
          <CheckCircle2 size={24} />
        </div>
        <div className="stat-details">
          <h3 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Concluídos Sensor</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-dark)' }}>{data.servicosFinalizadosSensor}</p>
        </div>
      </div>

    </div>
  );
};

export default MonitoringSummary;
