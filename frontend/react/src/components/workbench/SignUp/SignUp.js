import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './SignUp.css';

async function POST_SignUp(credentials) {
    return fetch('http://localhost:8000/auth/sign-up/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
      .then(data => data.json())
   }

export default function SignUp({ setAccessToken, setRefreshToken }) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async e => {
    e.preventDefault();
    const response = await POST_SignUp({
      email,
      password
    });

    setAccessToken(response.access_token);
    setRefreshToken(response.refresh_token);
  }

  return(
    <div className="sign-up-wrapper">
      <h1>Create an Account</h1>
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

SignUp.propTypes = {
  setAccessToken: PropTypes.func.isRequired,
  setRefreshToken: PropTypes.func.isRequired,
}