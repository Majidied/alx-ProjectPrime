import axios from 'axios';

export interface User {
    id: string;
    name: string;
    username: string;
    email: string;
    password: string;
    verified: boolean;
}


export const login = async (email: string, password: string): Promise<object> => {
    const response = await axios.post('/api/users/login', { email, password });
    return response.data;
}

export const register = async (name: string, username: string, email: string, password: string): Promise<object> => {
    const response = await axios.post('/api/users/register', { name, username, email, password });
    return response.data;
}