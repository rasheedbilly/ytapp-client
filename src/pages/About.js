import { useState } from "react"

import "./style.css"
import Paypal from '../PayPal'

function App() {

    const [checkout, setCheckout] = useState(false)
    const [donation, setDonation] = useState(0)

    return (
        <div class="jumbotron text-center">
            <h1>About Page</h1>
    
            {checkout ? (
                <Paypal />
            ) : (
                <button onClick={() => { setCheckout(true) }}>Donate</button>
            )}

        </div>
    )
}

export default App