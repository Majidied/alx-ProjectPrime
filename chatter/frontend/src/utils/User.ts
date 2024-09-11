import axios from 'axios';

/**
 * Interface representing a User object.
 */
export interface User {
  _id: string;           // Unique identifier for the user
  name: string;          // Full name of the user
  username: string;      // Username of the user
  email: string;         // Email address of the user
  password: string;      // User's password (should be hashed in the database)
  verified: boolean;     // Indicates whether the user's email is verified
}

/**
 * Logs in a user.
 *
 * @param email - The user's email address.
 * @param password - The user's password.
 * @returns A promise that resolves to an object containing user data if login is successful.
 */
export const login = async (
  email: string,
  password: string
): Promise<object> => {
  const response = await axios.post('/api/users/login', { email, password });
  return response.data;
};

/**
 * Registers a new user.
 *
 * @param name - The user's full name.
 * @param username - The user's chosen username.
 * @param email - The user's email address.
 * @param password - The user's password.
 * @returns A promise that resolves to an object containing user data if registration is successful.
 */
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

/**
 * Searches for a user by username.
 *
 * @param username - The username to search for.
 * @returns A promise that resolves to an object containing user data if found.
 */
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
  return response.data;
};

/**
 * Retrieves a user's data by their ID.
 *
 * @param id - The unique identifier of the user.
 * @returns A promise that resolves to an object containing user data.
 */
export const getUserById = async (id: string): Promise<object> => {
  const token = localStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const response = await axios.get(`/api/users/${id}`, { headers });
  return response.data;
};

/**
 * Retrieves the profile data of the logged-in user.
 *
 * @returns A promise that resolves to an object containing the user's profile data.
 */
export const getUserProfile = async () => {
  const token = localStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const response = await axios.get('/api/users/profile', { headers });
  return response.data;
};

/**
 * Retrieves the avatar image of the logged-in user.
 *
 * @returns A promise that resolves to the user's avatar image data as a blob.
 * @throws An error if the avatar cannot be fetched.
 */
export async function getUserAvatar() {
  const token = localStorage.getItem('token');

  try {
    const response = await axios.get('/api/files/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob', // Specifies the response type as a blob (for binary data)
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

/**
 * Retrieves the avatar image of a specific contact by their ID.
 *
 * @param id - The unique identifier of the contact.
 * @returns A promise that resolves to the contact's avatar image data as a blob.
 */
export const getContactAvatar = async (id: string): Promise<string> => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`/api/files/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: 'blob',
  });
  return response.data;
};

/**
 * Retrieves the data of a specific contact by their ID.
 *
 * @param id - The unique identifier of the contact.
 * @returns A promise that resolves to an object containing the contact's data.
 */
export const getUserContact = async (id: string): Promise<object> => {
  const token = localStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const response = await axios.get(`/api/users/${id}`, { headers });
  return response.data;
};

/**
 * Logs out the current user.
 *
 * @returns A promise that resolves to an object indicating the logout status.
 */
export const logout = async () => {
  const token = localStorage.getItem('token');

  const headers = { Authorization: `Bearer ${token}` };

  const response = await axios.post('/api/users/logout', {}, { headers });
  return response.data;
};

/**
 * Checks whether a specific user is currently online.
 *
 * @param id - The unique identifier of the user.
 * @returns A promise that resolves to a boolean indicating the user's online status.
 * @throws An error if the status cannot be fetched.
 */
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

/**
 * Uploads a new avatar for the logged-in user.
 *
 * @param file - The file object representing the new avatar image.
 * @returns A promise that resolves to an object containing the upload status and data.
 * @throws An error if the upload fails.
 */
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

/**
 * Checks whether the logged-in user has a verified email.
 *
 * @returns A promise that resolves to a boolean indicating whether the user's email is verified.
 */
export const isVerifiedUser = async (): Promise<boolean> => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No authentication token found');
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const response = await axios.get('/api/users/is-verified', { headers });

  return response.data.isVerified;
}

/**
 * Resends the email verification link to the logged-in user.
 *
 * @returns A promise that resolves to an object containing the status of the resend operation.
 */
export const resendValidationEmail = async (): Promise<object> => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No authentication token found');
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const response = await axios.post('/api/users/resend-verification', {}, { headers });

  return response.data;
}
