import * as React from "react";
import {hot} from "react-hot-loader";
import "../../../../app.css";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import {Action} from "../../action/models/event_action.js"
import {Day} from "../../day/models/day.js";
import {DayElement} from "../../day/views/day.js";
import { CalendarEvent, CompareCalendarEvents } from "../../event/models/calendar_event.js";

export class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
  }

  componentDidMount() {
    fetch("http://0.0.0.0:8000/api/people/1/?format=json")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: [result]
          });
          console.log("**********************");
          console.log(result);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render(){
    const { error, isLoaded, items } = this.state;
    
    console.log(this.state);

    let person = {};

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else if ( items.length > 0 ) {
      person = items[0];
    }

    let calendarData = generateTestCalendar();
    let days = calendarData.days;

    days.forEach((day)=>{day.events.sort(CompareCalendarEvents)});
  
    return(
      <div className="Calendar">
        <h1> Calendar Grid Test </h1>
        <br></br>
        <h1>Hello { person.first_name }!</h1>
        <h1> { calendarData.month } </h1>

        <Grid container direction="row" columns={7} spacing={0} alignItems="stretch">
          { GridColumnHeader("Sunday") }
          { GridColumnHeader("Monday") }
          { GridColumnHeader("Tuesday") }
          { GridColumnHeader("Wednesday") }
          { GridColumnHeader("Thursday") }
          { GridColumnHeader("Friday") }
          { GridColumnHeader("Saturday") }
          { days.map((day, index)=>{
            return <CalendarGridItem classes={""} day={day}></CalendarGridItem>
          })}
        </Grid>
      </div>
    );
  }
}

function GridColumnHeader(title) {
  return (
    <Grid item xs={12} sm={6} md={3} lg={1}>
      <Box display="flex" justifyContent="center" alignItems="center" height={"100%"}>
        <h2>{ title }</h2>
      </Box>
    </Grid>
  );
}

function CalendarGridItem({ day }) {
  return (
    <Grid item xs={12} sm={6} md={3} lg={1}>
      <DayElement data={day}></DayElement>
    </Grid>
  );
}

// TEST DATA

function generateTestCalendar() {
  var days = [];

  let startDate = Date(2022, 8, 12);
  let dateIndex = 0

  let day_00 = new Day({"date": dateIndex, "events": []});
  let day_01 = new Day({"date": (dateIndex + 1), "events": []});
  let day_02 = new Day({"date": (dateIndex + 2), "events": []});

  // day_00.events.push(CalendarEvent({"name": "Start Day"}));

  days.push(day_00);
  days.push(day_01);
  days.push(day_02);
  day_addZofran(day_01);
  day_addColace(day_01);
  day_addPepcid(day_01);

  // Day 2
  day_addEvent_6am(day_02);
  day_addEvent_8am(day_02);
  day_addEvent_2pm(day_02);
  day_addEvent_8pm(day_02);
  day_addEvent_10pm(day_02);

  // Reset
  
  days = [];
  for (var i = 0; i < (7 * 3); i++) {
    let day = generate_day(i);
    days.push(day);
  }

  let calendarData = {};

  let now = new Date();
  let month = new Date(now.getFullYear(), now.getMonth());
  calendarData.month = month.toLocaleString('default', { month: 'long', year: 'numeric' });
  calendarData.days = days;

  return calendarData;
}

function day_addZofran(day) {
  let event6am = new CalendarEvent({"name": "Zofran", "dateTime":6});
  let event2pm = new CalendarEvent({"name": "Zofran", "dateTime":14});
  let event10pm = new CalendarEvent({"name": "Zofran", "dateTime":22});

  day.events.push(event6am);
  day.events.push(event2pm);
  day.events.push(event10pm);
}

function day_addColace(day) {
  let event8am = new CalendarEvent({"name": "Colace", "dateTime":8});
  let event9pm = new CalendarEvent({"name": "Colace", "dateTime":21});

  day.events.push(event8am);
  day.events.push(event9pm);
}

function day_addPepcid(day) {
  let event8am = new CalendarEvent({"name": "Pepcid", "dateTime":8});
  let event9pm = new CalendarEvent({"name": "Pepcid", "dateTime":21});

  day.events.push(event8am);
  day.events.push(event9pm);
}

function day_addEvent_6am(day) {
  let event = new CalendarEvent({"name": "Take Meds - 6am", "dateTime": 6});
  let action_zofran = new Action({"title": "Zofran"});
  event.actions.push(action_zofran);

  day.events.push(event);
}

function day_addEvent_8am(day) {
  let event = new CalendarEvent({"name": "Take Meds - 8am", "dateTime": 8});
  let action_colace = new Action({"title": "Colace"});
  let action_pepcid = new Action({"title": "Pepcid"});
  event.actions.push(action_colace);
  event.actions.push(action_pepcid);

  day.events.push(event);
}

function day_addEvent_2pm(day) {
  let event = new CalendarEvent({"name": "Take Meds - 2pm", "dateTime": 14});
  let action_zofran = new Action({"title": "Zofran"});
  event.actions.push(action_zofran);

  day.events.push(event);
}

function day_addEvent_8pm(day) {
  let event = new CalendarEvent({"name": "Take Meds - 8pm", "dateTime": 14});
  let action_dig = new Action({"title": "Dig"});
  let action_eliquis = new Action({"title": "Eliquis"});
  event.actions.push(action_dig);
  event.actions.push(action_eliquis);

  day.events.push(event);
}

function day_addEvent_10pm(day) {
  let event = new CalendarEvent({"name": "Take Meds - 10pm", "dateTime": 22});

  let action_zofran = new Action({"title": "Zofran"});
  let action_colace = new Action({"title": "Colace"});
  let action_pepcid = new Action({"title": "Pepcid"});

  event.actions.push(action_zofran);
  event.actions.push(action_colace);
  event.actions.push(action_pepcid);

  day.events.push(event);
}

function generate_day(index) {
  var day = new Day({"date": index});
  let endPhase = (7 * 3);

  if (index <= 0) {
    day_addEvent_10pm(day);
  }

  if (index > 0 && index < 3) {
  }

  if (index > 0 && index < endPhase) {
    day_addEvent_6am(day);
    day_addEvent_8am(day);
    day_addEvent_2pm(day);
    day_addEvent_8pm(day);
    day_addEvent_10pm(day);
  }

  return day;
}

//export default hot(module)(Calendar);
