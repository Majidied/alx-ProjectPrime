import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Chatter API');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
