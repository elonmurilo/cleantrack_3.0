import React, { useEffect, useState } from 'react';
import { DollarSign } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import BillingChart from '../components/charts/BillingChart';
import { financialService } from '../services/financialService';
import { Summary, BillingData } from '../types';

const Billing: React.FC = () => {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [chartData, setChartData] = useState<BillingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sum, chart] = await Promise.all([
          financialService.getSummary(),
          financialService.getBillingChartData()
        ]);
        setSummary(sum);
        setChartData(chart);
      } catch (error) {
        console.error("Error fetching billing data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !summary) {
    return <div className="loading-container">Carregando faturamento...</div>;
  }

  return (
    <>
      <div className="dashboard-grid">
        <StatCard 
          label="Faturamento Mensal"
          value={summary.monthlyBilling.value}
          subtext={summary.monthlyBilling.growth}
          subtextType="growth"
          icon={<DollarSign size={20} />}
          iconClass="icon-billing"
        />
        <StatCard 
          label="Mês Anterior"
          value={String(summary.lastMonthBilling.value).replace('R$ ', '')}
          subtext={summary.lastMonthBilling.growth}
          subtextType="growth"
          icon={<DollarSign size={20} />}
          iconClass="icon-billing"
        />
      </div>

      <BillingChart data={chartData} />
    </>
  );
};

export default Billing;
