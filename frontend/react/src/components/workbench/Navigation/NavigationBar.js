import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AllInclusive from '@mui/icons-material/AllInclusive';
import { ThemeProvider, createTheme } from "@mui/material/styles";

import { useContext, useState } from 'react';
import AuthContext from '../Auth/AuthContext.js';

import ProfileMenuButton from './ProfileMenuButton.js';

const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Sign out'];

function NavigationBar() {
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
    navigate('/app');
  };
  
  function signOut() {
    localStorage.clear();
    sessionStorage.clear();
    authContext.setAccessToken();
    authContext.setRefreshToken();
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
    if (setting == 'Sign out') {
      signOut();	  
    }
    handleCloseUserMenu();
  };

  return (
    <ThemeProvider theme={theme}>
    <AppBar position="static">
      <Container maxWidth='false'>
        <Toolbar disableGutters>
	  {/*<Box display='flex' flexGrow={1}>*/}
            <AllInclusive sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
	    <AllInclusive sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
	  
	    <Typography
              variant="h6"
              noWrap
              component="a"
              href="/app"
              sx={{
		mr: 2,
		display: { xs: 'none', md: 'flex', lg: 'flex', xl: 'flex' },
		flexGrow: 1,
		fontFamily: 'monospace',
		fontWeight: 700,
		letterSpacing: '.3rem',
		color: 'inherit',
		textDecoration: 'none',
              }}
            >
              { title }
            </Typography>
	    <Typography
              variant="h5"
              noWrap
              component="a"
              href="/app"
              sx={{
		mr: 2,
		display: { xs: 'flex', md: 'none' },
		flexGrow: 1,
		fontFamily: 'monospace',
		fontWeight: 700,
		letterSpacing: '.3rem',
		color: 'inherit',
		textDecoration: 'none',
              }}
            >
              { title }
            </Typography>
	  {/*</Box>*/}
	  <ProfileMenuButton />
        </Toolbar>
      </Container>
    </AppBar>
    </ThemeProvider>
  );
}
export default NavigationBar;
