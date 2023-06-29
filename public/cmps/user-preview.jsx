
const { useState, useEffect } = React
const { Link } = ReactRouterDOM
import { userService } from '../services/user.service.js'

export function UserPreview({user, onRemoveUser,handleSelectUser}) {
    
    const [isAbleToDelete, setIsAbleToDelete] = useState(user.isAbleToDelete)
    console.log('fullname+ permission to delete: ', user.fullname, isAbleToDelete)
    useEffect(() => {
        // Update the user's isAbleToDelete property when the state changes
        user.isAbleToDelete = isAbleToDelete
    }, [user.isAbleToDelete])

    function toggleDeletePermission(){
        console.log('toggleDeletePermission')
        setIsAbleToDelete(!isAbleToDelete)
        user.isAbleToDelete = !isAbleToDelete
        userService.updateUser(user._id, user)

    }
    return (
        <tr>
            <td>{user._id}</td>
            <td>{user.username}</td>
            <td>{user.fullname}</td>
            {/* <td>{user.severity}</td> */}
            <td>
                <button onClick={() => { onRemoveUser(user._id) }}>x</button>
                <Link className="user-edit-link btn" to={`/user/edit/${user._id}`} >Edit</Link>
                {user.fullname !== "Admin" &&<button onClick={toggleDeletePermission}>{user.isAbleToDelete? 'Able To Delete' : 'Unable To Delete' }</button>}
                {/* <Link to={`/user/${user._id}`}>Details</Link> */}
            </td>
            <td><input type="checkbox"  onChange={() => handleSelectUser(user._id)}/></td>
        </tr>
    )
}
    

