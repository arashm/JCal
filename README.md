Jalali-Calendar
===============

A Jalali calendar generator in JavaScript. This calendar uses the [Jalaali-Js](https://raw.githubusercontent.com/jalaali/jalaali-js) library for conversion between Gregorian to Jalali which is based on the [algorithm provided by Kazimierz M. Borkowski](http://www.astro.uni.torun.pl/~kb/Papers/EMP/PersianC-EMP.htm) and has a very good performance.

## Usage

See the [example.html](https://github.com/arashm/Jalali-Calendar/blob/master/example.html). Jalali-Calendar is on early stages and might not be feature complete or usable on specific proposes. [Suggest more features](https://github.com/arashm/Jalali-Calendar/issues).

### Date Formats

Jalali-Calendar will trigger a 'change' event when user choose a date. The event passes a [jDate](https://github.com/arashm/Jalali-Calendar/blob/master/lib/jdate.js) object which will give you the ability to format it's output:

```javascript
calendar.on('change', function(date){
  console.log(date.format('dddd DD MMMM YYYY')) //=> دوشنبه 6 امرداد 1393
});
```

The conversion identifiers are as follows:


| Identifier        | Description           | Example  |
| ------------- | ------------- | ---------- |
| `YYY` or `YYYY`      | Full Year (4 digits) | 1393 |
| `YY`      | Year (2 digits)      |   93 |
| `M` or `MM` | Month in number      |  returns `5` for `امرداد`   |
| `MMM` or `MMMM` | Month in string | `امرداد` |
| `D` or `DD` | Day in number | 26 |
| `d` or `dd` | Abbreviation of day name in string | `۱ش` (for یکشنبه) |
| `ddd` or `dddd` | Full day name in string | `یکشنبه` |

## Contribute

Report bugs and suggest feature in [issue tracker](https://github.com/arashm/Jalali-Calendar/issues). Feel free to `Fork` and send `Pull Requests`.

## ToDo
* Add CSS styles for bigger calenders
* Add support for Persian numbers

## License

[MIT](https://github.com/arashm/Jalali-Calendar/blob/master/LICENSE)
