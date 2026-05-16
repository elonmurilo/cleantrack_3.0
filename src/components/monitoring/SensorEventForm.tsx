import React, { useState } from 'react';
import { X } from 'lucide-react';
import { SensorEventType, EVENT_TYPE_LABELS } from '../../types/monitoring';
import Button from '../common/Button';

interface ServiceOption {
  id: string;
  titulo: string;
  cliente: string;
  placa: string;
  status: string;
}

interface SensorEventFormProps {
  activeServices: ServiceOption[];
  onSubmit: (payload: { servico_realizado_id: string; tipo_evento: SensorEventType; descricao: string; valor: string }) => Promise<void>;
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const EVENT_TYPES: SensorEventType[] = [
  'entrada_detectada',
  'lavagem_iniciada',
  'lavagem_finalizada',
  'acabamento_iniciado',
  'acabamento_finalizado',
  'servico_finalizado',
  'alerta_atraso',
  'alerta_tempo_excedido'
];

const SensorEventForm: React.FC<SensorEventFormProps> = ({ activeServices, onSubmit, isLoading, isOpen, onClose }) => {
  const [servicoId, setServicoId] = useState('');
  const [tipoEvento, setTipoEvento] = useState<SensorEventType | ''>('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!servicoId || !tipoEvento) {
      setError('Serviço e Tipo de Evento são obrigatórios.');
      return;
    }

    try {
      await onSubmit({
        servico_realizado_id: servicoId,
        tipo_evento: tipoEvento as SensorEventType,
        descricao,
        valor
      });
      // Limpa após sucesso
      setTipoEvento('');
      setDescricao('');
      setValor('');
      onClose(); // Fechar o modal em caso de sucesso
    } catch (err: any) {
      setError(err.message || 'Erro ao registrar evento simulado.');
    }
  };

  React.useEffect(() => {
    console.log('SensorEventForm recebeu activeServices:', activeServices);
  }, [activeServices]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-2xl" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Registrar Evento Simulado</h2>
          <button className="btn-close" onClick={onClose} aria-label="Fechar modal">
            <X size={20} />
          </button>
        </div>
        
        {error && (
          <div style={{ padding: '0.75rem', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '4px', margin: '1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-grid">
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-dark)' }}>Serviço Ativo *</label>
            <select
              className="form-control"
              value={servicoId}
              onChange={(e) => setServicoId(e.target.value)}
              disabled={isLoading || activeServices.length === 0}
              required
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
            >
              <option value="">
                {activeServices.length === 0 && !isLoading 
                  ? 'Nenhum serviço em execução encontrado' 
                  : 'Selecione um serviço...'}
              </option>
              {activeServices.map(svc => (
                <option key={svc.id} value={svc.id}>
                  {svc.titulo} - {svc.cliente} ({svc.placa}) [{svc.status}]
                </option>
              ))}
            </select>
            {activeServices.length === 0 && !isLoading && (
              <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#b91c1c' }}>
                Não há serviços com status "aberto" ou "em_execucao" para registrar eventos.
              </p>
            )}
          </div>

          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-dark)' }}>Tipo de Evento *</label>
            <select
              className="form-control"
              value={tipoEvento}
              onChange={(e) => setTipoEvento(e.target.value as SensorEventType)}
              disabled={isLoading}
              required
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
            >
              <option value="">Selecione...</option>
              {EVENT_TYPES.map(type => (
                <option key={type} value={type}>
                  {EVENT_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
            </div>
          </div>

          <div className="form-grid" style={{ marginTop: '1rem' }}>
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-dark)' }}>Valor / Leitura (Opcional)</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ex: 30%, 12kg, OK..."
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              disabled={isLoading}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
            />
          </div>
          
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-dark)' }}>Descrição (Opcional)</label>
            <input
              type="text"
              className="form-control"
              placeholder="Observação adicional"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              disabled={isLoading}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
            />
            </div>
          </div>

          <div className="modal-footer mt-6">
            <Button type="button" variant="action" onClick={onClose} disabled={isLoading} style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-dark)' }}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || !servicoId || !tipoEvento}>
              {isLoading ? 'Registrando...' : 'Registrar Evento'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SensorEventForm;
