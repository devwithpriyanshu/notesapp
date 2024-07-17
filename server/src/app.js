import express from 'express';
import cors from 'cors';
import { authMiddleware } from './middleware/auth.js';
import notesRoutes from './routes/notes.js';
import labelRoutes from './routes/label.js';
import authRoutes from './routes/auth.js';

const app = express();
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:5500',
  })
);

app.use(express.json());

app.get('/', (req, res, next) => {
  res.send('<h1>notes-app server</h1>');
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/notes', authMiddleware, notesRoutes);
app.use('/api/v1/labels', authMiddleware, labelRoutes);



export default app;
