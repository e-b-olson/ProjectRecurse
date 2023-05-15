import React, { useState } from 'react';
import './WorkbenchApp.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Dashboard from '../Dashboard/Dashboard';
import Preferences from '../Preferences/Preferences';
import SignIn from '../SignIn/SignIn.js';
import Authenticate from '../Auth/Authenticate.js';

import { useAccessToken, useRefreshToken } from './useToken';


// function setToken(userToken) {
//   sessionStorage.setItem('token', JSON.stringify(userToken));
// }

// function getToken() {
//   const tokenString = sessionStorage.getItem('token');
//   const userToken = JSON.parse(tokenString);
//   // return userToken?.token

//   console.log("*******************TOKEN*******************");
//   console.log(userToken);

//   if (userToken != null) {
//     return userToken.token;
//   }
// }


function WorkbenchApp() {
  // const [token, setToken] = useState();
  // const token = getToken();
  
  const { access_token, setAccessToken } = useAccessToken();
  const { refresh_token, setRefreshToken } = useRefreshToken();

  // console.log("******************* WORKBENCH TOKEN *******************");
  // console.log(access_token);

  if(!access_token) {
    return <Authenticate setAccessToken={setAccessToken} setRefreshToken={setRefreshToken} />
  }

  return (
    <div className="wrapper">
      <h1>Application</h1>
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />}>
          </Route>
          <Route path="/preferences" element={<Preferences />}>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default WorkbenchApp;
