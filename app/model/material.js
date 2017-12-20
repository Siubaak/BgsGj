'use strict';

module.exports = app => {
  const MaterialSchema = new app.mongoose.Schema({
    type: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, default: 0 },
    unit: { type: String, default: '个' },
    price: { type: Number, default: 0 },
    enable: { type: Boolean, default: true },
  });
  MaterialSchema.virtual('left').get(function() { return this.quantity; });
  MaterialSchema.set('toJSON', { virtuals: true });
  return app.mongoose.model('Material', MaterialSchema);
};
