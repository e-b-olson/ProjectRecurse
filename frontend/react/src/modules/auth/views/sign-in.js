import React, { useState } from 'react';
import PropTypes from 'prop-types';

async function apiSignIn(credentials) {
  return fetch('http://localhost:8000/auth/sign-in/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
  .then((response) => {
    if (!response.ok) throw new Error(response.status);
    else return response;
  })
  .then(data => data.json())
}

export default function SignIn({ setToken }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async e => {
    e.preventDefault();
    const token = await apiSignIn({
      username,
      password
    });
    setToken(token);
  }

  return(
    <div className="login-wrapper">
      <h1>Please Sign In</h1>
      <form onSubmit={handleSubmit}>
      <label>
        <p>email</p>
        <input type="text" onChange={e => setUserName(e.target.value)} />
      </label>
      <label>
        <p>password</p>
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
    setToken: PropTypes.func.isRequired
}
