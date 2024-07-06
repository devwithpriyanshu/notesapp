import express from 'express';
const router = express.Router();

import Note from '../models/note.js';

/* Create a note */
router.post('/create', async (req, res) => {
  try {
    const note = new Note({
      userId: req.user.userId,
      ...req.body,
    });
    await note.save();
    res.status(201).send(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

/* Get all notes */
router.get('/all', async (req, res) => {
  const notes = await Note.find({ userId: req.user.userId, isArchived : false }).sort({ updatedAt: -1 });;
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
/* Update Note */
router.put('/update', async (req, res) => {
  try {
    console.log(req.body)
    const note = await Note.findOneAndUpdate(
      { userId: req.user.userId, _id: req.body._id },
      { ...req.body },
      { new: true }
    );
    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
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
    isArchived: true,
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
