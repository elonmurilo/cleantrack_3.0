import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import AppointmentsPage from './pages/appointments/AppointmentsPage';
import ServiceRecordsPage from './pages/service-records/ServiceRecordsPage';
import FinancialPage from './pages/financial/FinancialPage';
import UsersPage from './pages/UsersPage';
import SettingsPage from './pages/SettingsPage';
import ReportsPage from './pages/reports/ReportsPage';
import AccessDenied from './pages/AccessDenied';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import { useAuth } from './hooks/useAuth';
import { getDefaultRoute } from './config/permissions';

// Importando estilos globais
import './styles/variables.css';
import './styles/global.css';

// Componente para redirecionamento inteligente da raiz baseado no papel do usuário
const RootRedirect: React.FC = () => {
  const { profile } = useAuth();
  const defaultRoute = getDefaultRoute(profile?.papel);
  return <Navigate to={defaultRoute} replace />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/acesso-negado" element={<AccessDenied />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<AppShell />}>
              <Route index element={<RootRedirect />} />
              
              <Route element={<ProtectedRoute allowedRoles={['admin', 'gestor']} />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="faturamento" element={<FinancialPage />} />
                <Route path="relatorios" element={<ReportsPage />} />
              </Route>
              
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="usuarios" element={<UsersPage />} />
                <Route path="configuracoes" element={<SettingsPage />} />
              </Route>
              
              <Route element={<ProtectedRoute allowedRoles={['admin', 'gestor', 'operador']} />}>
                <Route path="clientes" element={<Clients />} />
                <Route path="agendamentos" element={<AppointmentsPage />} />
                <Route path="servicos-realizados" element={<ServiceRecordsPage />} />
              </Route>
            </Route>
          </Route>

          {/* Fallback para login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
