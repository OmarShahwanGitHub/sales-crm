import API from './axios';

export const getClients = () => API.get('/clients');
export const getClient = (id) => API.get(`/clients/${id}`);
export const createClient = (clientData) => API.post('/clients', clientData);
export const updateClient = (id, clientData) => API.put(`/clients/${id}`, clientData);
export const deleteClient = (id) => API.delete(`/clients/${id}`);
export const searchClients = (query) => API.get(`/clients/search/${query}`);
