import { useState } from 'react';

export function useAccessToken() {
  const getToken = () => {
    const tokenString = sessionStorage.getItem('access_token');
    const token = tokenString;
    // const token = JSON.parse(tokenString);
    // return userToken?.token
    if (token != null) {
        // console.log("******************* ACCESS TOKEN *******************");
        // console.log(token);
        return token;
    }

    return null;
  };

  const [access_token, setToken] = useState(getToken());

  const saveToken = token => {
    sessionStorage.setItem('access_token', JSON.stringify(token));
    setToken(token);
  };

  return {
    setAccessToken: saveToken,
    access_token
  }
}

export function useRefreshToken() {
    const getToken = () => {
      const tokenString = sessionStorage.getItem('refresh_token');
      const token = tokenString;
      // const token = JSON.parse(tokenString);
      // return userToken?.token
      if (token != null) {
          // console.log("*******************TOKEN*******************");
          // console.log(token);
          return token;
      }
  
      return null;
    };
  
    const [refresh_token, setToken] = useState(getToken());
  
    const saveToken = token => {
      sessionStorage.setItem('refresh_token', JSON.stringify(refresh_token));
      setToken(token);
    };
  
    return {
      setRefreshToken: saveToken,
      refresh_token
    }
  }