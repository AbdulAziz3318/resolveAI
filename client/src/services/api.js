import axios from 'axios';
const api = axios.create({ baseURL: '/api' });
api.interceptors.request.use(request => { const session = JSON.parse(localStorage.getItem('resolveai-auth') || 'null'); if (session?.token) request.headers.Authorization = `Bearer ${session.token}`; return request; });
export default api;
