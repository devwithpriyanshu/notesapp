import express from 'express';
const router = express.Router();

import Note from '../models/note.js';

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

router.get('/all', async (req, res) => {
  try {
    const notes = await Note.find({
      userId: req.user.userId,
      isArchived: false,
      isTrashed: false,
    }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/search', async (req, res) => {
  const notes = await Note.find({
    userId: req.user.userId,
    title: { $regex: req.query.title, $options: 'i' },
  });
  res.json(notes);
});

router.get('/label', async (req, res) => {
  const notes = await Note.find({
    userId: req.user.userId,
    label: req.query.label,
  });
  res.json(notes);
});

router.put('/update', async (req, res) => {
  try {
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

router.put('/delete', async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { userId: req.user.userId, _id: req.body._id },
      { isTrashed: true, deletedAt: new Date() },
      { new: true }
    );
    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.put('/restore', async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { userId: req.user.userId, _id: req.body._id, isTrashed: true },
      { isTrashed: false, deletedAt: null },
      { new: true }
    );
    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/trash', async (req, res) => {
  try {
    const notes = await Note.find({
      userId: req.user.userId,
      isTrashed: true,
      deletedAt: {
        $gt: new Date(new Date().setDate(new Date().getDate() - 30)),
      },
    }).sort({ deletedAt: -1 });
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/archives', async (req, res) => {
  try {
    const notes = await Note.find({
      userId: req.user.userId,
      isArchived: true,
    });
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/reminder', async (req, res) => {
  try {
    const notes = await Note.find({
      userId: req.user.userId,
      dueDate: { $lt: new Date() },
    });
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;
