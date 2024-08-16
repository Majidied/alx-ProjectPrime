"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const msg_1 = __importDefault(require("./routes/msg"));
const contact_1 = __importDefault(require("./routes/contact"));
const file_1 = __importDefault(require("./routes/file"));
const db_1 = __importDefault(require("./config/db"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const socket_1 = require("./config/socket");
const chatSocket_1 = __importDefault(require("./sockets/chatSocket"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = (0, socket_1.connectSocket)(server);
/**
 * The port number for the server.
 * If the `PORT` environment variable is set, it will be used as the port number.
 * Otherwise, the default port number is 5000.
 */
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)({
    origin: '*', // Replace with your frontend origin
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type',
}));
app.use(express_1.default.json());
app.use('/api/users', auth_1.default);
app.use('/api/messages', msg_1.default);
app.use('/api/contacts', contact_1.default);
app.use('/api/files', file_1.default);
(0, db_1.default)();
(0, chatSocket_1.default)(io);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
