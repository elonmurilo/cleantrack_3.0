export interface User {
  name: string;
  role: string;
  avatarInitial: string;
}

export interface SummaryItem {
  value: string | number;
  growth?: string;
  status?: string;
}

export interface Summary {
  totalClients: SummaryItem;
  servicesToday: SummaryItem;
  monthlyBilling: SummaryItem;
  lastMonthBilling: SummaryItem;
}

export interface Client {
  id: number;
  name: string;
  vehicle: string;
  lastVisit: string;
  initials: string;
  color: string;
}

export interface ServiceJob {
  id: number;
  client: string;
  vehicle: string;
  type: string;
  time: string;
  status: 'Em andamento' | 'Agendado' | 'Finalizado';
}

export interface BillingData {
  month: string;
  value: number;
  color: string;
}

export interface MockData {
  currentUser: User;
  summary: Summary;
  clients: Client[];
  services: ServiceJob[];
  billingChart: BillingData[];
}
