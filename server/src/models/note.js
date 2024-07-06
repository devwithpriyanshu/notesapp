import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
    },
    content: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
        validate: {
          validator: function (val) {
            return val.length <= 9;
          },
          message: '{PATH} exceeds the limit of 9',
        },
      },
    ],
    label: {
      type: String,
      default: null,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    isTrashed: {
      type: Boolean,
      default: false,
    },
    backgroundColor: {
      type: String,
      default: '#FFFFFF',
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    dueDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Note = mongoose.model('Note', NoteSchema);

export default Note;
