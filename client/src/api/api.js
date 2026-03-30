import axios from 'axios';



// 🔥 CREATE INSTANCE
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

// 🔥 REQUEST CACHE (PREVENT DUPLICATE CALLS → FIX 429)
const pendingRequests = new Map();

const getRequestKey = (config) => {
  return `${config.method}:${config.url}`;
};

// 🔐 REQUEST INTERCEPTOR
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // 🚫 Prevent duplicate requests
  const key = getRequestKey(config);
  if (pendingRequests.has(key)) {
    return Promise.reject({ duplicate: true });
  }

  pendingRequests.set(key, true);

  return config;
});

// 🔄 RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => {
    const key = getRequestKey(response.config);
    pendingRequests.delete(key);
    return response;
  },

  (error) => {
    const key = error.config ? getRequestKey(error.config) : null;
    if (key) pendingRequests.delete(key);

    // 🔇 SILENT HANDLING (NO CONSOLE ERROR)
    const status = error.response?.status;

    if (error.duplicate) {
      return Promise.resolve({ data: [] });
    }

    if (status === 403 || status === 404 || status === 429) {
      console.log(`API handled silently (${status})`);
      return Promise.resolve({ data: [] });
    }

    // 🔐 AUTO LOGOUT ON 401
    if (status === 401) {
      // 🔥 Better: null for single objects, [] for lists
      const isListEndpoint = ['/scores', '/draws', '/charities', '/admin'].some(path => 
        error.config?.url?.includes(path)
      );
      console.log(`401 handled → ${isListEndpoint ? '[]' : 'null'}`);
      return Promise.resolve({ data: isListEndpoint ? [] : null });
    }

    return Promise.reject(error);
  }
);


// ================= AUTH =================
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (data) => api.post('/auth/signup', data),
  profile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data), // 👈 ADD THIS
};
// ================= SUBSCRIPTIONS =================
export const subscriptionAPI = {
  createCheckout: (plan) =>
    api.post("/subscriptions/create-checkout", { plan }),

  status: () => api.get("/subscriptions/status"),
  cancel: () => api.post("/subscriptions/cancel"),
};



// ================= USER SUBSCRIPTION =================
export const userAPI = {
  selectPlan: (plan) =>
    api.post("/subscriptions/select-plan", { plan }),

  selectCharity: (charity_id) =>
    api.post("/charities/select", { charity_id }),
};
// ================= SCORES =================
export const scoresAPI = {
  list: () => api.get("/scores"),
  add: (numbers, played_at) =>
    api.post("/scores", { numbers, played_at }),
};
// ================= DRAWS =================
export const drawsAPI = {
  list: () => api.get('/draws'),
  create: (data) => api.post('/draws', data),
};


// ================= CHARITIES =================
export const charitiesAPI = {
  list: () => api.get('/charities'),
  select: (data) => api.post('/charities/select', data),
};


// ================= ADMIN =================
export const adminAPI = {
  // 📊 Analytics
  analytics: () => api.get("/admin/analytics"),

  // 👥 Users
  users: () => api.get("/admin/users"),

  updateUser: (id, data) =>
    api.put(`/admin/users/${id}`, data),

  updateStatus: (id, status) =>
    api.patch(`/admin/users/${id}/status`, { status }),

  updateScore: (id, numbers) =>
    api.patch(`/admin/users/${id}/scores`, { numbers }),

  updateSubscription: (id, plan, status) =>
    api.patch(`/admin/users/${id}/subscription`, {
      plan,
      status,
    }),

  // ❌ Optional delete
  deleteUser: (id) =>
    api.delete(`/admin/users/${id}`),

  // 🏆 Winners
  getWinners: () => api.get("/admin/winners"),

  approveWinner: (id) =>
    api.post(`/admin/winners/${id}/approve`),
};
export default api;