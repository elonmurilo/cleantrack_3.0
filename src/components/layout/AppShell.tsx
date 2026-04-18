import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import Navigation from './Navigation';
import { authService } from '../../services/authService';
import { User } from '../../types';

const AppShell: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  useEffect(() => {
    // Esconder menu ao mudar de rota
    setIsMenuOpen(false);
  }, [location]);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return `Olá, ${user?.name || ''}`;
    if (path.includes('clientes')) return 'Clientes';
    if (path.includes('servicos')) return 'Serviços';
    if (path.includes('faturamento')) return 'Faturamento';
    return 'CleanTrack';
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    if (window.confirm('Deseja realmente sair?')) {
      await authService.logout();
      navigate('/login');
    }
  };

  useEffect(() => {
    const closeMenu = () => setIsMenuOpen(false);
    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, []);

  return (
    <div id="app-shell" className="screen">
      <Header 
        title={getPageTitle()} 
        user={user} 
        onMenuToggle={handleMenuToggle} 
      />
      
      <Navigation 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        onLogout={handleLogout} 
      />

      <main id="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AppShell;
