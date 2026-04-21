import React, { useEffect, useState } from 'react';
import { CalendarCheck, Plus, Filter } from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';
import Button from '../../components/common/Button';
import AppointmentList from '../../components/appointments/AppointmentList';
import AppointmentForm from '../../components/appointments/AppointmentForm';
import { appointmentService } from '../../services/appointmentService';
import { Appointment, AppointmentStatus } from '../../types/appointment';
import { useAuth } from '../../hooks/useAuth';

const AppointmentsPage: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await appointmentService.listAppointments();
      setAppointments(data);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      alert('Erro ao carregar agendamentos do banco de dados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCreateOrUpdate = async (formData: any) => {
    if (!user) return;
    
    setFormLoading(true);
    try {
      if (editingAppointment) {
        await appointmentService.updateAppointment(editingAppointment.id, {
          ...formData,
          updated_by: user.id
        });
      } else {
        await appointmentService.createAppointment({
          ...formData,
          created_by: user.id,
          ativo: true
        });
      }
      setShowForm(false);
      setEditingAppointment(null);
      fetchAppointments();
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
      alert('Erro ao salvar agendamento no banco de dados.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: AppointmentStatus) => {
    if (!user) return;
    try {
      await appointmentService.updateStatus(id, status, user.id);
      fetchAppointments();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const handleCancel = async (id: string) => {
    if (!user) return;
    if (window.confirm('Deseja realmente cancelar este agendamento?')) {
      try {
        await appointmentService.cancelAppointment(id, user.id);
        fetchAppointments();
      } catch (error) {
        console.error('Erro ao cancelar agendamento:', error);
      }
    }
  };

  const openEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setShowForm(true);
  };

  // Cálculo de sumário simples baseado nos dados reais
  const servicesToday = appointments.length;
  const inProgress = appointments.filter(a => a.status === 'em_execucao').length;
  const scheduled = appointments.filter(a => a.status === 'agendado').length;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <StatCard 
          label="Agenda de Hoje"
          value={servicesToday}
          subtext={`${inProgress} em execução, ${scheduled} agendados`}
          subtextType="status"
          icon={<CalendarCheck size={20} />}
          iconClass="icon-services"
        />
        
        <div style={{ display: 'flex', gap: '10px', alignSelf: 'flex-start', marginTop: '10px' }}>
          <Button 
            variant="action" 
            onClick={() => { setShowForm(true); setEditingAppointment(null); }}
            style={{ padding: '0.8rem 1.2rem' }}
          >
            <Plus size={18} /> Novo Agendamento
          </Button>
        </div>
      </div>

      {showForm ? (
        <AppointmentForm 
          appointment={editingAppointment}
          onSubmit={handleCreateOrUpdate}
          onCancel={() => { setShowForm(false); setEditingAppointment(null); }}
          loading={formLoading}
        />
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0.5rem 1rem' }}>
            <h4 style={{ margin: 0, color: 'var(--text-muted)' }}>Lista de Agendamentos</h4>
            <Filter size={18} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
          </div>
          
          {loading ? (
            <div className="loading-container">Carregando agenda...</div>
          ) : (
            <AppointmentList 
              appointments={appointments}
              onEdit={openEdit}
              onStatusChange={handleStatusChange}
              onCancel={handleCancel}
            />
          )}
        </>
      )}
    </>
  );
};

export default AppointmentsPage;
