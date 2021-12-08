import { React, useEffect, useState } from 'react'
import { useHistory } from "react-router-dom";
import { Button } from 'react-bootstrap';
import axios from 'axios';
import Cookies from 'universal-cookie';

import "./style.css"
import { credentials } from "../credentials"

function App(props) {
    
    const history = useHistory();
    const CLIENT_ID = credentials.spotify_API_ID;
    const SPOTIFY_AUTHORIZE_ENDPOINT = 'http://accounts.spotify.com/authorize';
    const REDIRECT_URL_AFTER_LOGIN = 'https://master.d2f0ydw6985hqy.amplifyapp.com/';
    const SCOPES = [
        'playlist-modify-private',
        'playlist-modify-public',
        'user-library-modify',
        'user-library-read',
        'user-read-email'
    ]
    const SCOPES_URL_PARAM = SCOPES.join("%20")
    const cookies = new Cookies();


    const submitHandler = (event) => {
        event.preventDefault();
    };

    //Make that little window pop up
    const handleLogin = () => {
        const full_url =
            SPOTIFY_AUTHORIZE_ENDPOINT +
            '?client_id=' + CLIENT_ID +
            '&redirect_uri=' + REDIRECT_URL_AFTER_LOGIN +
            '&scope=' + SCOPES_URL_PARAM +
            '&response_type=token' +
            '&show_dialog=true'
        window.location = full_url
    };

    const getReturnedParamsFromSpotifyAuth = (hash) => {
        const stringAfterHash = hash.substring(1)
        const paramsURL = stringAfterHash.split("&")
        const paramsSplitUp = paramsURL.reduce((accumulater, currentValue) => {
            const [key, value] = currentValue.split("=");
            accumulater[key] = value;
            return accumulater;
        }, {});
        return paramsSplitUp;
    };

    useEffect(() => {
        if (window.location.hash) {
            const { access_token, expires_in, token_type } = getReturnedParamsFromSpotifyAuth(window.location.hash);
            console.log("Setting User Token", access_token)
            //localStorage.setItem("user_token", access_token)
            cookies.set('user_token',access_token, {path: '/'})
            //Get User ID
            const user_ID_Endpoint = "https://api.spotify.com/v1/me"
            axios(user_ID_Endpoint, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then(userData => {
                //localStorage.setItem("user_id", userData["data"]["id"])
                cookies.set('user_id',userData["data"]["id"], {path: '/'})
            })
        }
    }, [])//

    return (
        <div className="jumbotron text-center">
            <h1>Convert Youtube to Spotify!</h1>
            <form onSubmit={submitHandler}>
                <div>
                    <p>https://www.youtube.com/watch?v=EwdsnGfrd-k&list=PL7RVBKKO9UqyEr8kqLe9152SIktQjDl64</p>
                    <p>https://www.youtube.com/playlist?list=PLDIoUOhQQPlXr63I_vwF9GD8sAKh77dWU</p>

                    <label htmlFor="yturl"><b>Youtube URL</b></label>
                    <input onChange={props.onFirstChange} type="text" id="yturl" />
                    <br />
                </div>
                <button type="button" onClick={() => history.push("/convert")}> Convert </button>
            </form>

            <Button variant="info" type="submit" onClick={handleLogin}>
                Login to spotify
            </Button>

        </div>
    )
}

export default App
