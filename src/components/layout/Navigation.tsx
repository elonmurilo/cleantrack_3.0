import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarCheck, Briefcase, DollarSign, LogOut } from 'lucide-react';

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ isOpen, onClose, onLogout }) => {
  return (
    <nav id="floating-menu" className={isOpen ? '' : 'hidden'}>
      <ul>
        <li>
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => isActive ? 'active' : ''}
            onClick={onClose}
          >
            <LayoutDashboard size={20} /> Home
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/clientes" 
            className={({ isActive }) => isActive ? 'active' : ''}
            onClick={onClose}
          >
            <Users size={20} /> Clientes
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/agendamentos" 
            className={({ isActive }) => isActive ? 'active' : ''}
            onClick={onClose}
          >
            <CalendarCheck size={20} /> Agenda
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/servicos-realizados" 
            className={({ isActive }) => isActive ? 'active' : ''}
            onClick={onClose}
          >
            <Briefcase size={20} /> Serviços
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/faturamento" 
            className={({ isActive }) => isActive ? 'active' : ''}
            onClick={onClose}
          >
            <DollarSign size={20} /> Faturamento
          </NavLink>
        </li>
        <li id="logout-btn" className="logout-item" onClick={onLogout}>
          <LogOut size={20} /> Sair
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
