const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  standard: {
    type: String,
    required: [true, 'Standard is required'],
    trim: true
  },
  division: {
    type: String,
    required: [true, 'Division is required'],
    trim: true,
    uppercase: true
  }
}, {
  timestamps: true
});

// Create compound index to ensure unique combination of standard and division
classSchema.index({ standard: 1, division: 1 }, { unique: true });

// Virtual for full class name
classSchema.virtual('fullClassName').get(function() {
  return `${this.standard}-${this.division}`;
});

// Ensure virtual fields are serialized
classSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Class', classSchema);