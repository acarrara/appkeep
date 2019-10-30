module.exports = {
  thisMonth: function () {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0).getTime();
  },

  lastMonth: function () {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth() - 1, 1, 0, 0, 0, 0).getTime();
  },

  lastYear: function () {
    const date = new Date();
    return new Date(date.getFullYear(), 1, 1, 0, 0, 0, 0).getTime();
  },

  today: function () {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  },

  now: function () {
    return Date.now();
  },

  month: function (month) {
    switch (month) {
      case 'this':
        return {start: this.thisMonth(), end: this.now()};
      case 'last':
        return {start: this.lastMonth(), end: this.thisMonth()};
      default:
        return {start: this.thisMonth()};
    }
  }
};
