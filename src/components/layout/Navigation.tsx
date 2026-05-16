import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarCheck, Briefcase, DollarSign, LogOut, Settings, UserCog, BarChart, Activity } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { hasPermission } from '../../config/permissions';

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ isOpen, onClose, onLogout }) => {
  const { profile } = useAuth();
  const role = profile?.papel;

  return (
    <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header" style={{ padding: '2rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-dark)' }}>
          Clean<span style={{ color: 'var(--primary-gold)' }}>Track</span>
        </h1>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Sistema de Gestão v3.0</p>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {hasPermission(role, 'dashboard') && (
            <li>
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => isActive ? 'active' : ''}
                onClick={onClose}
              >
                <LayoutDashboard size={20} /> Home
              </NavLink>
            </li>
          )}
          {hasPermission(role, 'clientes') && (
            <li>
              <NavLink 
                to="/clientes" 
                className={({ isActive }) => isActive ? 'active' : ''}
                onClick={onClose}
              >
                <Users size={20} /> Clientes
              </NavLink>
            </li>
          )}
          {hasPermission(role, 'agendamentos') && (
            <li>
              <NavLink 
                to="/agendamentos" 
                className={({ isActive }) => isActive ? 'active' : ''}
                onClick={onClose}
              >
                <CalendarCheck size={20} /> Agenda
              </NavLink>
            </li>
          )}
          {hasPermission(role, 'servicos') && (
            <li>
              <NavLink 
                to="/servicos-realizados" 
                className={({ isActive }) => isActive ? 'active' : ''}
                onClick={onClose}
              >
                <Briefcase size={20} /> Serviços
              </NavLink>
            </li>
          )}
          {hasPermission(role, 'monitoramento') && (
            <li>
              <NavLink 
                to="/monitoramento" 
                className={({ isActive }) => isActive ? 'active' : ''}
                onClick={onClose}
              >
                <Activity size={20} /> Monitoramento
              </NavLink>
            </li>
          )}
          {hasPermission(role, 'financeiro') && (
            <li>
              <NavLink 
                to="/faturamento" 
                className={({ isActive }) => isActive ? 'active' : ''}
                onClick={onClose}
              >
                <DollarSign size={20} /> Faturamento
              </NavLink>
            </li>
          )}
          {hasPermission(role, 'relatorios') && (
            <li>
              <NavLink 
                to="/relatorios" 
                className={({ isActive }) => isActive ? 'active' : ''}
                onClick={onClose}
              >
                <BarChart size={20} /> Relatórios
              </NavLink>
            </li>
          )}
          {hasPermission(role, 'usuarios') && (
            <li>
              <NavLink 
                to="/usuarios" 
                className={({ isActive }) => isActive ? 'active' : ''}
                onClick={onClose}
              >
                <UserCog size={20} /> Usuários
              </NavLink>
            </li>
          )}
          {hasPermission(role, 'configuracoes') && (
            <li>
              <NavLink 
                to="/configuracoes" 
                className={({ isActive }) => isActive ? 'active' : ''}
                onClick={onClose}
              >
                <Settings size={20} /> Configurações
              </NavLink>
            </li>
          )}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="logout-item" onClick={onLogout}>
          <LogOut size={20} /> Sair do Sistema
        </div>
      </div>
    </aside>
  );
};

export default Navigation;
