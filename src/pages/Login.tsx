import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn, session, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Se já estiver logado e com perfil ativo, redireciona para o dashboard
  useEffect(() => {
    if (!authLoading && session && profile?.ativo) {
      navigate('/dashboard');
    }
  }, [session, profile, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalLoading(true);
    setError('');

    try {
      await signIn(email, password);
      // O redirecionamento acontecerá via useEffect após o estado de auth atualizar
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.message === 'Invalid login credentials') {
        setError('E-mail ou senha incorretos.');
      } else {
        setError('Ocorreu um erro ao tentar entrar. Verifique sua conexão.');
      }
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div id="login-screen" className="screen active">
      <div className="login-content">
        <div className="login-header">
          <p className="welcome-text">Bem-vindo ao</p>
          <div className="logo-container">
            <img src="/assets/images/logo_cleantrack.png" alt="CleanTrack Logo" className="app-logo" />
            <h1 className="logo-text">CleanTrack <span>3.0</span></h1>
          </div>
        </div>
        
        <form id="login-form" className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <Mail size={18} color="var(--text-muted)" />
            <input 
              type="email" 
              placeholder="E-mail" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required 
              disabled={localLoading || authLoading}
            />
          </div>
          <div className="input-group">
            <Lock size={18} color="var(--text-muted)" />
            <input 
              type="password" 
              placeholder="Senha" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required 
              disabled={localLoading || authLoading}
            />
          </div>
          
          {error && <p style={{ color: '#ff4d4d', fontSize: '0.8rem', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}
          
          <Button type="submit" disabled={localLoading || authLoading}>
            {localLoading || authLoading ? 'Carregando...' : 'Entrar'}
          </Button>
        </form>
      </div>
      <div className="login-footer-decoration"></div>
    </div>
  );
};

export default Login;
