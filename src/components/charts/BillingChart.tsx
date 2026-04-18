import React, { useState } from 'react';
import { BillingData } from '../../types';

interface BillingChartProps {
  data: BillingData[];
}

const BillingChart: React.FC<BillingChartProps> = ({ data }) => {
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number; visible: boolean }>({
    text: '', x: 0, y: 0, visible: false
  });

  const showTooltip = (e: React.MouseEvent, text: string) => {
    setTooltip({
      text,
      x: e.clientX,
      y: e.clientY - 30,
      visible: true
    });
  };

  const hideTooltip = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  return (
    <div className="chart-container">
      <h3 style={{ fontSize: '0.9rem', textAlign: 'center', marginBottom: '1.5rem', color: '#333' }}>
        Projeção de Faturamento Automotivo — 2026
      </h3>
      <div className="chart-bars">
        {data.map((item, index) => (
          <div key={index} className="bar-wrapper">
            <div 
              className="bar" 
              style={{ height: `${item.value / 3.5}%`, backgroundColor: item.color }}
              onMouseOver={(e) => showTooltip(e, `R$ ${item.value}M`)}
              onMouseOut={hideTooltip}
            ></div>
            <span className="bar-label">{item.month}</span>
          </div>
        ))}
      </div>
      <div className="chart-y-label" style={{ fontSize: '0.6rem', color: '#999', marginTop: '1.5rem' }}>
        Valor (R$ Milhões)
      </div>
      
      {tooltip.visible && (
        <div 
          className="chart-tooltip" 
          style={{ 
            opacity: 1, 
            left: `${tooltip.x}px`, 
            top: `${tooltip.y}px`,
            position: 'fixed' // Usando fixed para facilitar posicionamento global
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
};

export default BillingChart;
