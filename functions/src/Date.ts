import {DateStructure} from "./CoreTypes";
import * as moment from "moment";

export function newDate(raw: string | DateStructure<string>) {
  return typeof raw === "string"
    ? moment(raw.replace(/\W/g, '')).format()
    : getDateFromParts(raw).format();
}

function monthFormat(monthText) {
  let monthInt = parseInt(monthText)
  if (!isNaN(monthInt)) return monthInt + 1;
  return monthText;
}

function yearFormat(year) {
  if (!year) return year;
  year = parseInt(year);
  return year > 1000 ? year : 2000 + year;
}

let ymd = (y, m, d) => moment().year(y).month(m).date(d).startOf('day');

function getDateFromParts(raw: DateStructure<string>) {
  let {day, month, year} = {
    day: parseInt(raw.day),
    month: monthFormat(raw.month),
    year: yearFormat(year)
  };

  let thisYear = moment().year();
  let date = ymd(year || thisYear, month, day);
  if (!year && moment().startOf('day').isAfter(date))
    date = moment().year(year + 1).month(month).date(day)

  return date;
}
