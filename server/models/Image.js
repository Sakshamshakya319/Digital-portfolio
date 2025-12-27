import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  name: String,
  data: Buffer,
  contentType: String
}, {
  timestamps: true
});

export default mongoose.model('Image', imageSchema);
