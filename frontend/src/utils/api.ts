import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:8000',
  baseURL: 'https://ai-content-image-explorer-backend.onrender.com',
});

interface LoginResponse {
  access_token: string;
  token_type: string;
}
interface RegisterResponse {
  access_token: string;
}
interface SearchResponse {
  result: string;
}
interface ImageResponse {
  image_url: string;
}
interface ErrorResponse {
  detail: string;
}
interface HistoryItem {
  id: number;
  user_id: number;
  type: string;
  query: string;
  result: string;
  meta_data?: string;
  created_at: string;
}

interface User {
  id: number;
  username: string;
  role: string;
}

interface AdminStats {
  users: {
    total: number;
    admin: number;
    regular: number;
  };
  activities: {
    total: number;
    searches: number;
    images: number;
    recent_week: number;
  };
  most_active_users: {
    username: string;
    activity_count: number;
  }[];
}

export const login = async (username: string, password: string): Promise<string> => {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);
  const response = await api.post<LoginResponse | LoginError>('/auth/login', params.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  if ('access_token' in response.data) {
    return response.data.access_token;
  }
  throw new Error(typeof response.data.detail === 'string' ? response.data.detail : 'Login failed');
};

export const validateToken = async (token: string): Promise<User> => {
  const response = await api.get<ValidateTokenResponse>('/auth/validate', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.user;
};

export const register = async (username: string, password: string, role: string): Promise<string> => {
  const response = await api.post<RegisterResponse>('/auth/register', { username, password, role }, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data.access_token;
};

export const search = async (query: string, token: string): Promise<string> => {
  const response = await api.post<SearchResponse | ErrorResponse>('/search/query', { query }, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  if ('result' in response.data) {
    return response.data.result;
  }
  throw new Error(typeof response.data.detail === 'string' ? response.data.detail : 'Search failed');
};

export const generateImage = async (prompt: string, token: string): Promise<string> => {
  const response = await api.post<ImageResponse | ErrorResponse>('/image/generate', { prompt }, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  if ('image_url' in response.data) {
    return response.data.image_url;
  }
  throw new Error(typeof response.data.detail === 'string' ? response.data.detail : 'Image generation failed');
};

export const getDashboard = async (token: string): Promise<HistoryItem[]> => {
  try {
    const response = await api.get<HistoryItem[]>('/dashboard', { 
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      } 
    });
    
    console.log('API Response:', response); // Add logging

    if (!response.data) {
      throw new Error('No data received from server');
    }

    return response.data;
  } catch (error) {
    console.error('Dashboard API error:', error); // Add detailed error logging
    throw error instanceof Error ? error : new Error('Failed to fetch dashboard data');
  }
};


export const getAllUsers = async (token: string): Promise<User[]> => {
  const response = await api.get<User[]>('/admin/users', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createUser = async (username: string, password: string, role: string, token: string): Promise<User> => {
  const response = await api.post<User>('/admin/users', { username, password, role }, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const updateUser = async (userId: number, updates: Partial<User & { password?: string }>, token: string): Promise<User> => {
  const response = await api.put<User>(`/admin/users/${userId}`, updates, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  return response.data;
};


export const changeUserRole = async (userId: number, role: string, token: string): Promise<void> => {
  await api.put(`/admin/users/${userId}/role`, { role }, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
};

export const getUserHistory = async (userId: number, token: string): Promise<any> => {
  const response = await api.get(`/admin/users/${userId}/history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Export User interface for use in components
export type { User, HistoryItem, AdminStats };