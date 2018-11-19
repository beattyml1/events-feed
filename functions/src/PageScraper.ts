import * as firebase from 'firebase';
import * as moment from 'moment';
import * as cheerio from 'cheerio';

export function pageScraper(page) {
  console.log(`Parsing Page, page size: ${page&&page.length}`);
  let $;
  try {
    $ = cheerio.load(page);
    console.log('Page parsed')
  } catch (e) {
    console.error(e);
    throw(e);
  }

  function getEventsFromPage({ eventSelector, dateSelector, startTimeSelector, endTimeSelector, titleSelector, descriptionSelector, linkSelector }) {
    try {
      console.log('scraping for events');
      let eventElements = $(eventSelector);
      console.log(`Found ${eventElements.length} events, getting event info`)
      return eventElements.map((i, e) => {
        let date = dateSelector && selectOrGetFromParts($(e), dateSelector, getDateFromParts);
        let startTime = startTimeSelector && selectOrGetFromParts($(e), startTimeSelector, getTimeFromParts);
        let endTime = endTimeSelector && selectOrGetFromParts($(e), endTimeSelector, getTimeFromParts);
        let title = text(e, titleSelector);
        let link = linkSelector && $(e).find(linkSelector).attr('href')
        let description = text(e, descriptionSelector)
        return {date, startTime, endTime, title, link, description};
      }).toArray();
    } catch(e) {
      throw Error(`PageScrapeException: ${JSON.stringify(e)}`);
    }
  }

  function selectOrGetFromParts(eventElement, selector, getFromParts) {
    try {
      return (typeof selector === 'string') ? moment(eventElement.find(selector)) : getFromParts(eventElement, selector)
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  function forEl(e, selector, thing: (x: Cheerio) => string) {
    try {
      return thing(selector && $(e).find(selector));
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  function text(e, selector) {
    return forEl(e, selector, _=>_.text())
  }

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

  function getDateFromParts(eventElement, dateSelector) {
    let { daySelector, monthSelector, yearSelector } = dateSelector;
    let day = getDayPart(eventElement, daySelector);
    let month = getMonthPart(eventElement, monthSelector);
    let year = yearSelector && eventElement.find(yearSelector).text();
    let ymd = (y, m, d) => moment().year(y).month(m).date(d).startOf('day');
    let thisYear = moment().year();
    let date = ymd(year|| thisYear, month , day);
    if (!year && moment().startOf('day').isAfter(date))
      date = moment().year(year + 1).month(month).date(day)
    return { year: date.year(), month: date.month(), day: date.date(), dayOfWeek: date.day() };
  }

  function getDayPart(eventElement, daySelector) {
    return parseInt(eventElement.find(daySelector).text());
  }

  function getMonthPart(eventElement, monthSelector) {
    if (!monthSelector) return null;
    let monthText = eventElement.find(monthSelector).text();
    let monthInt = parseInt(monthText)
    if (monthInt !== NaN) return monthInt + 1;
    return monthText;
  }
  return {
    scrape(x: { eventSelector, dateSelector, startTimeSelector, endTimeSelector, titleSelector, descriptionSelector, linkSelector }) {
      console.log('getEventsFromPage', JSON.stringify(x));
      return getEventsFromPage(x);
    }
  };
}
