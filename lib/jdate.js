var jalali = require('./jalali')
    , map = require('map');

module.exports = jDate;

var MONTH_NAMES = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'امرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
var ABBR_DAYS = ['۱ش', '۲ش', '۳ش', '۴ش', '۵ش', 'ج', 'ش'];
var DAYS_NAMES = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];

/*
 * Helper Functions
 */
var fix_month = function(year, month) {
  if (month > 12 || month <= 0) {
    var yearDiff = Math.floor((month - 1) / 12);
    year += yearDiff;
    month = month - yearDiff * 12;
  }
  return [year, month]
}

var replaceYear = function(str, date) {
  match = str.match(/[yY]+/);
  if (match) {
    switch (match[0]) {
    case 'YYYY':
    case 'YYY':
      var value = replaceYear(str.replace(match, date.getYear()), date);
      return value;
    case 'YY':
      var value = replaceYear(str.replace(match, String(date.getYear()).slice(2)), date);
      return value;
    }
  } else {
    return str;
  }
}

var replaceMonth = function(str, date) {
  match = str.match(/[mM]+/);
  if (match) {
    switch (match[0]) {
    case 'M':
    case 'MM':
      var value = replaceMonth(str.replace(match, date.getMonth()), date);
      return value;
    case 'MMM':
    case 'MMMM':
      var value = replaceMonth(str.replace(match, MONTH_NAMES[date.getMonth() - 1]), date);
      return value;
    }
  } else {
    return str
  }
}

var replaceDay = function(str, date) {
  match = str.match(/[dD]+/);
  if (match) {
    switch (match[0]) {
    case 'D':
    case 'DD':
      var value = replaceDay(str.replace(match, date.getDate()), date);
      return value;
    case 'd':
    case 'dd':
      var value = replaceDay(str.replace(match, ABBR_DAYS[date._d.getDay()]), date);
      return value;
    case 'ddd':
    case 'dddd':
      var value = replaceDay(str.replace(match, DAYS_NAMES[date._d.getDay()]), date);
      return value;
    }
  } else {
    return str;
  }
 }

 /*
  * Initialize jDate with either a Date object or an Array of
  * Jalali date: [1393, 5, 3]
  *
  * @params {Array, Date} date
  */
function jDate(_date) {
  var date, _d
  this._d = _date || new Date;
  if (this._d instanceof Array) {
    this.date = map(this._d, function(v){
      return parseInt(v);
    });
    this._d = this.to_gregorian();
  } else if (this._d instanceof Date) {
    this.date = jDate.to_jalali(this._d);
  }
}

/*
 * Converts jDate date to Gregorian
 */
jDate.prototype.to_gregorian = function() {
  return jDate.togregorian(this.date[0], this.date[1], this.date[2]);
}

/*
 * Shows Jalali's full year, ex: 1393
 *
 * @return {Integer}
 */
jDate.prototype.getYear = function() {
  return this.date[0];
}

/*
 * Sets the Jalali full year
 *
 * @params {Number} year
 * @return {jDate}
 */
jDate.prototype.setYear = function(year) {
  this.date[0] = parseInt(year);
  this._d = this.to_gregorian;
  return this
}

/*
 * Shows Jalali month number.
 *
 * @return {Number} Jalali month number
 */
jDate.prototype.getMonth = function() {
  return this.date[1];
}

/*
 * Sets the Jalali month number. An integer between 0 and 11
 *
 * @params {Number} month
 * @returns {jDate}
 */
jDate.prototype.setMonth = function(month) {
  fixed = fix_month(this.getYear(), parseInt(month));
  this.date[0] = fixed[0];
  this.date[1] = fixed[1];
  this._d = this.to_gregorian;
  return this
}

/*
 * Shows Jalali day number. A number between 0 to 31
 *
 * @return {Number} Jalali day number
 */
jDate.prototype.getDate = function() {
  return this.date[2];
}

/*
 * Sets Jalali day number. A number between 0 to 31
 *
 * @params {Number} date
 * @return {jDate}
 */
jDate.prototype.setDate = function(date) {
  this.date[2] = parseInt(date);
  this._d = this.to_gregorian;
  return this
}

/*
 * Returns a formated output of current date
 *
 * @params {String} format
 * @return {String}
 */
jDate.prototype.format = function(format) {
  format = replaceYear(format, this);
  format = replaceMonth(format, this);
  format = replaceDay(format, this);
  return format;
}

/*
 * Coverts a Gregorian date to Jalali date
 *
 * @params {Date} date
 * @return {Array}
 */
jDate.to_jalali = function(date) {
  var jdate = jalali.d2j(jalali.g2d(date.getFullYear(), date.getMonth() + 1, date.getDate()));
  return [jdate.jy, jdate.jm, jdate.jd]
}

/*
 * converts a Jalali date to Gregorian
 *
 * @params {Number} year
 * @params {Number} month
 * @params {Number} day
 * @return {Date}
 */
jDate.togregorian = function(year, month, day) {
  var gdate = jalali.d2g(jalali.j2d(year, month, day));
  return new Date(gdate.gy, gdate.gm - 1, gdate.gd);
}

/*
 * Checks if a given year is a leap year or not
 *
 * @params {Number} year
 * @return {Boolean}
 */
jDate.isLeapYear = function(year) {
  return jalali.jalCal(year).leap === 0
}

/*
 * Returns month length
 *
 * @params {Number} year
 * @params {Number} month
 * @return {Number}
 */
jDate.daysInMonth = function (year, month) {
  year += ~~(month / 12)
  month = month - ~~(month / 12) * 12
  if (month < 0) {
    month += 12
    year -= 1
  }
  if (month < 6) {
    return 31
  } else if (month < 11) {
    return 30
  } else if (jDate.isLeapYear(year)) {
    return 30
  } else {
    return 29
  }
}

