import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import AppointmentsPage from './pages/appointments/AppointmentsPage';
import ServiceRecordsPage from './pages/service-records/ServiceRecordsPage';
import FinancialPage from './pages/financial/FinancialPage';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

// Importando estilos globais
import './styles/variables.css';
import './styles/global.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<AppShell />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="clientes" element={<Clients />} />
              <Route path="agendamentos" element={<AppointmentsPage />} />
              <Route path="servicos-realizados" element={<ServiceRecordsPage />} />
              <Route path="faturamento" element={<FinancialPage />} />
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
