import * as React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

import {CalendarEvent} from "../models/calendar_event.js";

function CalendarEventGridItem({ calendarEvent }) {
    if (calendarEvent instanceof CalendarEvent) {
        return (
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <h5>{ calendarEvent.name }</h5>
            </Grid>
        )
    }

    return (
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <h5>Bad Event</h5>
      </Grid>
    );
}

function EventTableGridItem(day) {
    return (
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} height="100%">
          <table width="100%">
            <tbody>
            { day.events.map((calendarEvent, index)=>{
                return ( EventTableRow(calendarEvent) );
            })}
            </tbody>
        </table>
        </Grid>
      );
}

function EventTableRow(event) {
    return (
        <tr>
            <td>
                <Button variant="contained">{ event.name }</Button>
            </td>
        </tr>
    );
}

export { CalendarEventGridItem, EventTableGridItem };