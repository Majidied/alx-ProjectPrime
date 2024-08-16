"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectSocket = void 0;
const socket_io_1 = require("socket.io");
const connectSocket = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });
    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);
        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
    return io;
};
exports.connectSocket = connectSocket;
