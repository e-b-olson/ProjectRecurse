import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AuthContext from '../Auth/AuthContext.js';

export default function UserProfile() {
  const authContext = useContext(AuthContext);

  const navigate = useNavigate();
  function goToAuth() {
    navigate('/authenticate');
  };
  
  if (!authContext || !authContext.accessToken) {
    goToAuth();
  }

  return (
    <div class="profile">
      <h1>Placeholder: User Profile</h1>
      <div class="profile-photo">
      </div>
      <div class="profile-username">
      </div>
      <div class="profile-display-name">
      </div>
      <div class="profile-skills">
      </div>
    </div>
  );
};
