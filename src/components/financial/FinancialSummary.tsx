import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Clock } from 'lucide-react';
import StatCard from '../dashboard/StatCard';
import { FinancialSummaryData } from '../../types/financial';

interface FinancialSummaryProps {
  summary: FinancialSummaryData;
}

const FinancialSummary: React.FC<FinancialSummaryProps> = ({ summary }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="dashboard-grid">
      <StatCard 
        label="Entradas (Pagas)"
        value={formatCurrency(summary.totalEntradas)}
        icon={<TrendingUp size={20} />}
        iconClass="icon-billing"
      />
      <StatCard 
        label="Saídas (Pagas)"
        value={formatCurrency(summary.totalSaidas)}
        icon={<TrendingDown size={20} />}
        iconClass="icon-billing"
      />
      <StatCard 
        label="Saldo Atual"
        value={formatCurrency(summary.saldo)}
        icon={<DollarSign size={20} />}
        iconClass="icon-billing"
      />
      <StatCard 
        label="Pendentes"
        value={formatCurrency(summary.pendencias)}
        icon={<Clock size={20} />}
        iconClass="icon-billing"
      />
    </div>
  );
};

export default FinancialSummary;
