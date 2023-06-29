const { NavLink } = ReactRouterDOM
const {  useEffect } = React
const { useState } = React
const { useNavigate }  = ReactRouterDOM


import { UserMsg } from './user-msg.jsx'
import { LoginSignup } from './login-signup.jsx'

// import { userService } from '../services/user.service.local.js'
import { userService } from '../services/user.service.js'

export function AppHeader() {

    const [user, setUser] = useState(userService.getLoggedinUser())
    const navigate = useNavigate()

    function onChangeLoginStatus(user) {
        setUser(user)
    }

    function onLogout() {
        userService.logout()
            .then(()=>{
                setUser(null)
                navigate('/')
            })
    }
    // useEffect(() => {
    // }, [user])

    return (
        <header className='main-layout'>
            <div className='nav-logo'>
                <div className='brand-name'>
                    <img src='assets/img/bug.png'/>
                    {/* <h1 className='app-name'>Bugs Tracker</h1> */}
                </div>
                <nav>
                    <NavLink to="/">Home</NavLink> |
                    <NavLink to="/bug">Bugs</NavLink> |
                    <NavLink to="/about">About</NavLink> |
                    {(user && user.fullname === "Admin") && <NavLink to="/user">Users</NavLink>}
                </nav>
                {user ? (
                    < section className='user'>
                        <h2>Hello {user.fullname}</h2>
                        <button onClick={onLogout}>Logout</button>
                    </ section >
            ) : (
                <section className='user'>
                    <LoginSignup onChangeLoginStatus={onChangeLoginStatus} />
                </section>
            )}
            </div>
            <UserMsg />
        </header>
    )
}
