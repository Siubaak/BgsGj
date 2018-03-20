'use strict';

module.exports = app => {
  return class extends app.Service {
    async find({ enable = false, skip = 0, limit = 0 }) {
      let matBooks = await app.model.Matbook.aggregate([
        { $match: { cond: { $lt: 2 } } },
        { $project: { materials: 1 } },
        { $unwind: '$materials' },
        { $group: { _id: '$materials.material', book: { $sum: '$materials.book' } } },
      ]);
      matBooks = this.ctx.helper.arr2Obj(matBooks, '_id', 'book');
      let query;
      if (enable) query = { enable: true };
      const list = await app.model.Material.find(query)
        .sort({ type: 1, name: 1 })
        .skip(skip)
        .limit(limit);
      for (const material of list) {
        if (matBooks[material._id]) material.left -= matBooks[material._id];
      }
      const total = await app.model.Material.count(query);
      return { total, list };
    }
    async findById(id) {
      return await app.model.Material.findById(id) || {};
    }
    async settings() {
      return { gEnable: app.config.isMaterialAvailable };
    }
    async create(material) {
      const quantity = Number(material.quantity);
      if (isNaN(quantity)) {
        material.quantity = 0;
      } else {
        material.quantity = quantity;
      }
      material.left = material.quantity;
      return await app.model.Material.create(material);
    }
    async update(material) {
      const quantity = Number(material.quantity);
      if (isNaN(quantity)) {
        delete material.quantity;
        delete material.left;
      } else {
        material.quantity = quantity;
        material.left = quantity;
      }
      return await app.model.Material.findOneAndUpdate({ _id: material._id }, { $set: material }, { new: true });
    }
    async removeById(_id) {
      return await Promise.all([
        app.model.Material.remove({ _id }),
        app.model.Matbook.update({}, { $pull: { materials: { material: _id } } }, { multi: true }),
      ]);
    }
  };
};
