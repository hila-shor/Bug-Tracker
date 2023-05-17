const Router = ReactRouterDOM.HashRouter
const { Route, Routes } = ReactRouterDOM
import routes from './routes.js'

import { AppHeader } from './cmps/app-header.jsx'
import { AppFooter } from './cmps/app-footer.jsx'

export function App() {

    return <Router>
        <div className='app-container'>
            <AppHeader />
            <main className='main-content'>
                <Routes>
                    {routes.map(route =>
                        <Route key={route.path} element={<route.component />} path={route.path} />
                    )}
                </Routes>
            </main>
            <AppFooter />
        </div>
    </Router>

}


