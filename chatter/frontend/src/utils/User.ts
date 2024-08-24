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
};

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

export const getUserStatus = async (id: string): Promise<boolean> => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No token found');
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.get(`/api/users/user-status/${id}`, {
      headers,
    });

    if (response.status === 200 && response.data) {
      return response.data.isOnline;
    }

    return false;
  } catch (error) {
    console.error('Error fetching user status:', error);
    return false;
  }
};

export const uploadAvatar = async (file: File): Promise<object> => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No authentication token found');
  }

  const formData = new FormData();
  formData.append('file', file);

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const response = await axios.post('/api/files/upload-profile', formData, {
    headers,
  });

  return response.data;
};
