const { useState, useEffect } = React
const {Link} = ReactRouterDOM

import { userService } from '../services/user.service.js'
// import { userService } from '../services/user.service.local.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

import { UserList } from '../cmps/user-list.jsx'


export function UserIndex() {

    const [users, setUsers] = useState([])
    // const [totalPages, setTotalPages ]= useState(null)
    // const [isTableMode, setIsTableMode] = useState(true)
    const [selectedUsers, setSelectedUsers] = useState([])
  console.log('from UserIndex cmp , users: ', users )
    // console.log('selectedUsers: ',selectedUsers)

    useEffect(() => {
        loadUsers()
    }, [])

    function loadUsers() {
        userService.query()
        .then((users) => {
            setUsers(users)
            // You can do something with the totalPages value here
            // console.log('Total Pages:', totalPages)
            // setTotalPages(totalPages)
        })
        // .then(setUsers)
        .catch(err => {
            console.log('Error from loadUsers ->', err);
            showErrorMsg('Failed to load users');
        })
    }

    function onRemoveUser(userId) {
        userService.remove(userId)
            .then(() => {
                console.log('Deleted Succesfully!')
                const usersToUpdate = users.filter(user => user._id !== userId)
                setUsers(usersToUpdate)
                showSuccessMsg('User removed')
            })
            .catch(err => {
                console.log('Error from onRemoveUser ->', err)
                showErrorMsg('Cannot remove user')
            })
        }

    // function onSetViewMode(){
    //     setIsTableMode(!isTableMode )
    // }

    function handleSelectUser (userId) {
        // console.log('from user-index cmp handleselectUser(), : ', userId)
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(selectedUsers.filter((id) => id !== userId));
        } else {
            setSelectedUsers([...selectedUsers, userId]);
        }
        
    }

    // function onSetFilter(filterBy) {
    //     setFilterBy(filterBy)
    // }

    // function setSort(sortBy){
    //     if (sortBy === 'title') {
    //         // users.sort((c1, c2) => c1.title.localeCompare(c2.title) * Direction)
    //         const sortedUsers= users.slice().sort((c1, c2) => c1.title.localeCompare(c2.title))
    //         setUsers(sortedUsers)
    //     } else if (sortBy === 'createdAt') {
    //         const sortedUsers = users.slice().sort((c1, c2) => (c1.createdAt - c2.createdAt))
    //         setUsers(sortedUsers)
    //         }
    // }

    return (
        <main className='user-index main-layout'>
            <div>Welcome to User-index</div>
            <UserList 
            users={users} 
            onRemoveUser={onRemoveUser} 
            handleSelectUser={handleSelectUser} />
        </main>
    )
}