import React from 'react'
import ReactDOM from 'react-dom'
import './style.css'
import App from './App'
import { Auth0Provider } from '@auth0/auth0-react';

//const domain = "dev-drrnp8ff.us.auth0.com"
const cliendId = process.env.REACT_APP_AUTH0_CLIENT_ID;

ReactDOM.render(
    <Auth0Provider
      domain={"dev-drrnp8ff.us.auth0.com"}
      clientId={"oy5dK6jXozjT6v6iSXNR3BUp084nuAr0"}
      redirectUri={window.location.origin}>
      <App />
    </Auth0Provider>,
    document.getElementById('root')
  )
  
