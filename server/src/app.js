import express from 'express';
import cors from 'cors';
import { authMiddleware } from './middleware/auth.js';
import notesRoutes from './routes/notes.js';
import authRoutes from './routes/auth.js';

const app = express();
app.use(
  cors({
    credentials: true,
    origin: 'http://127.0.0.1:5500',
  })
);
app.use(express.json());

app.get('/', (req, res, next) => {
  res.send('notes-app server');
});

app.use('/api/v1/notes', authMiddleware, notesRoutes);
app.use('/api/v1/auth', authRoutes);

export default app;
