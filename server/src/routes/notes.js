import express from 'express';
const router = express.Router();

import Note from '../models/note.js';

/* Create a note */
router.post('/create', async (req, res) => {
  const note = new Note({
    userId: req.user.userId,
    ...req.body,
  });
  await note.save();
  res.status(201).send(note);
});

/* Get all notes */
router.get('/all', async (req, res) => {
  const notes = await Note.find({ userId: req.user.userId });
  res.json(notes);
});

/* Search in your notes */
router.get('/search', async (req, res) => {
  const notes = await Note.find({
    userId: req.user.userId,
    title: { $regex: req.query.title, $options: 'i' },
  });
  res.json(notes);
});
/* Get a particular label notes */
router.get('/label', async (req, res) => {
  const notes = await Note.find({
    userId: req.user.userId,
    label: req.query.label,
  });
  res.json(notes);
});
/* Change background color */
router.put('/changebg', async (req, res) => {
  const note = await Note.findOneAndUpdate(
    { userId: req.user.userId, _id: req.body.id },
    { backgroundColor: req.body.backgroundColor },
    { new: true }
  );
  res.json(note);
});
/* Get trash notes( deleted notes under 30 days) */
router.get('/trash', async (req, res) => {
  const notes = await Note.find({
    userId: req.user.userId,
    deletedAt: { $lt: new Date() },
  });
  res.json(notes);
});
/* Get archived notes */
router.get('/archives', async (req, res) => {
  const notes = await Note.find({
    userId: req.user.userId,
    archivedAt: { $lt: new Date() },
  });
  res.json(notes);
});
/* Get Reminder notes (notes under 30 days due date) */
router.get('/reminder', async (req, res) => {
  const notes = await Note.find({
    userId: req.user.userId,
    dueDate: { $lt: new Date() },
  });
  res.json(notes);
});

export default router;
