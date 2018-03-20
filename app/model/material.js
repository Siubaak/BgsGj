'use strict';

module.exports = app => {
  const MaterialSchema = new app.mongoose.Schema({
    type: { type: String, required: true },
    name: { type: String, required: true },
    img: { type: String, default: '' },
    quantity: { type: Number, default: 0 },
    left: { type: Number, default: 0 },
    unit: { type: String, default: '个' },
    price: { type: Number, default: 0 },
    enable: { type: Boolean, default: true },
  });
  return app.mongoose.model('Material', MaterialSchema);
};
