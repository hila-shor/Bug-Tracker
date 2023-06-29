

const { useState, useEffect } = React
const { useNavigate }  = ReactRouterDOM
const { useParams } = ReactRouterDOM
// const { NavLink } = ReactRouterDOM

import { userService } from '../services/user.service.js'
// import { userService } from '../services/user.service.local.js'
import { utilService } from '../services/util.service.js'
// import { showErrorMsg } from '../service/event-bus.service.js'

export function SoginSignup() {

    const [credentials, setCredentials] = useState(userService.getEmptyCredentials())  
    const [isSignupState, setIsSignupState] = useState(false)
    const { signupState } = useParams()

    console.log(signupState)
    console.log(isSignupState)

    const navigate = useNavigate()
    

    useEffect(() => {
        if (signupState === 'loginState') setIsSignupState(false)
        else if (signupState === 'signupState') setIsSignupState(true)
    }, [signupState])


    function onToggleSignupState(ev) {
        ev.preventDefault()
        setIsSignupState(!isSignupState)  
    }

    function handleCredentialsChange(ev) {
        const field = ev.target.name
        const value = ev.target.value
        setCredentials((prevCreds) => ({ ...prevCreds, [field]: value }))
    }

    function loginAsGuest() {
        console.log('log in as guest')
        userService.login({
        _id: utilService.makeId(),
        username: 'Guest',
        password: 'guest',
    })
        .then(() => {
            navigate('/')
        })
        .catch((err) => {
            console.log('problem with login as guest  in login-signup page', err)
            // showErrorMsg('Had problem to log in');
        })
        } 
        

    function onSubmit(ev) {
        ev.preventDefault();
        if (isSignupState) {
            userService.signup({ ...credentials, fullname: credentials.fullname })
                .then(() => {
                    navigate('/');
                })
                .catch((err) => {
                    console.log('problem with signup in login-signup page', err)
                    // showErrorMsg('Had problem to sign up');
                });
        } else {
            userService.login({...credentials})
                .then((user) => {
                    console.log(user)
                    navigate('/bug');
                })
                .catch((err) => {
                    console.log('problem with login in login-signup page', err)
                    // showErrorMsg('Had problem to log in')
                })
        }
    }

    return (
        <section className="login-signup">
            <div className="login-page">

                <header className="login-header ">
                    <div className="logo flex">
                        <img className="logo-img" src="/assets/img/bug.png" />
                        <h1>Bugs Tracker</h1>
                    </div>
                    {isSignupState && <h2>Sign up for free to start tracking</h2>}
                </header>

                <button className="guest-btn" onClick={loginAsGuest}>Login as a guest</button>

                <form className="login-form grid " onSubmit={onSubmit}>
                    <label>User Name
                        <input
                            className="custom-placeholder"
                            type="text"
                            name="username"
                            value={credentials.username}
                            placeholder="Username"
                            onChange={handleCredentialsChange}
                            required
                        />
                    </label>
                    {/* <label>Email
                        <input
                            className="custom-placeholder"
                            type="email"
                            name="email"
                            value={credentials.email}
                            placeholder="Enter your email"
                            onChange={handleCredentialsChange}
                            required
                        />
                    </label> */}
                    <label>Password
                        <input
                            className="custom-placeholder"
                            type="password"
                            name="password"
                            value={credentials.password}
                            placeholder="Password"
                            onChange={handleCredentialsChange}
                            required
                        />
                    </label>
                    {isSignupState &&
                        <label>Full Name
                            <input
                                className="custom-placeholder"
                                type="text"
                                name="fullname"
                                value={credentials.fullname}
                                placeholder="Full name"
                                onChange={handleCredentialsChange}
                                required
                            />
                        </label>
                    }
                    <button className="registration-btn">{isSignupState ? "Signup" : "Login"}</button>
                    <a href="#" onClick={onToggleSignupState}>
                        {isSignupState ? "Have an account? Login" : "Don\'t have an account? Sign up here"}
                    </a>
                </form>
            </div>
        </section>
    )
}