import React, { useEffect, useState } from 'react';
import { Users, ChevronRight } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import Avatar from '../components/common/Avatar';
import Button from '../components/common/Button';
import { clientService } from '../services/clientService';
import { financialService } from '../services/financialService';
import { Summary, Client } from '../types';

const Clients: React.FC = () => {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sum, allClients] = await Promise.all([
          financialService.getSummary(),
          clientService.getClients()
        ]);
        setSummary(sum);
        setClients(allClients);
      } catch (error) {
        console.error("Error fetching clients data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !summary) {
    return <div className="loading-container">Carregando clientes...</div>;
  }

  return (
    <>
      <StatCard 
        label="Total de Clientes"
        value={summary.totalClients.value}
        subtext={summary.totalClients.growth}
        subtextType="growth"
        icon={<Users size={20} />}
        iconClass="icon-clients"
      />

      <div className="list-grid">
        {clients.map(client => (
          <div key={client.id} className="list-item">
            <Avatar initials={client.initials} color={client.color} />
            <div className="item-details">
              <span className="item-name">{client.name}</span>
              <span className="item-subtext">{client.vehicle}</span>
              <span className="item-subtext">{client.lastVisit}</span>
            </div>
            <Button 
              variant="action" 
              onClick={() => alert(`Agendando para ${client.name}...`)}
            >
              Agendar <ChevronRight size={14} />
            </Button>
          </div>
        ))}
      </div>
    </>
  );
};

export default Clients;
