import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import messageRoutes from './routes/msg';
import contactRoutes from './routes/contact';
import fileRoutes from './routes/file';
import userRoutes from './routes/user';
import connectDB from './config/db';
import cors from 'cors';
import { createServer } from 'http';
import { connectSocket } from './config/socket';
import chatSocket from './sockets/chatSocket';
import { Request, Response, NextFunction } from 'express';
import { Server as SocketIOServer } from 'socket.io';
interface CustomRequest extends Request {
    io: SocketIOServer;
}

dotenv.config();

const app = express();
const server = createServer(app);
const io = connectSocket(server);
/**
 * The port number for the server.
 * If the `PORT` environment variable is set, it will be used as the port number.
 * Otherwise, the default port number is 5000.
 */
const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
    const customReq = req as CustomRequest;
    customReq.io = io;
    next();
});
app.use(
    cors({
        origin: 'http://localhost:3000',
        methods: 'GET,POST,PUT,DELETE',
        allowedHeaders: 'Content-Type',
    }),
);
app.get('/api/', (req, res) => res.send('API is running'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/users', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/users', userRoutes);

connectDB();
chatSocket(io);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
