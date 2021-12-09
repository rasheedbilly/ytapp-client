import { useState } from "react"

import "./style.css"
import Paypal from '../PayPal'

function App() {

    const [checkout, setCheckout] = useState(false)
    const [donation, setDonation] = useState(0)

    return (
        <div class="jumbotron text-center">
            <h1>About Page</h1>
            <br/>
            <p>This app is to convert your playlist from a youtube playlist URL to a Spotify Playlist</p>
            <ol>
                <li>Get Youtube playlist URL and copy to clipboard</li>
                <li>At Home page, login to Spotigy account by clicking on <b>Login in to Spotify</b></li>
                <li>Hit <b>Accept in Spotify window</b></li>
                <li>Paste Youtube URL into text box</li>
                <li>Hit <b>Convert</b></li>
            </ol>
            <br/>
    
            {checkout ? (
                <Paypal />
            ) : (
                <button onClick={() => { setCheckout(true) }}>Donate</button>
            )}

        </div>
    )
}

export default App