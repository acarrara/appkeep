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
            category: "$category"
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
          outTotal: {
            $sum: {
              $cond: [
                {$eq: ["$income", false]}, "$amount", 0
              ]
            }
          },
          inTotal: {
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
          inTotal: "$inTotal",
          outTotal: "$outTotal"
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
          inTotal: {
            $sum: {
              $cond: [{$eq: ["$income", true]}, "$amount", 0]
            }
          },
          outTotal: {
            $sum: {
              $cond: [{$eq: ["$income", false]}, "$amount", 0]
            }
          }
        }
      },
      {
        $project: {
          _id: "$_id.year",
          inTotal: "$inTotal",
          outTotal: "$outTotal"
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
          inTotal: {
            $sum: {
              $cond: [{$eq: ["$income", true]}, "$amount", 0]
            }
          },
          outTotal: {
            $sum: {
              $cond: [{$eq: ["$income", false]}, "$amount", 0]
            }
          }
        }
      },
      {
        $sort: {
          _id: -1
        }
      },
      {
        $group: {
          _id: "$_id.year",
          ranges: {
            $push: {
              month: "$_id.month",
              inTotal: "$inTotal",
              outTotal: "$outTotal"
            }
          }
        }
      }
    ]
  ).exec();
};

model.yearCategoryStatistics = (range, category) => {
  category = category || '';
  return model.aggregate(
    [{
      $match: matchers.matchBy(range, category)
    },
      {
        $group: {
          _id: {
            year: {$year: "$date"},
            category: "$category"
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
            year: "$_id.year"
          },
          categories: {$addToSet: {category: "$_id.category", total: "$total"}},
        }
      },
      {
        $project: {
          _id: "$_id.year",
          categories: 1
        }
      }]
  ).exec();
};

model.overallCategoryStatistics = (range, category) => {
  category = category || '';
  return model.aggregate(
    [{
      $match: matchers.matchBy(range, category)
    },
      {
        $group: {
          _id: {
            category: "$category"
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
        $project: {_id: 0, category: "$_id.category", total: 1}
      }]
  ).exec();
};

module.exports = model;
