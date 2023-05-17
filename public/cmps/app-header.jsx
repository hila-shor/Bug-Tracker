const { NavLink } = ReactRouterDOM
const {  useEffect } = React

import { UserMsg } from './user-msg.jsx'

export function AppHeader() {


    useEffect(() => {
        // component did mount when dependancy array is empty
    }, [])

    return (
        <header className='main-layout'>
            
            <div className='nav-logo'>
                <div className='brand-name'>
                    <img src='assets/img/bug.png'/>
                <h1 className='app-name'>Bugs Tracker</h1>
                </div>
                <nav>
                    <NavLink to="/">Home</NavLink> |
                    <NavLink to="/bug">Bugs</NavLink> |
                    <NavLink to="/about">About</NavLink>
                </nav>
            </div>
            <UserMsg />
        </header>
    )
}
