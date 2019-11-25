const mongoose = require('mongoose');

const appKeepSchema = new mongoose.Schema({
  title: {type: String, trim: true},
  category: {type: String, trim: true},
  date: {type: Date},
  amount: {type: Number, min: 0},
  user: {type: String}
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
          total: {$sum: '$amount'},
        }
      }]
  ).exec();
};

model.statistics = (range, category) => {
  category = category || '';
  return model.aggregate(
    [{
      $match: matchBy(range, category)
    },
      {
        $group: {
          _id: {
            month: {$month: "$date"},
            category: "$category"
          },
          total: {$sum: "$amount"}
        }
      },
      {
        $group: {
          _id: {
            month: "$_id.month"
          },
          categories: {$addToSet: {category: "$_id.category", total: "$total"}}
        }
      }]
  ).exec();
};

model.yearStatistics = (range, category) => {
  category = category || '';
  return model.aggregate(
    [{
      $match: matchBy(range, category)
    },
      {
        $group: {
          _id: {
            month: {$month: "$date"},
          },
          total: {$sum: "$amount"}
        }
      }]
  ).exec();
};

function matchBy(range, category) {
  const dateMatch = {
    'date': {
      $gte: range.start,
      $lt: range.end
    }
  };
  const categoryMatch = {'category': category};
  return category ? {$and: [dateMatch, categoryMatch]} : dateMatch;
}

module.exports = model;
