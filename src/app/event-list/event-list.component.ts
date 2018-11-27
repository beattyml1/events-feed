import {Component, Injectable, OnInit} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {map, flatMap} from "rxjs/operators";
import {Observable, combineLatest, Subject} from "rxjs";
import * as moment from "moment";
import {EventsCollectionService} from "../services/events-collection.service";
import {StarredCollectionService} from "../services/starred-collection.service";
import {Event, EventViewModel} from "../models";

"moment";

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
  events = [];
  city = 'Pittsburgh';
  isStarredOnlyChecked = false;
  filtersChanged$ = new Subject<((e: EventViewModel) => boolean)[]>();
  filters$ = this.filtersChanged$;
  cities$: Observable<string[]>;
  constructor(
    private db: AngularFirestore,
    private eventsCollection: EventsCollectionService,
    private starredCollection: StarredCollectionService) {
  }

  ngOnInit() {
    this.filtered().subscribe(events => {
      this.events = events;
    });
    this.filtersChanged$.next(this.filters());
    this.cities$ = this.eventsData().pipe(map(events => this.citiesForEvents(events)))
  }

  citiesForEvents(events: EventViewModel[]) {
    return events.reduce((cities, event) => (!event.location || cities.includes(event.location.city) ? cities : [...cities, event.location.city]), []);
  }

  starEvent(event: EventViewModel) {
    event.isStarred = !event.isStarred;
    if (event.isStarred)
      this.starredCollection.starEvent(event.id);
    else
      this.starredCollection.unstarEvent(event.id);
  }

  eventsData() {
    const x = this.eventsCollection.all().pipe(
      flatMap(events => this.starredCollection.userStarsGet().pipe(
        map( starred => events.map(event => this.format(event, starred)) as EventViewModel[]),
      ))
    );
    return x;
  }

  toggleStarredOnly() {
    this.isStarredOnlyChecked = !this.isStarredOnlyChecked;
    this.filtersChanged$.next(this.filters());
  }

  cityChanged = (value) => {
    this.city = value;
    this.filtersChanged$.next(this.filters());
  }

  filtered() {
    return this.filters$.pipe(flatMap(filters => {
      return this.eventsData().pipe(map(events => {
        let x = events.filter(event => filters.every(filter => filter(event))) as EventViewModel[];
        return x
      }))
    }));
  }

  filters() {
    return [
      { filter: this.onlyCurrent, active: true },
      { filter: this.onlyStarred, active: this.isStarredOnlyChecked },
      { filter: this.onlyCity(this.city), active: !!this.city }
    ].filter(f => f.active).map(f => f.filter)
  }

  onlyCurrent(e: EventViewModel) {
    return e.moment.isSameOrAfter(moment().startOf('day'));
  }

  onlyStarred(e: EventViewModel) {
    return e.isStarred;
  }

  onlyCity(city) {
    return (e: EventViewModel) => (e.location&&e.location.city) === city;
  }

  format(event: Event, starred): EventViewModel {
    return {
      ...event,
      dateText: (event.date && event.date.day && event.date.month) ? this.formatDate(event.date) : 'TBA',
      moment: moment().year(event.date.year||moment().year()).month(event.date.month).date(event.date.day),
      isStarred: !!starred.some(_ => _.id === event.id)
    }
  }

  formatDate(date) {
    return moment()
      .year(date.year||moment().year())
      .month(date.month||moment().month())
      .date(date.day||moment().date())
      .format('ddd, MMM DD');
  }
}
