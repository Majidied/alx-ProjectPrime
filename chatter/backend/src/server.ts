import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import messageRoutes from './routes/msg';
import contactRoutes from './routes/contact';
import connectDB from './config/db';
import cors from 'cors';
import { createServer } from 'http';
import { connectSocket } from './config/socket';
import chatSocket from './sockets/chatSocket';


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

app.use(
    cors({
        origin: '*', // Replace with your frontend origin
        methods: 'GET,POST,PUT,DELETE',
        allowedHeaders: 'Content-Type',
    }),
);
app.use(express.json());

app.use('/api/users', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/contacts', contactRoutes);

connectDB();
chatSocket(io);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
