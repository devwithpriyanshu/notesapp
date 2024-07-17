import express from 'express';
const router = express.Router();

import Note from '../models/note.js';
import Label from '../models/label.js';

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
      isTrashed: false,
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

router.get('/search/:q', async (req, res) => {
  const { q } = req.params;
  if (!q) {
    return res.status(400).json({ error: 'Query string is required' });
  }
  try {
    const notes = await Note.find({
      userId: req.user.userId,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
      ],
    });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Error searching notes' });
  }
});

router.put('/attachlabel', async (req, res) => {
  try {
    const { noteId, labelId } = req.body;
    const note = await Note.findOne({
      userId: req.user.userId,
      _id: noteId,
    });
    if (!note) {
      return res.status(404).json({ error: 'Note not found', note });
    }
    if (note.labels && note.labels.length >= 9) {
      return res
        .status(400)
        .json({ error: 'Cannot add more than 9 labels to a note' });
    }
    const label = await Label.findOne({
      _id: labelId,
      userId: req.user.userId,
    });
    // res.send(label);
    if (!label) {
      return res.status(404).json({ error: 'Label not found' });
    }
    if (
      note.labels.some((existingLabel) => existingLabel.toString() === labelId)
    ) {
      return res.status(409).json({ error: 'Duplicate label exists' });
    }
    note.labels.push(label);
    await note.save();
    console.log(note.labels);
    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.put('/removelabel', async (req, res) => {
  try {
    const { noteId, labelId } = req.body;
    const note = await Note.findOne({
      userId: req.user.userId,
      _id: noteId,
    });
    if (!note) {
      return res.status(404).json({ error: 'Note not found', note });
    }
    const labelIndex = note.labels.findIndex(
      (existingLabel) => existingLabel.toString() === labelId
    );
    if (labelIndex === -1) {
      return res.status(404).json({ error: 'Label not found on this note' });
    }
    note.labels.splice(labelIndex, 1);
    await note.save();
    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

/* fetch all tagged labels of a particular note */
router.get('/:noteId/alllabels', async (req, res) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findOne({ _id: noteId, userId : req.user.userId }).populate('labels');
    if (!note) {
      return res.status(404).json({ error: 'Note not found', note });
    }
    res.json(note.labels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/:labelId/allnotes', async (req, res) => {
  const { labelId } = req.params;
  try {
    const notes = await Note.find({ labels: labelId });

    await Note.populate(notes, { path: 'labels', model: 'Label' });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching notes', msg: err });
  }
});

export default router;
