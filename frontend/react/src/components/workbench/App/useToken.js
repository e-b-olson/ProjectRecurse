import { useState } from 'react';

export function useAccessToken() {
  const getToken = () => {
    const tokenString = sessionStorage.getItem('access_token');
    const token = tokenString;
    // const token = JSON.parse(tokenString);
    // return userToken?.token
    if (token) {
        // console.log("******************* ACCESS TOKEN *******************");
        // console.log(token);
        return token;
    }

    return null;
  };

  const [access_token, setToken] = useState(getToken());

  const saveToken = token => {
    // console.log("******************* SETTING ACCESS TOKEN *******************");
    // console.log(token);

    if (!token) {
      sessionStorage.removeItem('access_token');
    } else {
      sessionStorage.setItem('access_token', JSON.stringify(token));
    }
    
    setToken(token);
  };

  return {
    accessToken: access_token,
    setAccessToken: saveToken
  }
}

export function useRefreshToken() {
    const getToken = () => {
      const tokenString = sessionStorage.getItem('refresh_token');
      const token = tokenString;
      // const token = JSON.parse(tokenString);
      // return userToken?.token
      if (token) {
          // console.log("*******************TOKEN*******************");
          // console.log(token);
          return token;
      }
  
      return null;
    };
  
    const [refresh_token, setToken] = useState(getToken());
  
    const saveToken = token => {
      if (!token) {
        sessionStorage.removeItem('refresh_token');
      } else {
	sessionStorage.setItem('refresh_token', JSON.stringify(token));
      }	
      setToken(token);
    };
  
    return {
      refreshToken: refresh_token,
      setRefreshToken: saveToken
    }
  }
