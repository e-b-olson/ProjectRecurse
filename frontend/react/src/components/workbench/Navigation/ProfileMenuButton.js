import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

import { ThemeProvider, createTheme } from "@mui/material/styles";

import { useContext, useState } from 'react';
import AuthContext from '../Auth/AuthContext.js';

const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function ProfileMenuButton() {
  const authContext = useContext(AuthContext);
  const title = "Project Recurse"
    
  const theme = createTheme({
    palette: {
      primary: {
	main: "#3581B8"
      },
      secondary: {
	main: "#C5FFFD"
      },
      error: {
	main: "#E85F5C"
      },
      warning: {
	main: "#FFBC42"
      },
      info: {
	main: "#AAAAAA"
      },
      success: {
	main: "#474350"
      }
    }
  });

  const navigate = useNavigate();
  function goHome() {
    navigate('/');
  };
  
  function signOut() {
    localStorage.clear();
    sessionStorage.clear();
    authContext.setAccessToken();
    authContext.setRefreshToken();

    goHome();
  };

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

    /*
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
    };
    */

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };


  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const onUserMenuItemClick = (event, setting) => {
    if (setting == 'Logout') {
      signOut();	  
    }
    handleCloseUserMenu();
  };

  if (!authContext || !authContext.accessToken) {
    return (
	<h5><a href="authenticate">SIGN-IN</a></h5>
    )
  }
    
  return (
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
		{settings.map((setting) => (
                  <MenuItem key={setting} onClick={(event) => onUserMenuItemClick(event, setting)}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
  );
}
export default ProfileMenuButton;
