'use strict';

module.exports = app => {
  return class extends app.Service {
    async find({ findAll, skip = 0, limit = 0 }) {
      let materials;
      if (!findAll) materials = await app.model.Material.find().sort({ type: 1 });
      else {
        materials = await app.model.Material.find().sort({ type: 1 }).skip(skip)
          .limit(limit);
      }
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
      if (!findAll) materials = materials.filter(material => { return material.left > 0; });
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
