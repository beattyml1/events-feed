export type DateStructure<T> = { day: T, month: T, year?: T };
export type TimeStructure<T> = { hour: T, minute?: T, amPm: T };
export type Types = "date"|"text"|"time"|"int"|"number";

export function isStructuredTime<T=any>(x: any): x is TimeStructure<T> {
  let y = x as TimeStructure<any>;
  return !!y.hour;
}

export function isStructuredDate<T=any>(x: any): x is DateStructure<T> {
  let y = x as DateStructure<any>;
  return !!y.day && !!y.month;
}
