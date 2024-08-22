import { Server as SocketIOServer, Socket } from 'socket.io';
import {
    storeUserSocketId,
    deleteUserSocketId,
} from '../services/socketService';
import { getUserIdByToken } from '../utils/TokenUtils';

const chatSocket = (io: SocketIOServer) => {
    io.on('connection', (socket: Socket) => {
        console.log(`User connected: ${socket.id}`);

        _handleRegisterUser(socket);
        _handleDisconnect(socket);
    });
};

/**
 * Handles the registration of a user on the socket.
 *
 * @param socket - The socket object.
 */
const _handleRegisterUser = async (socket: Socket) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        console.log('No token provided');
        return;
    }
    const userId = await getUserIdByToken(token);
    if (!userId) {
        console.log('Invalid token, unable to retrieve user ID');
        return;
    }
    console.log(`Storing socket ID for user ${userId}`);
    await storeUserSocketId(userId, socket.id);
    socket.broadcast.emit('userOnline', { userId });
};

/**
 * Handles the 'disconnect' event for a socket.
 *
 * @param socket - The socket object.
 */
const _handleDisconnect = (socket: Socket) => {
    socket.on('disconnect', async () => {
        await deleteUserSocketId(socket.id);
        console.log(`User disconnected: ${socket.id}`);
        socket.broadcast.emit('userOffline', { socketId: socket.id });
    });
};

export default chatSocket;
