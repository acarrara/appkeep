const mongoose = require('mongoose');

const appKeepSchema = new mongoose.Schema({
  title: {type: String, trim: true},
  type: String,
  date: {type: Number, min: 0},
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

module.exports = model;
