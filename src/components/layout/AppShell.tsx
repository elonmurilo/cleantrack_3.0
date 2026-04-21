import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import Navigation from './Navigation';
import { useAuth } from '../../hooks/useAuth';

const AppShell: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Esconder menu ao mudar de rota
    setIsMenuOpen(false);
  }, [location]);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return `Olá, ${profile?.nome || ''}`;
    if (path.includes('clientes')) return 'Clientes';
    if (path.includes('agendamentos')) return 'Agenda';
    if (path.includes('faturamento')) return 'Faturamento';
    return 'CleanTrack';
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    if (window.confirm('Deseja realmente sair?')) {
      try {
        await signOut();
        navigate('/login');
      } catch (error) {
        console.error('Erro ao sair:', error);
      }
    }
  };

  useEffect(() => {
    const closeMenu = () => setIsMenuOpen(false);
    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, []);

  // Adaptamos o objeto de usuário para o componente Header que espera User | null (baseado no mock anterior)
  // Como mudamos os tipos, precisamos garantir que o Header receba o que espera ou atualizar o Header.
  const headerUser = profile ? {
    name: profile.nome,
    role: profile.papel,
    avatarInitial: profile.nome.charAt(0).toUpperCase()
  } : null;

  return (
    <div id="app-shell" className="screen">
      <Header 
        title={getPageTitle()} 
        user={headerUser} 
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
