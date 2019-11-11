const mongoose = require('mongoose');

const appKeepSchema = new mongoose.Schema({
  title: {type: String, trim: true},
  category: {type: String, trim: true},
  date: {type: Date},
  amount: {type: Number, min: 0}
});

const model = mongoose.model('AppKeeps', appKeepSchema);

model.range = range => {
  return model.aggregate(
    [{
      $match: {
        'date': {
          $gte: range.start,
          $lt: range.end
        }
      }
    },
      {
        $group: {
          _id: "statistics",
          total: {$sum: '$amount'}
        }
      }]
  ).exec();
};

model.statistics = range => {
  return model.aggregate(
    [{
      $match: {
        'date': {
          $gte: range.start,
          $lt: range.end
        }
      }
    },

      {
        $group: {
          _id: {
            month: {$month: "$date"}
          },
          total: {$sum: '$amount'}
        }
      }]
  ).exec();
};

module.exports = model;
