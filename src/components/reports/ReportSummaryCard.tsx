import React from 'react';

interface ReportSummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: 'primary' | 'success' | 'danger' | 'warning' | 'info';
}

const ReportSummaryCard: React.FC<ReportSummaryCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon,
  color = 'primary'
}) => {
  const getColorVar = () => {
    switch (color) {
      case 'success': return 'var(--success-color)';
      case 'danger': return 'var(--danger-color)';
      case 'warning': return 'var(--warning-color)';
      case 'info': return '#38bdf8';
      case 'primary':
      default: return 'var(--primary-color)';
    }
  };

  const bgStyle = {
    backgroundColor: `color-mix(in srgb, ${getColorVar()} 10%, transparent)`
  };

  return (
    <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: getColorVar() }}></div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>{title}</h4>
        {icon && <div style={{ color: getColorVar(), ...bgStyle, padding: '0.5rem', borderRadius: '8px' }}>{icon}</div>}
      </div>
      <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-color)' }}>
        {value}
      </div>
      {subtitle && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{subtitle}</div>}
    </div>
  );
};

export default ReportSummaryCard;
