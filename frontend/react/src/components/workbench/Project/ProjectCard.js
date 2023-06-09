import * as React from 'react';
import { ThemeProvider, createTheme } from "@mui/material/styles";

import { useContext, useState } from 'react';
import AuthContext from '../Auth/AuthContext.js';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';

export default function ProjectCard(props) {
  const project_description = props.project.description ?? "No desccription yet.";
  const project_owner = props.project.owner ? props.project.owner.display_name : "Unknown";
  
  return(
    <Card>
      <CardHeader
	title={props.project.title}
	subheader={"Owner: " + project_owner}
      />
      <CardMedia>
      </CardMedia>
      <CardContent>
	{project_description}
	<hr />
	{ props.project.urls && props.project.urls['github'] &&
	  <a href={props.project.urls['github']}>github</a>
	}
      </CardContent>
    </Card>
  );
}
