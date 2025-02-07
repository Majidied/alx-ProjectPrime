import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/apiClinet';

export const useAuth = () => {
  const token = localStorage.getItem('token');

  return { token };
}

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
      mutationFn: async (credentials: {email: string, password: string}) => {
          const { data } = await apiClient.post('/users/login', { ...credentials });
          localStorage.setItem('token', data?.token);
          return data;
      },
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['auth'] });
      },
  });
};

interface FormData {
  name: string;
  username: string;
  email: string;
  password: string;
}

export const useRegister = () => {

  return useMutation({
    mutationFn: async (credentials: FormData) => {
      const response = await apiClient.post("/users/register", credentials);
      if (!response?.data) {
        throw new Error("Failed to register user.");
      }
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data?.token);
    }
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
      mutationFn: async () => {
          localStorage.removeItem('token');
          await queryClient.invalidateQueries({ queryKey: ['auth'] });
      },
  });    
};


export const useVerify = () => {
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async (token: string) => {
      const response = await apiClient.get(`/users/verify/${token}`);
      return response.data;
    }
  });

  return { mutate, isLoading: isPending, isError, error };
};

export const useForgotPassword = () => {
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiClient.post('/users/forgot-password', { email });
      return response.data;
    }
  });

  return { mutate, isLoading: isPending, isError, error };
};

export const useResetPassword = () => {
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async (data: unknown) => {
      const response = await apiClient.post('/users/reset-password', data);
      return response.data;
    }
  });

  return { mutate, isLoading: isPending, isError, error };
};

export const useUpdateProfile = () => {
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async (data: unknown) => {
      const response = await apiClient.put('/users/update-profile', data);
      return response.data;
    }
  });

  return { mutate, isLoading: isPending, isError, error };
};

