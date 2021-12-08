
import React from "react";
import { useAuth0 } from '@auth0/auth0-react';

import Profile from '../Components/Profile'

function App() {
    const { isAuthenticated } = useAuth0();

    return (
        isAuthenticated && (
            <Profile />
        )
    )
}

export default App