const mongoose = require('mongoose');

const { Schema } = mongoose;

const WordSchema = new Schema(
  {
    answer: {
      type: String,
      required: true,
      uppercase: true,
    },
    clue: {
      type: String,
      required: true,
    },
    difficulty: {
      type: Number,
      required: true,
    },
    length: {
      type: Number,
      required: true,
    },
    prefixes: [
      {
        type: String,
        required: true,
      },
    ],
    suffixes: [
      {
        type: String,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Word = mongoose.model('Word', WordSchema);

module.exports = Word;
