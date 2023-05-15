import {CalendarEvent} from "../../event/models/calendar_event.js"

export class Day {
    /*
        NOTE

        These properties require:
            * npm install --save-dev @babel/plugin-proposal-class-properties \
            * update .babelrc to include:
                "plugins": ["@babel/plugin-proposal-class-properties"],

    */
    // #privateDate;
    date;
    events;

    constructor(data = {}) {
        this.date = ("date" in data) ? data.date : Date();
        this.events = ("events" in data) ? data.events : [];
    }

    generateTestEvents() {
        let events = [];

        let eventCount = Math.floor(Math.random() * 10);
        for (var i = 0; i < eventCount; i++) {
            let eventName = "Event " + String(i);
            let event = new CalendarEvent({"name": eventName});
            events.push(event);
        }

        this.events = events;
    }
}