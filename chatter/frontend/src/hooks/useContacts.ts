import apiClient from "../api/apiClinet";
import { useQuery } from "@tanstack/react-query";

/**
 * Retrieves the list of all contacts for the logged-in user.
 *
 * @returns A promise that resolves to the list of contacts.
 */
export const useContacts = () => {
    return useQuery({
        queryKey: ['contacts'], queryFn: async () => {
            const response = await apiClient.get('/contacts/get');
            return { contacts: response.data } // Returns the list of contacts
        },
        staleTime: 1000 * 60 * 60 * 24, // Data is considered fresh for 24 hours
    });
};
