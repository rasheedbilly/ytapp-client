import { React, useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import axios from 'axios';
import Cookies from 'universal-cookie';

import "./style.css"
import { credentials } from "../../credentials"


function App(props) {
    const [isLoading, setLoading] = useState(true);
    var spotifyURIs = ""
    const cookies = new Cookies();

    function get_playlist_id(URL) {
        const num_equal_signs = (URL.match(/=/g) || []).length
        if (URL !== null && num_equal_signs === 1)
            return URL.split("=")[1];
        else if (URL !== null && num_equal_signs === 2)
            return URL.split("=")[2];
        else
            return -1
    }

    function get_api_URL(playlist_ID, key) {
        if (playlist_ID === -1)
            return "No GET address"
        else
            return 'https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=50&playlistId=' + playlist_ID + '&key=' + key
    }

    function get_title_list(get_url) {
        var title_list = []
        fetch(get_url, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then((res) => res.json())
            .then((json) => {
                //trim data
                for (var i = 0; i < json.items.length; i++) {
                    title_list.push(json.items[i].snippet.title)
                }

                //Remove extra
                for (var i = 0; i < title_list.length; i++) {
                    title_list[i] = title_list[i]
                        .replace(/\(.+\)/ig, '')
                        .replace(/\[.+\]/ig, '')
                        .replace(/official/ig, '')
                        .replace(/featuring/ig, '')
                        .replace(/feat/ig, '')
                        .replace(/video/ig, '')
                        .replace(/1080p/ig, '')
                        .replace(/music/ig, '')
                        .replace(/Audio/ig, '')
                }

                var query = ""
                var pre_query = "https://api.spotify.com/v1/search?query="
                var post_query = "&type=track&offset=0&limit=20"
                for (var i = 0; i < title_list.length; i++) {
                    if (title_list[i].includes("-")) {
                        query = "track:" + title_list[i].split("-")[1].trim() + "+" +
                            "artist:" + title_list[i].split("-")[0].trim()
                        query = query.replace(/\s/ig, '%20')
                    }
                    else {
                        query = "track:Never%20Gonna%20Give%20You%20Up+artist:Rick%20Ashley"
                    }
                    title_list[i] = pre_query + query + post_query
                }
            })
            .then(() => {
                get_tracks(title_list)
            })
    }

    function get_tracks(title_uri_list) {
        axios('https://accounts.spotify.com/api/token', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(credentials.spotify_API_ID + ':' + credentials.spotify_API_key)
            },
            data: 'grant_type=client_credentials',
            method: 'POST'
        }).then(tokenResponse => {
            //Loop through and get track ID's
            let URI = "";
            let URI_promises = [];
            for (var i = 0; i < title_uri_list.length; i++) {
                URI_promises.push(
                    axios(title_uri_list[i], {
                        method: 'GET',
                        headers: {
                            'Authorization': 'Bearer ' + tokenResponse.data.access_token,
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        }
                    }).then(serchResponse => {
                        try {
                            URI = "spotify:track:" + serchResponse.data["tracks"]["items"][0]["id"] + ","//Assign trackID
                            spotifyURIs += URI
                        } catch (error) {
                            URI = "spotify:track:4cOdK2wGLETKBW3PvgPWqT,"//Rick Ashley
                            spotifyURIs += URI
                        }
                    })//end then(searchResponse)
                )
            } //end For loop

            Promise.all(URI_promises).then(() => {
                //create playlist
                const create_playlist_endpoint = "https://api.spotify.com/v1/users/" + cookies.get("user_id") + "/playlists";
                axios(create_playlist_endpoint, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + cookies.get("user_token"),
                    },
                    data: {
                        "name": "Youtube Playlist",
                        "description": "Playlist of songs converted from a youtube playlist",
                        "public": false
                    }
                }).then(res => {
                    const PLAYLIST_ID = res["data"]["id"]
                    //add items to a playlist
                    const add_items_to_playlist_endpoint = "https://api.spotify.com/v1/playlists/" + PLAYLIST_ID + "/tracks?uris=" + spotifyURIs
                    console.log("My POST to add songs to playlist", add_items_to_playlist_endpoint)
                    axios(add_items_to_playlist_endpoint, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + cookies.get("user_token"),
                        }
                    })//End Axios
                })//End Then
                //Clear Local storage
                localStorage.removeItem("user_token")
                localStorage.removeItem("user_id")
            })//End Promises then
        })
    }

    const { fullURL } = props.userDetails;
    const playlist_ID = get_playlist_id(fullURL)
    const get_address = get_api_URL(playlist_ID, credentials.youtube_API_key)
    useEffect(() => {
        get_title_list(get_address)
        setLoading(false);

    }, [])

    if (isLoading) {
        return <div className="App">Loading...</div>;
    }

    return (
        <div class="jumbotron text-center">
            <h1>Conversion Page</h1>
            {fullURL ? (
                <h3>{`Converting from: ${fullURL}`}</h3>
            ) : (
                <p>No URL entered</p>
            )}
            <button type="button" onClick={() => props.onClear()}>
                clear
            </button>
            <br />
            <button>
                <Link to="/">Go back </Link>
            </button>
        </div>
    )
}
export default App