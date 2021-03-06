var event = require('event')
  , object = require('object')
  , domify = require('domify')
  , template = require('./template')
  , classes = require('classes')
  , jdate = require('jdate')
  , inGroupsOf = require('in-groups-of')
  , Emitter = require('emitter')
  , normalize = require('normalize')
  , map = require('map');

module.exports = jCal;

/*
 * Helper Functions
 */
var generateHeader = function(daysArray, fullNames) {
  var header = [];
  for (var i = 0; i < daysArray.length; ++i) {
    header.push("<td><abbr title='" + fullNames[i]  + "'>" + daysArray[i] + "</abbr></td>")
  }
  return header;
}

var generateDay = function(year, month, day, selected, today, empty) {
  var cla = [];
  if (empty) {
    return '<td class=\'jcal-body__day--empty\'></td>';
  }
  if (selected) {
    cla.push('jcal-body__day--selected');
  }
  if (today) {
    cla.push('jcal-body__day--today');
  }
  return "<td class='jcal-body__day'><a href='#' data-date='" + [year, month, day].join('-') + "' class='" + (cla.join(' ')) + "'>" + day + "</a></td>";
};

var generateWeek = function (days) {
  return "<tr>" + days.join("\n") + "</tr>"
}

var generateMonth = function(year, month){
  date = new jdate([year, month, 1]);
  today = new jdate;
  days_in_month = jdate.daysInMonth(date.getFullYear(), date.getMonth());
  console.log([days_in_month, date.getFullYear(), date.getMonth()]);
  starting_day_of_month = date._d.getDay();
  ending_day_of_month = new jdate([year, month, days_in_month])._d.getDay();

  // Calculate the empty cells before starting day of month
  if (starting_day_of_month < 6) {
    empty_cells_before = starting_day_of_month + 1
  } else {
    empty_cells_before = 0
  }

  // Calculate the empty cells after last day  of month
  if (ending_day_of_month < 6) {
    empty_cells_after = ending_day_of_month - 5
  } else {
    empty_cells_after = 6
  }

  var days = [];
  for (var day=0; day < empty_cells_before; ++day) {
    days.push(generateDay(year, month, day, false, false, true))
  }

  for (var day=1; day <= days_in_month; ++day) {
    if (year == today.getFullYear() && month == today.getMonth() && day == today.getDate()) {
      is_today = true
    } else {
      is_today = false
    }
    days.push(generateDay(year, month, day, false, is_today ));
  }

  for (var day=0; day < empty_cells_after; ++day) {
    days.push(generateDay(year, month, day, false, false, true))
  }

  days = inGroupsOf(days, 7);
  var weeks = map(days, function(week){
    return generateWeek(week)
  });
  return weeks;
}

/*
 * Default configs
 */
defaults = {
  // Bind the picker to a form field
  field: document.querySelector('body'),

  // Set the initial date
  initialDate: new jdate,

  // Either show abbreviation of week names or not
  showAbbreviated: true,

  // TODO: Either use persian numbers and names or not
  //persian: false,

  // The format of title date to show
  title_format: 'MMMM YYYY',

  l10n_short_days: ['ش', '۱ش', '۲ش', '۳ش', '۴ش', '۵ش', 'ج'],
  l10n_long_days: ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه']
};


/*
 * Initialize new jCal instance with specified configs
 *
 * Events:
 *  `prev`   : when the prev link is clicked
 *  `next`   : when the next link is clicked
 *  `change` : when user selects a date from calendar
 *
 * @params {Object} user configs
 * @api public
 */
function jCal(conf) {
  if (!(this instanceof jCal)) {
    return new jCal(conf)
  }
  Emitter.call(this);
  self = this;
  this._c = object.merge(defaults, conf);
  this.el = this._c.field;
  this.cal = domify(template);
  this.head = this.cal.tHead;
  this.header = this.head.querySelector('.jcal-title');
  this.title = this.head.querySelector('.jcal-controls__year');
  this.body = this.cal.tBodies[0];
  this.on('prev', this.prev);
  this.on('next', this.next);
  this.show(this._c.initialDate);

  // emit "prev"
  event.bind(this.el.querySelector('.jcal-controls__prev'), 'click', normalize(function(e){
    e.preventDefault();

    self.emit('prev');
    return false;
  }));

  // emit "next"
  event.bind(this.el.querySelector('.jcal-controls__next'), 'click', normalize(function(e){
    e.preventDefault();

    self.emit('next');
    return false;
  }));

  // click event on selecting days
  event.bind(this.body, 'click', normalize(function(e) {
    e.preventDefault();
    var el = e.target;
    var date = new jdate(el.getAttribute('data-date').split('-'));
    // remove previos selected date
    if (self.body.querySelector('.jcal-body__day--selected')) {
      classes(self.body.querySelector('.jcal-body__day--selected')).remove('jcal-body__day--selected');
    }
    classes(el).add('jcal-body__day--selected');
    self.select(date);
    self.emit('change', date);
    return false;
  }));
}

/*
 * Mix in Emitter
*/
Emitter(jCal.prototype);

/*
 * Renders selected date into calendar body
 *
 * @params {Array, Date} an Array of Jalali date ([1393, 5, 2]) or a Date object
 * @return {jCal}
 */
jCal.prototype.show = function(date) {
  // Check if date is jDate object with testing if it has `_d` property
  if (date._d) {
    this._date = date;
  } else {
    this._date = new jdate(date);
  }

  if (this._c.showAbbreviated) {
    this.header.innerHTML = generateHeader(this._c.l10n_short_days, this._c.l10n_long_days).join("\n");
  } else {
    this.header.innerHTML = generateHeader(this._c.l10n_long_days, this._c.l10n_long_days).join("\n");
  }

  this.body.innerHTML = generateMonth(this._date.getFullYear(), this._date.getMonth()).join("\n");
  this.updateTitle();
  this.el.appendChild(this.cal);
  return this;
}

/*
 * Shows the previous month
 *
 * @return {jDate}
 */
jCal.prototype.prevMonth = function() {
  date = this._date;
  console.log(date);
  date.setMonth(date.getMonth() - 1)
  return date;
}

/*
 * Shows the next month
 *
 * @return {jDate}
 */
jCal.prototype.nextMonth = function() {
  date = this._date;
  date.setMonth(date.getMonth() + 1);
  return date;
}

/*
 * Renders the previous month into calendar body
 *
 * @return {jCal}
 */
jCal.prototype.prev = function() {
  this.show(this.prevMonth());
  return this;
}

/*
 * Renders the next month into calendatr body
 *
 * @return {jCal}
 */
jCal.prototype.next = function() {
  this.show(this.nextMonth());
  return this;
}

/*
 * Updates title of calendar
 *
 * @return {jCal}
 */
jCal.prototype.updateTitle = function() {
  this.title.textContent = this._date.format(this._c.title_format)
  return this;
}

/*
 * Selects new date
 * ToDo: This function should mark the date as selected.
 *
 * @return {jCal}
 */
jCal.prototype.select = function(date) {
  this.selected = date;
  return this;
}

