const mongoose = require('mongoose');

// Counter schema for auto-increment _id
const counterSchema = new mongoose.Schema({
  _id: String,
  sequence_value: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);

const productSchema = mongoose.Schema(
  {
    _id: { type: Number },
    ProductID: { type: Number },
    ProductNam: { type: String},
    Brand : { type: String },
    Price: { type: Number},
    Description: { type: String },
    IsActive: { type: Boolean, default: true },
    State: { type: String },

  },
  { collection: 'Product', _id: false }
);

// Pre-save hook to auto-generate serial number _id
productSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        'product_id',
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
      );
      this._id = counter.sequence_value;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model('Product', productSchema);