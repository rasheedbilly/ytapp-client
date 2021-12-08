import { React, useState } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Navbar from './pages/Navbar/navbar'
import About from './pages/About'
import Convert from './pages/Convert/Convert'
import NotFound from './pages/NotFound'
import LoginButton from './pages/Components/LoginButton'
import LogoutButton from './pages/Components/LogoutButton'
import User from './pages/User/User'

import "./style.css"
const App = () => {
	const initialState = { fullURL: "", data: [], UserID: "", UserToken: "" };
	const [state, setState] = useState(initialState);
	const [isLoggedin, setLoggedin] = useState(false);

	const handleFirstChange = (e) => {
		const newState = { ...state };
		newState.fullURL = e.target.value;
		setState(newState);
	};

	const fun_setLoggedin = (login_good) => {
		setLoggedin(login_good)
	}

	const resetForm = () => {
		setState(initialState);
	};

	return (
		<div className="App">
			<BrowserRouter>
				<Navbar user={isLoggedin}/>
				<Switch>
					<Route path="/" exact component={Home} >
						<Home onFirstChange={handleFirstChange}/>
					</Route>
					<Route path="/user" exact component={User} />
					<Route path="/about" exact component={About} />
					<Route path="/convert" exact component={Convert} >
						<Convert userDetails={state} onClear={resetForm} />
					</Route>
					<Route path="*" exact component={NotFound} />
				</Switch>
			</BrowserRouter>
		</div>
	)
}

export default App
