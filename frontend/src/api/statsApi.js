import API from './axios';

export const getDashboardStats = () => API.get('/stats/dashboard');
export const getAllAgentsStats = () => API.get('/stats/agents');
export const getAgentStats = (id) => API.get(`/stats/agents/${id}`);
