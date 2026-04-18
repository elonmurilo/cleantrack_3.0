import { mockData } from '../data/mockData';
import { ServiceJob } from '../types';

export const jobService = {
  getServicesToday: async (): Promise<ServiceJob[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockData.services;
  }
};
