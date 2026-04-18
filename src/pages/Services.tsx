import React, { useEffect, useState } from 'react';
import { CalendarCheck, ChevronRight } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import Avatar from '../components/common/Avatar';
import Button from '../components/common/Button';
import { jobService } from '../services/jobService';
import { financialService } from '../services/financialService';
import { Summary, ServiceJob } from '../types';

const ServicesPage: React.FC = () => {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [services, setServices] = useState<ServiceJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sum, jobs] = await Promise.all([
          financialService.getSummary(),
          jobService.getServicesToday()
        ]);
        setSummary(sum);
        setServices(jobs);
      } catch (error) {
        console.error("Error fetching services data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !summary) {
    return <div className="loading-container">Carregando serviços...</div>;
  }

  return (
    <>
      <StatCard 
        label="Serviços Hoje"
        value={summary.servicesToday.value}
        subtext={summary.servicesToday.status}
        subtextType="status"
        icon={<CalendarCheck size={20} />}
        iconClass="icon-services"
      />

      <div className="list-grid">
        {services.map(service => (
          <div key={service.id} className="list-item">
            <Avatar initials={service.client.charAt(0)} />
            <div className="item-details">
              <span className="item-name">{service.client}</span>
              <span className="item-subtext">{service.vehicle}</span>
              <span className="item-subtext">{service.type}</span>
            </div>
            <Button 
              variant="action" 
              style={{ background: 'var(--primary-gold)' }}
            >
              {service.time} <ChevronRight size={14} />
            </Button>
          </div>
        ))}
      </div>
    </>
  );
};

export default ServicesPage;
