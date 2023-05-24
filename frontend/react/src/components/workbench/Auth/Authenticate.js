import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';

import AuthContext from './AuthContext.js';

import './Authenticate.css';

const AuthType = { 
  signIn: "signIn", 
  signUp: "signUp" 
};

async function authenticateAccount(credentials, url) {
    return fetch(url, 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      }
    )
  .then(data => data.json())
};

//export default function Authenticate({ setAccessToken, setRefreshToken }) {
export default function Authenticate() {
  const authContext = useContext(AuthContext);
    
  const [authType, setAuthType] = useState(AuthType.signIn);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const signInUrl = 'http://localhost:8000/auth/sign-in/';
  const signUpUrl = 'http://localhost:8000/auth/sign-up/';

  const signInHeadline = "Sign In";
  const signUpHeadline = "Create Account";

  const changeAuthType = (newAuthType) => {
    setAuthType(newAuthType);
    var newHeadline = (newAuthType == AuthType.signIn) ? signInHeadline : signUpHeadline;
    setHeadline(newHeadline);
    var newToggleLink = (newAuthType == AuthType.signIn) ? signUpLink : signInLink;
    setToggleLink(newToggleLink);
  };

  /* THIS DOESN'T WORK! (the function must be inline!)
  const toggleLinkClick = async e => {
    console.log("*********************************************");
    console.log(authType);
    e.preventDefault();
    if (authType == AuthType.signIn) {
      setAuthType(AuthType.signUp);
      //changeAuthType(AuthType.signUp);
      console.log(AuthType.signUp);
    } else {
      setAuthType(AuthType.signIn);
      //changeAuthType(AuthType.signIn);
      console.log(AuthType.signIn);
    }
    console.log(authType);
  };
  */

  const signInLink = <a href='' onClick={(e) => { e.preventDefault(); changeAuthType(AuthType.signIn);} }>Sign-in</a>;
  const signUpLink = <a href='' onClick={(e) => { e.preventDefault(); changeAuthType(AuthType.signUp);} }>Create Account</a>;

  // var headline = signInHeadline;
  const [headline, setHeadline] = useState(signInHeadline);

  // var toggleLink = signUpLink;  //<-- this needs to be a state var to update the ui
  const [toggleLink, setToggleLink] = useState(signUpLink);

  const handleSubmit = async e => {
    e.preventDefault();
      
    let authUrl = (authType == AuthType.signIn) ? signInUrl : signUpUrl;
    const response = await authenticateAccount({
        email,
        password
        },
        authUrl
    );
    authContext.setAccessToken(response.access_token);
    authContext.setRefreshToken(response.refresh_token);
  };

  return(
    <div className="sign-in-wrapper">
      <h1>{ headline }</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Email</p>
          <input type="text" onChange={e => setEmail(e.target.value)} />
        </label>
        <label>
          <p>Password</p>
          <input type="password" onChange={e => setPassword(e.target.value)} />
        </label>
        <div>
          <button type="submit">Submit</button>
        </div>
        <br />
        <div>
          { toggleLink }
        </div>
      </form>
    </div>
  )
}

/*
Authenticate.propTypes = {
  setAccessToken: PropTypes.func.isRequired,
  setRefreshToken: PropTypes.func.isRequired,
}
*/

Authenticate.propTypes = {}
