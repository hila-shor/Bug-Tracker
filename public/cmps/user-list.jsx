const { Link } = ReactRouterDOM

import { UserPreview } from "./user-preview.jsx"

export function UserList({ users, onRemoveUser , handleSelectUser}) {

    return <section className="user-list">
                <table>
                    <thead>
                    <tr>
                        <th>Id</th>
                        <th>User name</th>
                        <th>Full name</th>
                        {/* <th>Severity</th> */}
                        <th>actives</th>
                        <th><input type="checkbox"/></th>
                    </tr>
                    </thead>
                    <tbody>
                        {users.map(user=> 
                            <UserPreview 
                                key = {user._id} 
                                user ={user} 
                                onRemoveUser={onRemoveUser} 
                                handleSelectUser={handleSelectUser}/>
                        )}
                    </tbody>
                </table>
    </section>
}