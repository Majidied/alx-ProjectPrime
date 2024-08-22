import axios from 'axios';

export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  verified: boolean;
}

export const login = async (
  email: string,
  password: string
): Promise<object> => {
  const response = await axios.post('/api/users/login', { email, password });
  return response.data;
};

export const register = async (
  name: string,
  username: string,
  email: string,
  password: string
): Promise<object> => {
  const response = await axios.post('/api/users/register', {
    name,
    username,
    email,
    password,
  });
  return response.data;
};

export const searchUser = async (username: string): Promise<object> => {
  const token = localStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const response = await axios.post(
    '/api/users/search',
    { username },
    { headers }
  );
  console.log(response.data);
  return response.data;
};

export const getUserById = async (id: string): Promise<object> => {
  const token = localStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const response = await axios.get(`/api/users/${id}`, { headers });
  return response.data;
}

export const getUserProfile = async () => {
  const token = localStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const response = await axios.get('/api/users/profile', { headers });
  return response.data;
};

export async function getUserAvatar() {
  const token = localStorage.getItem('token');

  try {
    const response = await axios.get('/api/files/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob',
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to fetch avatar');
    }
  } catch (error) {
    console.error('Error fetching avatar:', error);
    throw error;
  }
}

export const getContactAvatar = async (id: string): Promise<string> => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`/api/files/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: 'blob',
  });
  return response.data;
};

export const getUserContact = async (id: string): Promise<object> => {
  const token = localStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const response = await axios.get(`/api/users/${id}`, { headers });
  return response.data;
};

export const logout = async () => {
  const token = localStorage.getItem('token');

  const headers = { Authorization: `Bearer ${token}` };

  const response = await axios.post('/api/users/logout', {}, { headers });
  return response.data;
};
