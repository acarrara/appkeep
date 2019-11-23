module.exports = {
  thisMonth: function () {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
  },

  lastMonth: function () {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
  },

  lastYear: function () {
    const date = new Date();
    return new Date(date.getFullYear() -1 , date.getMonth(), 1, 0, 0, 0, 0);
  },

  today: function () {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  },

  now: function () {
    return new Date();
  },

  month: function (month) {
    switch (month) {
      case 'this':
        return {start: this.thisMonth(), end: this.now()};
      case 'last':
        return {start: this.lastMonth(), end: this.thisMonth()};
      case 'all':
        return {start: this.lastMonth(), end: this.now()};
      default:
        return {start: this.thisMonth()};
    }
  },

  year: function (year) {
    switch (year) {
      case 'last':
        return {start: this.lastYear(), end: this.now()};
      default:
        return {start: this.lastYear()};
    }
  }
};
