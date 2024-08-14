import { Server as SocketIOServer, Socket } from 'socket.io';
import {
    storeUserSocketId,
    deleteUserSocketId,
} from '../services/socketService';

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
const _handleRegisterUser = (socket: Socket) => {
    socket.on('registerUser', async ({ userId }: { userId: string }) => {
        await storeUserSocketId(userId, socket.id);
        console.log(`User registered: ${userId}`);
        socket.broadcast.emit('userOnline', { userId });
    });
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
