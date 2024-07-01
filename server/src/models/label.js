import mongoose from 'mongoose';

const LabelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Label = mongoose.model('Label', LabelSchema);

export default Label;
