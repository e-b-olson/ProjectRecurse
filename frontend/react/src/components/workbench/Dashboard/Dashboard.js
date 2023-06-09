import React from 'react';
import { useContext, useState } from 'react';
import AuthContext from '../Auth/AuthContext.js';

import ProjectCard from '../Project/ProjectCard.js';

import Grid from "@mui/material/Grid";

// TESTING
import { project_01 } from '../utils/example_data/projects.js';

export default function Dashboard() {
  const authContext = useContext(AuthContext);

  // DEMO DATA
  const project_1_owner = {
    "name": "e.b.olson",
  };

  const project_1_tech_stack = [
    "React",
    "Material UI",
    "Django",
    "nginx",
  ];
  
  const project_1 = {
    "title": "Project Recurse",
    "description": "The project that builds itself.",
    "owner": project_1_owner,
    "image_url": "",
    "tech_stack": project_1_tech_stack,
  };
  
  const project_2 = {"title": "MCP"};
  const projects = [project_01, project_2];
  
  return(
    <>
      <h2>Dashboard</h2>
      <Grid container spacing={2}>
	{projects.map((project) => (
	  <Grid item xs={12} md={6} >
	    <ProjectCard project={project} />
	  </Grid>
	))}
      </Grid>
    </>
  );
}
