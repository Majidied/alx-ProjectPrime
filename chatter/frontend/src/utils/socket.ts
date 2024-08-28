import { io } from 'socket.io-client';

const token = localStorage.getItem('token');

/**
 * Initializes a socket connection to the specified URL with the given options.
 * 
 * @param url - The URL to connect the socket to.
 * @param options - The options to configure the socket connection.
 * @returns A socket instance.
 */
const socket = io('http://localhost:5000', {
  reconnection: true, // Allow reconnections
  reconnectionAttempts: 1, // Limit the number of reconnection attempts
  reconnectionDelay: 1000, // Wait 1 second before trying to reconnect
  timeout: 20000, // Connection timeout set to 20 seconds
  auth: {
    token: token, // Send the token as part of the auth object
  },
});

export default socket;
