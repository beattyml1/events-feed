import {Moment} from "moment";

export interface Record {
  id: string;
}

export interface Event extends Record {
  date?: { day?, month?, year?, dayOfWeek? };
  title: string
  description?: string
  location?: { name?, city?, state? }
}

export interface StarredData extends Record {
  value: boolean;
}

export interface EventViewModel extends Event {
  isStarred: boolean;
  dateText: string;
  moment: Moment;
}

