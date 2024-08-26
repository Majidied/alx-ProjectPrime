import { Server as SocketIOServer, Socket } from 'socket.io';
import {
    storeUserSocketId,
    deleteUserSocketId,
} from '../services/socketService';
import { getUserIdByToken } from '../utils/TokenUtils';
import { updateUserStatus } from '../utils/userStatus';

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
    await updateUserStatus(userId, true);
    socket.broadcast.emit('userOnline', { userId });
};

/**
 * Handles the 'disconnect' event for a socket.
 *
 * @param socket - The socket object.
 */
const _handleDisconnect = async (socket: Socket) => {
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
    socket.on('disconnect', async () => {
        await deleteUserSocketId(socket.id);
        await updateUserStatus(userId, false);
        socket.broadcast.emit('userOffline', { userId });
    });
};

export default chatSocket;
