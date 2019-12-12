module.exports = {
  thisMonth: function () {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
  },

  thisYear: function () {
    const date = new Date();
    return new Date(date.getFullYear(), 1, 1, 0, 0, 0, 0);
  },

  aYearStart: function (year) {
    return new Date(year, 1, 1, 0, 0, 0, 0);
  },

  aMonthStart: function (year, month) {
    return new Date(year, Number(month) - 1, 1, 0, 0, 0, 0);
  },

  aMonthEnd: function (year, month) {
    return new Date(year, month, 0, 23, 59, 59, 0);
  },

  aYearEnd: function (year) {
    return new Date(year + 1, 0, 0, 23, 59, 59, 0);
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

  origin: function () {
    return new Date(0);
  },

  currentMonth: function () {
    return {start: this.thisMonth(), end: this.now()};
  },

  currentYear: function () {
    return {start: this.thisYear(), end: this.now()};
  },

  month: function (year, month) {
    return {start: this.aMonthStart(year, month), end: this.aMonthEnd(year, month)};
  },

  year: function (year) {
    return {start: this.aYearStart(year), end: this.aYearEnd(year)};
  },

  all: function () {
    return {start: this.origin(), end: this.now()};
  }
};
