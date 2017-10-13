'use strict';

module.exports = app => {
  return class extends app.Service {
    async find({ user, skip = 0, limit = 0 }) {
      const matBooks = await (() => {
        switch (user) {
          case undefined:
            return app.model.Matbook.find();
          case 'back':
            return app.model.Matbook.find({
              $or: [{ cond: '预约' }, { cond: '借出' }],
            });
          default:
            return app.model.Matbook.find({
              user,
              $or: [{ cond: '预约' }, { cond: '借出' }],
            });
        }
      })()
        .populate('user', 'account').sort({ _id: -1 })
        .skip(skip)
        .limit(limit);
      for (const matBook of matBooks) {
        matBook.book = await app.model.Matbitem.find({ matbookId: matBook._id }).populate('material', 'name', 'unit');
      }
      return matBooks;
    }
    async findById(id) {
      return await app.model.Matbook.findById(id);
    }
    async create({ matBook, matbItems }) {


      const matBooksNum = await app.model.Matbook.count({ user: matBook.user, $or: [{ cond: '预约' }, { cond: '借出' }] });
      if (matBooksNum < app.config.maxMaterialBook) {
        const matBookId = (await app.model.Matbook.create(matBook)).insertedIds[0];
        matbItems.forEach(matbItem => { matbItem.matBook = matBookId; });
        return await app.model.Matbitem.create(matbItems);
      }
      return false;
    }
    async update(matBook) {
      return await app.model.Matbook.update({ _id: matBook._id }, { $set: matBook });
    }
    async updateCond({ id, cond }) {
      return await Promise.all([
        app.model.Matbook.update({ _id: id }, { $set: { cond } }),
        app.model.Matbitem.update({ matBook: id }, { $set: { cond } }, { multi: true }),
      ]);
    }
    async removeById(_id) {
      return await Promise.all([
        app.model.Matbook.remove({ _id }),
        app.model.Matbitem.remove({ matBook: _id }),
      ]);
    }
  };
};
