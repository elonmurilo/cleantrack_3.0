import React from 'react';
import Card from '../common/Card';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  subtextType?: 'growth' | 'status';
  icon: React.ReactNode;
  iconClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, subtext, subtextType, icon, iconClass }) => {
  return (
    <Card>
      <div className="card-info">
        <span className="card-label">{label}</span>
        <span className="card-value">{value}</span>
        {subtext && (
          <span className={subtextType === 'growth' ? 'card-growth' : 'card-status'}>
            {subtext}
          </span>
        )}
      </div>
      <div className={`card-icon ${iconClass}`}>
        {icon}
      </div>
    </Card>
  );
};

export default StatCard;
