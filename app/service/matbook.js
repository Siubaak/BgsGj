'use strict';

module.exports = app => {
  return class extends app.Service {
    async count() {
      return await app.model.Matbook.count();
    }
    async find({ user, skip = 0, limit = 0 }) {
      let model;
      switch (user) {
        case undefined:
          model = app.model.Matbook.find();
          break;
        case 'back':
          model = app.model.Matbook.find({ cond: { $lt: 2 } });
          break;
        default:
          model = app.model.Matbook.find({ user, cond: { $lt: 2 } });
      }
      return await model
        .populate('user', 'account')
        .populate('materials.material', 'name')
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit);
    }
    async findById(id) {
      return await app.model.Matbook.findById(id)
        .populate('user', 'account')
        .populate('materials.material', 'name')
        || {};
    }
    async create(matBook) {
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
      this.ctx.helper.delProps(matBook, [ 'user', 'price', 'takeDate', 'returnDate', 'materials' ]);
      if (matBook.cond) {
        const matB = await app.model.Matbook.findById(matBook._id);
        if (!matB) return app.config.ERROR.MATBOOK.NOEXIST;
        if (matB.cond > matBook.cond) return app.config.ERROR.MATBOOK.INVALID;
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
