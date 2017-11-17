'use strict';

module.exports = app => {
  return class extends app.Service {
    async count() {
      return await app.model.Material.count();
    }
    async find({ skip = 0, limit = 0 }) {
      let matBooks = await app.model.Matbook.aggregate([
        { $match: { cond: { $lt: 2 } } },
        { $project: { materials: 1 } },
        { $unwind: '$materials' },
        { $group: { _id: '$materials.material', book: { $sum: '$materials.book' } } },
      ]);
      matBooks = this.ctx.helper.arr2Obj(matBooks, '_id', 'book');
      const list = await app.model.Material.find()
        .sort({ type: 1, name: 1 })
        .skip(skip)
        .limit(limit);
      for (const material of list) {
        material.left = material.quantity;
        if (matBooks[material._id]) material.left -= matBooks[material._id];
      }
      const total = await app.model.Material.count();
      return { total, list };
    }
    async findById(id) {
      return await app.model.Material.findById(id) || {};
    }
    async create(material) {
      return await app.model.Material.create(material);
    }
    async update(material) {
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
