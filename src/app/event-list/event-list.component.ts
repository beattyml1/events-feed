import {Component, Injectable, OnInit} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {map} from "rxjs/operators";
import * as moment from "moment";
import {EventsCollectionService} from "../events-collection.service";

"moment";

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
  events = [];
  constructor(private db: AngularFirestore, private eventsCollection: EventsCollectionService) { }

  ngOnInit() {
    this.eventsData().subscribe(events => {
      console.log(events);
      this.events = events;
    });
  }

  eventsData() {
    return this.eventsCollection.all().pipe(map(events => events.map(e => this.format(e))));
  }

  format(event) {
    return { ...event, dateText: (event.date && event.date.day && event.date.month) ? this.formatDate(event.date) : 'TBA'}
  }

  formatDate(date) {
    return moment()
      .year(date.year||moment().year())
      .month(date.month||moment().month())
      .date(date.day||moment().date())
      .format('ddd, MMM DD');
  }
}
