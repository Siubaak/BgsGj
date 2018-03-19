'use strict';

module.exports = app => {
  return class extends app.Service {
    async find({ user, skip = 0, limit = 0 }) {
      let query;
      switch (user) {
        case undefined:
          break;
        case 'back':
          query = { cond: { $lt: 2 } };
          break;
        default:
          query = { user, cond: { $lt: 2 } };
      }
      const list = await app.model.Matbook.find(query)
        .populate('user', 'account')
        .populate('materials.material', 'name')
        .sort({ cond: 1, _id: -1 })
        .skip(skip)
        .limit(limit);
      const total = await app.model.Matbook.count(query);
      return { total, list };
    }
    async findById(id) {
      return await app.model.Matbook.findById(id)
        .populate('user', 'account')
        .populate('materials.material', 'name')
        || {};
    }
    async create(matBook) {
      if (!app.config.isMaterialAvailable) return app.config.ERROR.MATERIAL.INVALID;
      const matBooksNum = await app.model.Matbook.count({ user: matBook.user, cond: { $lt: 2 } });
      if (matBooksNum >= app.config.maxMatBooks) return app.config.ERROR.MATBOOK.INSUFFI;
      let matBooks = await app.model.Matbook.aggregate([
        { $match: { cond: { $lt: 2 } } },
        { $project: { materials: 1 } },
        { $unwind: '$materials' },
        { $group: { _id: '$materials.material', book: { $sum: '$materials.book' } } },
      ]);
      matBooks = this.ctx.helper.arr2Obj(matBooks, '_id', 'book');
      let price = 0;
      for (const material of matBook.materials) {
        const mat = await app.model.Material.findById(material.material);
        if (!mat || !mat.enable) return app.config.ERROR.MATERIAL.NOEXIST;
        let left = mat.quantity - material.book;
        if (matBooks[material.material]) left -= matBooks[material.material];
        if (left < 0) return app.config.ERROR.MATERIAL.INSUFFI;
        price += material.book * mat.price;
      }
      const user = await app.model.User.findById(matBook.user);
      if (user.wallet < price) return app.config.ERROR.USER.INSUFFI;
      matBook.price = price;
      await app.model.User.update({ _id: matBook.user }, { $inc: { wallet: -price } });
      return await app.model.Matbook.create(matBook);
    }
    async update(matBook) {
      if (matBook.cond) {
        const matB = await app.model.Matbook.findById(matBook._id);
        if (!matB) return app.config.ERROR.MATBOOK.NOEXIST;
        if (matB.cond > matBook.cond
          || matB.cond === 0 && matBook.cond === 2
          || matB.cond === 1 && matBook.cond === 3
          || matB.cond === 2 || matB.cond === 3) return app.config.ERROR.MATBOOK.INVALID;
        if (matB.cond === 0 && matBook.cond === 3) {
          await app.model.User.update({ _id: matB.user }, { $inc: { wallet: matB.price } });
        }
      }
      return await app.model.Matbook.findOneAndUpdate({ _id: matBook._id }, { $set: matBook }, { new: true });
    }
    async removeById(_id) {
      return await app.model.Matbook.remove({ _id });
    }
  };
};
