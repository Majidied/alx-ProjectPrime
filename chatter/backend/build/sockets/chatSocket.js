"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const socketService_1 = require("../services/socketService");
const chatSocket = (io) => {
    io.on('connection', (socket) => {
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
const _handleRegisterUser = (socket) => {
    socket.on('registerUser', (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId }) {
        yield (0, socketService_1.storeUserSocketId)(userId, socket.id);
        console.log(`User registered: ${userId}`);
        socket.broadcast.emit('userOnline', { userId });
    }));
};
/**
 * Handles the 'disconnect' event for a socket.
 *
 * @param socket - The socket object.
 */
const _handleDisconnect = (socket) => {
    socket.on('disconnect', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, socketService_1.deleteUserSocketId)(socket.id);
        console.log(`User disconnected: ${socket.id}`);
        socket.broadcast.emit('userOffline', { socketId: socket.id });
    }));
};
exports.default = chatSocket;
