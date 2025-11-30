import API from './axios';

export const getCallLogs = () => API.get('/calllogs');
export const getCallLog = (id) => API.get(`/calllogs/${id}`);
export const getCallLogsByClient = (clientId) => API.get(`/calllogs/client/${clientId}`);
export const createCallLog = (callLogData) => API.post('/calllogs', callLogData);
export const updateCallLog = (id, callLogData) => API.put(`/calllogs/${id}`, callLogData);
export const deleteCallLog = (id) => API.delete(`/calllogs/${id}`);
