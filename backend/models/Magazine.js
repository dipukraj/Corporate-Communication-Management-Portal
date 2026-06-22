const mongoose = require('mongoose');

const magazineSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Magazine name is required'],
      trim: true,
    },
    month: {
      type: String,
      required: [true, 'Month is required'],
      enum: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
      ],
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    pdfUrl: {
      type: String,
      required: [true, 'PDF URL is required'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Magazine', magazineSchema);
