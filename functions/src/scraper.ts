import * as request from 'request-promise-native';
import {pageScraper} from "./PageScraper";
import * as admin from "firebase-admin";
import {CollectionReference} from "firebase/firestore";

function flatten<T=any> (list: T[][]){
  return list.reduce((acc, item) => item ? [...acc, ...item] : acc, [])
}


function flatMap<T=any, TOut=any> (list: T[], map: (x: T) => TOut[]){
  return flatten(list.map(map));
}

function formatObjectForFireStore(data) {
  return JSON.parse(JSON.stringify(data));
}

export class Scraper {
  constructor(private db) {

  }

  async getSources() {
    let sources = this.db.collection('sources');
    return (await sources.get()).docs.map(_ => ({ ..._.data(), id: _.id }));
  }

  async scrape() {
    console.log('Fetching Source List')
    let sources = await this.getSources();
    console.log('Fetching Sources');
    let results = (await Promise.all(sources.map(this.scrapeSource))) as {events?: any[], errors?: any[]}[];
    let [events, errors] = [flatMap(results, _=>_.events), flatMap(results, _=>_.errors)];
    return { sources: sources.map(x => x.url), events: events.length, errors };
  }

  scrapeSource = async (source) => {
    try {
      console.log(`Scraping Source: ${JSON.stringify(source.url)}`);
      let page = await this.getPage(source.url);
      console.log(`Scraping Page: ${source.url}`);
      let events = pageScraper(page).scrape(source).map(_ => ({ ..._, source: source.id, location: { name: source.name, city: source.city, state: source.state }}));
      return { events: await this.persistEvents(events).then(() => events) }
    } catch (e) {
      console.error(e);
      return { errors: [e]};
    }
  }

  getPage(url) {
    console.log(`Fetching page: ${url}`);
    return request.get(url)
      .then(resp => {
        return resp;
      })
      .catch(e => { throw  Error(`PageFetchError: ${e}`) });
  }

  async persistEvents(events: any[]) {
    try {
      console.log(`Persisting ${events&&events.length} events`)
      // console.log(JSON.stringify(events));
      let eventsCollection = this.db.collection('events');
      return await Promise.all(events.map(e => this.persistEvent(eventsCollection, e)));
    } catch (e) {
      console.error(e);
      throw Error(`PersistEventsError: ${e}`);
    }
  }

  async persistEvent(eventsCollection: CollectionReference, event: any) {
    let existingEvents = await eventsCollection
      .where('title', "==", event.title || null)
      .where('source', "==", event.source || null)
      .where('date.day', '==', event.date.day || null)
      .where('date.month', '==', event.date.month || null)
      .get();

    if (!existingEvents.docs.length) {
      console.log(`Adding new event ${event.title} @ ${event.location&&event.location.name}`);
      return await eventsCollection.add(formatObjectForFireStore(event));
    }
    else {
      console.log(`Updating existing event ${event.title} @ ${event.location&&event.location.name}`);
      return await existingEvents.docs[0].ref.set(formatObjectForFireStore(event));
    }
  }
}
