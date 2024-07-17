import express from 'express';
const router = express.Router();

import Label from '../models/label.js';
import Note from '../models/note.js';

router.get('/all', async (req, res) => {
  try {
    const labels = await Label.find({ userId: req.user.userId });
    res.json(labels);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching labels' });
  }
});

router.post('/add', async (req, res) => {
  const { name } = req.body;
  try {
    const existingLabel = await Label.findOne({
      name: name,
      userId: req.user.userId,
    });
    if (existingLabel) {
      return res.status(400).json({ error: 'Label name already exists' });
    }
    const newLabel = new Label({ name: name, userId: req.user.userId });
    await newLabel.save();
    res.status(201).json(newLabel);
  } catch (err) {
    res.status(500).json({ error: 'Error creating label', msg: err });
  }
});



export default router;
