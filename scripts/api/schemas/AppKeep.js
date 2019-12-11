const mongoose = require('mongoose');
const matchers = require('../utils/matchers');
const dates = require('../utils/dates');

const appKeepSchema = new mongoose.Schema({
  title: {type: String, trim: true},
  category: {type: String, trim: true},
  date: {type: Date},
  amount: {type: Number, min: 0},
  user: {type: String},
  income: {type: Boolean}
});

const model = mongoose.model('AppKeeps', appKeepSchema);

model.monthStatistics = (range, category) => {
  category = category || '';
  return model.aggregate(
    [{
      $match: matchers.matchBy(range, category)
    },
      {
        $group: {
          _id: {
            month: {$month: "$date"},
            category: "$category",
            user: "$user"
          },
          total: {
            $sum: {
              $cond: [
                {$eq: ["$income", true]}, "$amount", {$multiply: ["$amount", -1]}
              ]
            }
          }
        }
      },
      {
        $group: {
          _id: {
            month: "$_id.month"
          },
          categories: {$addToSet: {category: "$_id.category", total: "$total"}},
        }
      }]
  ).exec();
};

model.userStatistics = (range, category) => {
  category = category || '';
  return model.aggregate(
    [{
      $match: matchers.matchBy(range, category)
    },
      {
        $group: {
          _id: {
            user: "$user"
          },
          appKeepTotal: {
            $sum: {
              $cond: [
                {$eq: ["$income", false]}, "$amount", 0
              ]
            }
          },
          incomeTotal: {
            $sum: {
              $cond: [
                {$eq: ["$income", true]}, "$amount", 0
              ]
            }
          }
        }
      },
      {
        $project: {
          _id: "$_id.user",
          incomeTotal: "$incomeTotal",
          appKeepTotal: "$appKeepTotal"
        }
      }]
  ).exec();
};

model.overallStatistics = (category) => {
  category = category || '';
  return model.aggregate(
    [
      {
        $match: matchers.matchBy(dates.all(), category)
      },
      {
        $group: {
          _id: {
            year: {$year: "$date"}
          },
          incomeTotal: {
            $sum: {
              $cond: [{$eq: ["$income", true]}, "$amount", 0]
            }
          },
          appKeepTotal: {
            $sum: {
              $cond: [{$eq: ["$income", false]}, "$amount", 0]
            }
          }
        }
      },
      {
        $project: {
          _id: "$_id.year",
          incomeTotal: "$incomeTotal",
          appKeepTotal: "$appKeepTotal"
        }
      }
    ]
  ).exec();
};

model.yearStatistics = (range, category) => {
  category = category || '';
  return model.aggregate(
    [
      {
        $match: matchers.matchBy(range, category)
      },
      {
        $group: {
          _id: {
            month: {$month: "$date"},
            year: {$year: "$date"}
          },
          incomeTotal: {
            $sum: {
              $cond: [{$eq: ["$income", true]}, "$amount", 0]
            }
          },
          appKeepTotal: {
            $sum: {
              $cond: [{$eq: ["$income", false]}, "$amount", 0]
            }
          }
        }
      },
      {
        $group: {
          _id: "$_id.year",
          months: {
            $push: {
              month: "$_id.month",
              incomeTotal: "$incomeTotal",
              appKeepTotal: "$appKeepTotal"
            }
          }
        }
      }
    ]
  ).exec();
};

module.exports = model;
