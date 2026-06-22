const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        'login',
        'logout',
        'upload_content',
        'delete_content',
        'create_magazine',
        'delete_magazine',
        'create_user',
        'update_user',
        'delete_user',
        'create_department',
        'update_department',
        'delete_department',
      ],
    },
    details: {
      type: String,
      default: '',
    },
    entityType: {
      type: String,
      enum: ['content', 'magazine', 'user', 'department', 'auth', ''],
      default: '',
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ActivityLog', activityLogSchema);
