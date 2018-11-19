import * as functions from 'firebase-functions';
import * as firebase from 'firebase-admin';
import {Scraper} from "./scraper";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
var config = {
  apiKey: "AIzaSyBEeREQw_FGxzAl8mixw_wjxJ3zfLTcqf8",
  authDomain: "events-feed-e51ce.firebaseapp.com",
  databaseURL: "https://events-feed-e51ce.firebaseio.com",
  projectId: "events-feed-e51ce",
  storageBucket: "events-feed-e51ce.appspot.com",
  messagingSenderId: "1000685632990"
};
firebase.initializeApp();

export const scrapeAll_1320345713947_qwwqelcijnrifa = functions.https.onRequest((async (req, resp) => {
  let app = firebase.app();
  let db = app.firestore();
  db.settings({
    timestampsInSnapshots: true
  });
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

