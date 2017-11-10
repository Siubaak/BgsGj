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
      if (matBooksNum < app.config.maxMatBooks) {
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
          let left = mat.quantity - material.book;
          if (matBooks[material.material]) left -= matBooks[material.material];
          if (left < 0) return null;
          price += material.book * mat.price;
        }
        const user = await app.model.User.findById(matBook.user);
        if (user.wallet < price) return null;
        matBook.price = price;
        await app.model.User.update({ _id: matBook.user }, { $inc: { wallet: -price } });
        return await app.model.Matbook.create(matBook);
      }
      return null;
    }
    async update(matBook) {
      this.ctx.helper.delProps(matBook, [ 'user', 'price', 'takeDate', 'returnDate', 'materials' ]);
      if (matBook.cond) {
        const matB = await app.model.Matbook.findById(matBook._id);
        if (!matB || matB.cond > matBook.cond) return null;
        if (matB.cond === 0 && matBook.cond === 3) {
          console.log(await app.model.User.findById(matB.user));
          await app.model.User.update({ _id: matB.user }, { $inc: { wallet: matB.price } });
          console.log(await app.model.User.findById(matB.user));
        }
      }
      return await app.model.Matbook.findOneAndUpdate({ _id: matBook._id }, { $set: matBook }, { new: true });
    }
    async removeById(_id) {
      return await app.model.Matbook.remove({ _id });
    }
  };
};
