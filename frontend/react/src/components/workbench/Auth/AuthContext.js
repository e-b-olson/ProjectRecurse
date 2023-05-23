import { createContext } from 'react';

const AuthContext = createContext({
    accessToken: null,
    setAccessToken: (token) => {},
    refreshToken: null,
    setRefreshToken: (token) => {}
});

export default AuthContext;
