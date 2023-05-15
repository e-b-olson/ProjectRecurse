import {Action} from "../../action/models/event_action.js";

export class CalendarEvent {
    name;
    dateTime;
    actions = [];
    complete = false;

    constructor(data = {}) {
        this.name = data.name;
        this.dateTime = data.dateTime;
        this.actions = ("actions" in data) ? data.actions : [];
        this.complete = data.complete;
    }

    setComplete(value) {
        this.complete = value;
    }
}

// COMPARE

function CompareCalendarEvents(a, b) {
    if ( a.dateTime < b.dateTime ){
        return -1;
      }
      if ( a.dateTime > b.dateTime ){
        return 1;
      }
      return 0;
}

// TEST

function generateTestEvent() {
    let event = CalendarEvent();

    event.dateTime = generateRandomDateTime();
    event.name = generateRandomEventName();

    return event;
}

function generateRandomDateTime() {

}

function generateRandomEventName() {

}

export {CompareCalendarEvents};