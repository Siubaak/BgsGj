'use strict';

module.exports = app => {
  return class extends app.Service {
    async find({ all, skip = 0, limit = 0 }) {
      let model = app.model.Material.find().sort({ type: 1 });
      if (all) model = model.skip(skip).limit(limit);
      const materials = await model;
      for (const material of materials) {
        const matbItems = await app.model.Matbitem.find({
          materialId: material._id,
          $or: [{ condition: '预约' }, { condition: '借出' }],
        });
        let book = 0;
        switch (matbItems.length) {
          case 0:
            break;
          case 1:
            book = matbItems[0].book;
            break;
          default:
            book = matbItems.reduce((a, b) => { return a.book + b.book; });
        }
        material.left = material.quantity - book;
      }
      if (!all) materials = materials.filter(material => { return material.left > 0; });
      return materials;
    }
    async create(material) {
      return await app.model.Material.create(material);
    }
    async update(material) {
      return await app.model.Material.update({ _id: material._id }, { $set: material });
    }
    async removeById(_id) {
      return await Promise.all([
        app.model.Material.remove({ _id }),
        app.model.Matbitem.remove({ materialId: _id }),
      ]);
    }
  };
};
