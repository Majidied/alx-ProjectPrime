import apiClient from './apiClinet';

export const fetchVerificationStatus = async () => {
  const response = await apiClient.get('/users/is-verified');
  return response.data.isVerified;
};


/**
 * Searches for a user by username.
 *
 * @param username - The username to search for.
 * @returns A promise that resolves to an object containing user data if found.
 */
export const searchUser = async (username: string): Promise<object> => {
  const response = await apiClient.post(
    '/users/search',
    { username },
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
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
};

/**
 * Retrieves the avatar image of the logged-in user.
 *
 * @returns A promise that resolves to the user's avatar image data as a blob.
 * @throws An error if the avatar cannot be fetched.
 */
export async function getUserAvatar() {
  try {
    const response = await apiClient.get('/files/profile');

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
  const response = await apiClient.get(`/files/${id}`);
  return response.data;
};

/**
 * Retrieves the data of a specific contact by their ID.
 *
 * @param id - The unique identifier of the contact.
 * @returns A promise that resolves to an object containing the contact's data.
 */
export const getUserContact = async (id: string): Promise<object> => {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
};

/**
 * Logs out the current user.
 *
 * @returns A promise that resolves to an object indicating the logout status.
 */
export const logout = async () => {

  const response = await apiClient.post('/users/logout', {});
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
    const response = await apiClient.get(`/users/user-status/${id}`);

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

  const formData = new FormData();
  formData.append('file', file);
  console.log('file', file);

  const response = await apiClient.post('/files/upload-profile', formData);

  return response.data;
};

/**
 * Resends the email verification link to the logged-in user.
 *
 * @returns A promise that resolves to an object containing the status of the resend operation.
 */
export const resendValidationEmail = async (): Promise<object> => {
  const response = await apiClient.post('/users/resend-verification', {});

  return response.data;
}
