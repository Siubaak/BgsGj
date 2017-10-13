'use strict';

module.exports = app => {
  const MaterialSchema = new app.mongoose.Schema({
    type: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, default: 0 },
    unit: { type: String, default: '个' },
    price: { type: Number, default: 0 },
  });
  return app.mongoose.model('Material', MaterialSchema);
};