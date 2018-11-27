import * as firebase from 'firebase';
import * as moment from 'moment';
import * as cheerio from 'cheerio';
import {RawDataScraper} from "./RawDataScraper";
import {newDate} from "./Date";
import {Types} from "./CoreTypes";

export function PageScraper({ page, dataStructure, pageStructure, itemSelector }: {
  page: CheerioStatic|string, dataStructure, pageStructure, itemSelector: string
} ) {
  let $ = typeof page === "string" ? cheerio.load(page) : page as CheerioStatic ;
  let rawDataScrape = RawDataScraper($);
  function scrapeSingleItemInScope(scope: Cheerio) {
    return Object
      .keys(dataStructure)
      .reduce((result, key) => ({
        ...result,
        [key]: getValueForType(dataStructure[key], rawDataScrape.getRawSelectorData(scope, pageStructure[key]))
      }), {})
  }

  function getValueForType(type: Types, raw): string | number {
    switch (type) {
      case "date": return newDate(raw);
      case "int": return parseInt(raw);
      case "number": return parseFloat(raw);
      case "time": return raw;
      case "text":
      default:
        return raw;
    }
  }

  function scrapeForItems() {
    let items = $(itemSelector);
    return items.map((i, e) => scrapeSingleItemInScope(e as Cheerio)).toArray()
  }

  return { scrapeForItems };
}
