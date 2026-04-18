import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { authService } from '../services/authService';
import Button from '../components/common/Button';

const Login: React.FC = () => {
  const [email, setEmail] = useState('contato@cleantrack.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Credenciais inválidas. Tente contato@cleantrack.com / 123456');
    } finally {
      setLoading(false);
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
            />
          </div>
          
          {error && <p style={{ color: '#ff4d4d', fontSize: '0.8rem', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Carregando...' : 'Entrar'}
          </Button>
        </form>
      </div>
      <div className="login-footer-decoration"></div>
    </div>
  );
};

export default Login;
