import * as functions from 'firebase-functions';
import * as firebase from 'firebase-admin';
import {Scraper} from "./scraper";

async function verifyHttpsAdminAuth(req, resp, db) {
  let apiToken = req.header('ApiToken');
  let apiTokens = (await db.collection('api_tokens').get().then(_ => _.docs.map(doc => doc.data())));
  let isAuthorized = apiTokens.includes(apiToken);
  if (!isAuthorized) {
    resp.status(403);
    resp.send("You're not supposed to be doing that")
  }
}

function defaultFirestore() {
  let app = firebase.app();
  let db = app.firestore();
  try {
    db.settings({
      timestampsInSnapshots: true
    });
  } catch (e) {
    console.info(e);
  }
  return db;
}

firebase.initializeApp();

export const hourlyScrape = functions.pubsub.topic('hourly-tick').onPublish(async (message, context) => {
  let scraper = new Scraper(defaultFirestore());
  return await scraper.scrape();
});

export const scrapeOnce = functions.https.onRequest((async (req, resp) => {
  let db = defaultFirestore();
  verifyHttpsAdminAuth(req, resp, db);
  let scraper = new Scraper(db);
  try {
    let results = await scraper.scrape();
    resp.send(`Scrape complete ${JSON.stringify(results)}`);
  } catch (e){
    resp.status(500);
    resp.send(e);
    throw e;
  }
}));

