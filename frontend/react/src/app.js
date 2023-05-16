import React, { Component, useState } from "react";
// import {hot} from "react-hot-loader";
import "./app.css";

import SignIn from "./modules/auth/views/sign-in";
import { Calendar } from "./modules/calendar/calendar/views/calendar.js";

import WorkbenchApp from "./components/workbench/App/App.js"

function App() {
  // WORKBENCH
  return(
    <div className="App">
      <WorkbenchApp></WorkbenchApp>
    </div>
  );

  const [token, setToken] = useState();

  if(!token) {
    return <SignIn setToken={setToken} />
  }

  return(
    <div className="App">
      <h1>Hello, World!</h1>

      <div>
        <Calendar></Calendar>
      </div>
    </div>
  );
}

export default App;
