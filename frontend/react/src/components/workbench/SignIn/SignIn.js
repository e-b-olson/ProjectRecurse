import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './SignIn.css';

async function signInUser(credentials) {
    return fetch('http://localhost:8000/auth/sign-in/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
      .then(data => data.json())
   }

export default function SignIn({ setAccessToken, setRefreshToken }) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async e => {
    e.preventDefault();
    const response = await signInUser({
      email,
      password
    });
    //console.log("TOKEN");
    //console.log(token);
    setAccessToken(response.access_token);
    setRefreshToken(response.refresh_token);
  }

  return(
    <div className="sign-in-wrapper">
      <h1>Please Sign In</h1>
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
      </form>
    </div>
  )
}

SignIn.propTypes = {
  setAccessToken: PropTypes.func.isRequired,
  setRefreshToken: PropTypes.func.isRequired,
}