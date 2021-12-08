import React from "react";
import { useHistory } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react';
import Axios from "axios";
import StripeCheckout from 'react-stripe-checkout'

const Profile = () => {
    const { user, isAuthenticated } = useAuth0();
    var axios = require("axios").default;
    const domain = "dev-drrnp8ff.us.auth0.com"
    const history = useHistory()

    async function registerSubscription(event) {
        event.preventDefault()

        const response = await fetch('http://localhost:1337/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                'name': user.given_name,
                'email': user.email,
                'subscription': "Free"
            },
        })

        const data = await response.json()

        if (data.status === 'ok') {
            history.push('/user')
        }
        else {
            history.push('/404')
        }
    }

    function submitFree() {
        //if exist do patch
        var options = {
            method: 'POST',
            url: 'https://' + domain + '/api/v2/users',
            headers: { authorization: 'Bearer ABCD', 'content-type': 'application/json' },
            data: {
                email: user.email,
                app_metadata: { plan: 'Free' }
            }
        };

        axios.request(options).then(function (response) {
            console.log(response.data);
        }).catch(function (error) {
            console.error(error);
        });
    }

    function submitPremium() {
        //if exist do patch
        console.log("Submitting Premium")
        var options = {
            method: 'POST',
            url: 'https://' + domain + '/api/v2/users',
            headers: { authorization: 'Bearer ABCD', 'content-type': 'application/json' },
            data: {
                email: user.email,
                app_metadata: { plan: 'Full' }
            }
        };

        axios.request(options).then(function (response) {
            console.log(response.data);
        }).catch(function (error) {
            console.error(error);
        });
    }

    return (
        isAuthenticated && (
            <div>
                <img src={user.picture} alt={user.name} />
                <h2>{user.name}</h2>
                <h2>{user.email}</h2>
                <p>{JSON.stringify(user, null, 2)}</p>

                <button onClick={registerSubscription}>
                    Register Subscription
                </button>
                <br/>
                <button onClick={submitPremium()}>
                    Go Premium
                </button>

                <button onClick={submitFree()}>
                    Go Free
                </button>
            </div>
        )

    )
}

//<StripeCheckout
//                    stripekey="pk_test_51K4IAmFaFfRyUYoSs8zKGs58U8wnhIG7rcMdEn2uhwY6ZPyKemVxydZODsOKGgAtFmgBt8Cml4FG2G4OfH523vEs00xohZZpb9"
//                    token={handleToken()
//            billingAddress
//                    shippingAddress
//                    amount={500}}
//            />

export default Profile