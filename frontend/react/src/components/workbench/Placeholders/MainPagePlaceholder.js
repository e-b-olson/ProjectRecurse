import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../Auth/AuthContext.js';

export default function MainPagePlaceholder() {
  const authContext = useContext(AuthContext);
  const headline = "Main Page"
  
  return(
    <div className="placeholder">
      <h1>Placeholder: { headline }</h1>
    </div>
  )
}
