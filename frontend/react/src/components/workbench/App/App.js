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

function signOutOld() {
  localStorage.clear();
  sessionStorage.clear();  
  //const { accessToken, setAccessToken } = useAccessToken();
  //setAccessToken(null);
}


//const TestContext = createContext();

function WorkbenchApp() {
  // const [token, setToken] = useState();
  // const token = getToken();

  //const { accessToken, setAccessToken, refreshToken, setRefreshToken } = useContext(AuthContext);
  //const authContext = useContext(AuthContext);

  // const [authContext, setAuthContext] = useState({'accessToken': null, 'refreshToken': null})
  // authContext.setAccessToken = (token) => { authContext.accessToken = token; console.log("SETTING ACCESS TOKEN:\n" + token); }

    
  const { accessToken, setAccessToken } = useAccessToken();
  const { refreshToken, setRefreshToken } = useRefreshToken();

  //const [accessToken, setAccessToken] = useState();
  //const [refreshToken, setRefreshToken] = useState();
  const authContext = { accessToken, setAccessToken, refreshToken, setRefreshToken };  

  // console.log("******************* WORKBENCH TOKEN *******************");
  // console.log(accessToken);

  function signOut() {
    localStorage.clear();
    sessionStorage.clear();
    setAccessToken();
    setRefreshToken();
  }

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
    
  if(!accessToken) {
    return (
	<AuthContext.Provider value={authContext}>
	  <Authenticate />
	</AuthContext.Provider>
      )
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
      <div className="sign-out">  
        <span onClick={signOut}>Sign-out</span>
      </div>
    </div>
  );
}

export default WorkbenchApp;
