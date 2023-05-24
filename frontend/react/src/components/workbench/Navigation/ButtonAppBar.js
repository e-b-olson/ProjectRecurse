import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

import { useContext, useState } from 'react';
import AuthContext from '../Auth/AuthContext.js';


export default function ButtonAppBar() {
  const authContext = useContext(AuthContext);

  function signOut() {
    localStorage.clear();
    sessionStorage.clear();
    authContext.setAccessToken();
    authContext.setRefreshToken();
  }
    
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            News
          </Typography>
          <Button color="inherit" onClick={signOut}>{authContext.accessToken ? "Sign-out" : "Sign-in"}</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
