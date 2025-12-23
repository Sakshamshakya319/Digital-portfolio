import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Frontend', 'Backend', 'Database', 'DevOps', 'Tools', 'Languages', 'Frameworks', 'Other']
  },
  proficiency: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  icon: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: '#3B82F6'
  },
  yearsOfExperience: {
    type: Number,
    default: 0
  },
  order: {
    type: Number,
    default: 0
  },
  isVisible: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Skill', skillSchema);