const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    postedBy: {
      type: ObjectId,
      ref: 'User',
    },
    images: Array,
    likes: [{ type: ObjectId, ref: 'User' }],
    comments: [
      {
        text: String,
        created: { type: Date, default: Date.now },
        postedBy: {
          type: ObjectId,
          ref: 'User',
        },
      },
    ],
    reported: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
