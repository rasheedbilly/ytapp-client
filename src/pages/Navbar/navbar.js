import { Component, useState } from "react"

import { useAuth0 } from '@auth0/auth0-react';

function App(props) {

    const { loginWithRedirect, logout, isAuthenticated } = useAuth0(); 

    function render_navBar_right_components(logged_in) {
        if (isAuthenticated) {
            return (
                <ul className="nav navbar-nav navbar-right">
                    <li><a href="/User"><span className="glyphicon glyphicon-user"></span> User</a></li>
                    <li><a href="#" onClick={() => logout()}><span className="glyphicon glyphicon-log-out"></span> Logout</a></li>
                </ul>
            )
        } else {
            return (
                <ul className="nav navbar-nav navbar-right">
                    <li><a href="#" onClick={() => loginWithRedirect()}><span className="glyphicon glyphicon-log-in"></span> Login</a></li>
                </ul>
            )
        }
    }

    console.log("Props", props.user)

    return (
        <div >
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css" />
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
            <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>

            <nav className="navbar navbar-inverse">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <a className="navbar-brand" href="/">Playlist Converter!</a>
                    </div>
                    <ul className="nav navbar-nav">
                        <li className="active"><a href="/">Home</a></li>
                        <li><a href="/about">About</a></li>
                    </ul>
                    {render_navBar_right_components(props.user)}
                </div>
            </nav>
        </div>
    )

}

export default App
