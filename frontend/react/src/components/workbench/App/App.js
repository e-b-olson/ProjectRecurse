import React, { useState } from 'react';

import { createContext, useContext } from 'react';
import AppContext from './AppContext.js';
import AuthContext from '../Auth/AuthContext.js';

import './WorkbenchApp.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Dashboard from '../Dashboard/Dashboard';
import Preferences from '../Preferences/Preferences';
import SignIn from '../SignIn/SignIn.js';
import Authenticate from '../Auth/Authenticate.js';

import ButtonAppBar from '../Navigation/ButtonAppBar.js';
import NavigationBar from '../Navigation/NavigationBar.js';
import MainPagePlaceholder from '../Placeholders/MainPagePlaceholder.js';
import UserProfile from '../Profile/UserProfile.js';

import { useAccessToken, useRefreshToken } from './useToken';


function WorkbenchApp() {
    
  const { accessToken, setAccessToken } = useAccessToken();
  const { refreshToken, setRefreshToken } = useRefreshToken();

  const authContext = { accessToken, setAccessToken, refreshToken, setRefreshToken };

  // console.log("******************* WORKBENCH TOKEN *******************");
  // console.log(accessToken);

  /*
  function isEmpty(value) {
    return (value == null || (typeof value === "string" && value.trim().length === 0));
  }
    
  console.log("Checking access token...\n" + accessToken);
  console.log(typeof accessToken);
  console.log("isEmpty: " + isEmpty(accessToken));
  console.log("is null: " + (accessToken == null));
  console.log("is string: " + (typeof accessToken === "string"));
  if(typeof accessToken === "string") {
    console.log(accessToken.trim().length);
  }
  */
    
  return (
    <div className="wrapper">
      <AuthContext.Provider value={authContext}>
	<BrowserRouter>
	  <NavigationBar />
          <Routes>
	    <Route path="/" element={<MainPagePlaceholder />}>
	    </Route>
            <Route path="/dashboard" element={<Dashboard />}>
            </Route>
            <Route path="/preferences" element={<Preferences />}>
            </Route>
	    <Route path="/authenticate" element={<Authenticate />}>
            </Route>
	    <Route path="/profile" element={<UserProfile />}>
            </Route>
          </Routes>
	</BrowserRouter>
      </AuthContext.Provider>
    </div>
  );
}

export default WorkbenchApp;
