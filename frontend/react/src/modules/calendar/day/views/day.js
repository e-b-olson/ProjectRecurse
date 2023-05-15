import * as React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

import {Day} from "../models/day.js";

import { CalendarEventGridItem, EventTableGridItem } from "../../event/views/calendar_event.js";

function DayElement({ data }) {
    return DayElement2(data);
}

function DayElement0({ data }) {
    const gridContainer = {
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)"
      };

    if (data == -1) {
      return (
        <Box border={1} borderColor="grey" sx={gridContainer} backgroundColor="lightgray" justifyContent="center" alignItems="center" height={"100%"}>
        </Box>
      );
    }
  
    return (
      <Box border={1} borderColor="black" sx={gridContainer} justifyContent="center" alignItems="center" height={"100%"}>
        <table width="100%">
          <tr align="right"><td><h2>{data.date}</h2></td></tr>
          { data.events.map((event, index)=>{
              return <tr><td>{ event }</td></tr>
            })}
        </table>
        {/*
        <Button variant="contained">Day {data}</Button>
        */}
      </Box>
    );
  }

  function DayElement1(day) {
    if (day == -1) {
      return (
        <Box border={1} borderColor="grey" display="flex" backgroundColor="lightgray" justifyContent="center" alignItems="center" height={"100%"}>
        </Box>
      );
    }

    return (
        <Box border={1} borderColor="black">
            <Grid container direction="row" columns={7} spacing={0} alignItems="stretch">
                { DayHeaderGridItem(day) }
                { day.events.map((calendarEvent, index)=>{
                    return <CalendarEventGridItem calendarEvent={ calendarEvent }></CalendarEventGridItem>
                })}
            </Grid>
        </Box>
    );
}

function DayElement2(day) {
    if (day == -1) {
      return (
        <Box border={1} borderColor="grey" display="flex" backgroundColor="lightgray" justifyContent="center" alignItems="center" height={"100%"}>
        </Box>
      );
    }

    return (
        <Box border={1} borderColor="black" height="100%">
            <Grid container direction="row" columns={7} spacing={0} alignItems="stretch" height="100%">
                { DayHeaderGridItem(day) }
                { EventTableGridItem(day) }
            </Grid>
        </Box>
    );
}

function DayHeaderGridItem(day) {
    if (day instanceof Day) {
        return (
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} justifyContent="flex-end">
                <h2 align='right'>{day.date}</h2>
            </Grid>
        );
    }

    return (
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <h2>Unknown</h2>
        </Grid>
    );
}

export { DayElement };