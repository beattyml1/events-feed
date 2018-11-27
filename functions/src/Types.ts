function getTimeFromParts(eventElement, timeSelector) {
  let { hourSelector, minuteSelector, is24HourTime, amPmSelector } = timeSelector;
  let hour = hourSelector && parseInt(eventElement.find(hourSelector).text())
  let minute = minuteSelector && parseInt(eventElement.find(hourSelector).text());
  let amPm = !is24HourTime && eventElement.find(amPmSelector).text();
  let isPm = amPm && amPm.toLowerCase().startsWith('p');
  let isAm = amPm && amPm.toLowerCase().startsWith('a');
  hour = isPm ? hour + 12 : hour;
  hour = hour === 12 && isAm ? 0 : hour;
  return { hour, minute };
}
