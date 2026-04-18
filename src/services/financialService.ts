import { mockData } from '../data/mockData';
import { BillingData, Summary } from '../types';

export const financialService = {
  getSummary: async (): Promise<Summary> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockData.summary;
  },

  getBillingChartData: async (): Promise<BillingData[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return mockData.billingChart;
  }
};
