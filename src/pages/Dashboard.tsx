import React, { useEffect, useState } from 'react';
import { Users, CalendarCheck, DollarSign, ChevronRight } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import Avatar from '../components/common/Avatar';
import Button from '../components/common/Button';
import { financialService } from '../services/financialService';
import { clientService } from '../services/clientService';
import { Summary } from '../types';
import { Cliente } from '../types/client';

const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [recentClients, setRecentClients] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sum, clients] = await Promise.all([
          financialService.getSummary(),
          clientService.getRecentClients(3)
        ]);
        setSummary(sum);
        setRecentClients(clients);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  if (loading || !summary) {
    return <div className="loading-container">Carregando painel...</div>;
  }

  return (
    <>
      <div className="dashboard-grid">
        <StatCard 
          label="Total de Clientes"
          value={summary.totalClients.value}
          subtext={summary.totalClients.growth}
          subtextType="growth"
          icon={<Users size={20} />}
          iconClass="icon-clients"
        />
        <StatCard 
          label="Serviços Hoje"
          value={summary.servicesToday.value}
          subtext={summary.servicesToday.status}
          subtextType="status"
          icon={<CalendarCheck size={20} />}
          iconClass="icon-services"
        />
        <StatCard 
          label="Faturamento Mensal"
          value={summary.monthlyBilling.value}
          subtext={summary.monthlyBilling.growth}
          subtextType="growth"
          icon={<DollarSign size={20} />}
          iconClass="icon-billing"
        />
      </div>

      <h3 className="section-title">Clientes Recentes</h3>
      <div className="list-container">
        {recentClients.map(client => (
          <div key={client.id} className="list-item">
            <Avatar 
              initials={getInitials(client.nome)} 
              color="#EBB43F" 
            />
            <div className="item-details">
              <span className="item-name">{client.nome}</span>
              <span className="item-subtext">{client.telefone}</span>
              <span className="item-subtext">{client.email || 'Sem e-mail'}</span>
            </div>
            <Button 
              variant="action" 
              onClick={() => alert(`Agendando para ${client.nome}...`)}
            >
              Agendar <ChevronRight size={14} />
            </Button>
          </div>
        ))}
      </div>
    </>
  );
};

export default Dashboard;
