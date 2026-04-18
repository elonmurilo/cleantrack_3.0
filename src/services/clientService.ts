import { mockData } from '../data/mockData';
import { Client } from '../types';

export const clientService = {
  getClients: async (): Promise<Client[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockData.clients;
  },
  
  getRecentClients: async (limit: number = 3): Promise<Client[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockData.clients.slice(0, limit);
  }
};
