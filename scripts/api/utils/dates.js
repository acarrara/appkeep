module.exports = {
  thisMonth: function () {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
  },

  thisYear: function () {
    const date = new Date();
    return new Date(date.getFullYear(), 1, 1, 0, 0, 0, 0);
  },

  anYear: function (year) {
    return new Date(year, 1, 1, 0, 0, 0, 0);
  },

  aMonthStart: function (year, month) {
    return new Date(year, Number(month) - 1, 1, 0, 0, 0, 0);
  },

  aMonthEnd: function (year, month) {
    return new Date(year, month, 1, 0, 0, 0, 0);
  },

  start: function () {
    return new Date(2018, 1, 1, 0, 0, 0, 0);
  },

  today: function () {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  },

  now: function () {
    return new Date();
  },

  currentMonth: function () {
    return {start: this.thisMonth(), end: this.now()};
  },

  month: function (year, month) {
    return {start: this.aMonthStart(year, month), end: this.aMonthEnd(year, month)};
  },

  year: function (year) {
    if (year === 'this') {
      return {start: this.thisYear(), end: this.now()};
    } else {
      return {start: this.anYear(year), end: this.anYear(year + 1)};
    }
  },

  all: function () {
    return {start: this.start(), end: this.now()};
  }
};
