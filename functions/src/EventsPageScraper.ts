import * as firebase from 'firebase';
import * as moment from 'moment';
import * as cheerio from 'cheerio';
import {Types} from "./CoreTypes";
import {PageScraper} from "./ScraperCore";

export type DataStructure = { [k: string]: Types};

export function EventsPageScaper(page) {
  console.log(`Parsing Page, page size: ${page&&page.length}`);
  let $;
  try {
    $ = cheerio.load(page);
    console.log('Page parsed')
  } catch (e) {
    console.error(e);
    throw(e);
  }

  function getEventsFromPage({
                               eventSelector,
                               dateSelector,
                               startTimeSelector,
                               endTimeSelector,
                               titleSelector,
                               descriptionSelector,
                               linkSelector,
                               titleMode,
                               descriptionMode

                             }) {
    try {
        let dataStructure = {
          date: "date",
          startTime: "time",
          endTime: 'time',
          title: 'text',
          link: 'text',
          description: 'text'
        } as DataStructure;
        let pageStructure = {
            date: dateSelector,
            startTime: startTimeSelector,
            endTime: endTimeSelector,
            title: { selector: titleSelector, mode: titleMode },
            link: { selector: linkSelector, mode: 'href' },
            description: { selector: descriptionSelector, mode: descriptionMode }
        }
        return PageScraper({ page: $, dataStructure, pageStructure, itemSelector: eventSelector }).scrapeForItems();

    } catch(e) {
      throw Error(`PageScrapeException: ${JSON.stringify(e)}`);
    }
  }
  return {
    scrape(x: { eventSelector, dateSelector, startTimeSelector, endTimeSelector, titleSelector, descriptionSelector, linkSelector,
      titleMode,
      descriptionMode }) {
      console.log('getEventsFromPage', JSON.stringify(x));
      return getEventsFromPage(x);
    }
  };
}
