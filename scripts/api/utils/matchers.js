module.exports = {
  matchBy: function (range, category) {
    const dateMatch = {
      'date': {
        $gte: range.start,
        $lt: range.end
      }
    };
    const categoryMatch = {'category': category};
    return category ? {$and: [dateMatch, categoryMatch]} : dateMatch;
  }
};
