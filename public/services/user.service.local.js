import { storageService } from './async-storage.service.js'
// import { utilService } from './util.service.js'


const STORAGE_KEY = 'userDB'
_createUsers()

export const userService = {
  getById,
  remove,
  signup,
  login,
  logout,
  _saveLoggedinUser,
  getLoggedinUser,
  getEmptyCredentials
}



function getById(userId) {
  return storageService.get(STORAGE_KEY, userId)
}

function remove(userId) {
  return storageService.remove(STORAGE_KEY, userId)
}

function signup(credentials) {
  return storageService.post(STORAGE_KEY, credentials)
    .then(user => {
      _saveLoggedinUser(user)
      return user
    })
}

function login(credentials) {
  console.log('hi from login- user.service')
  return storageService.query(STORAGE_KEY)
    .then(users => {
      const user = users.find(user => user.username === credentials.username)
      if (!user) return Promise.reject('Login failed')
      _saveLoggedinUser(user)
      return user
    })
}

function logout() {
  sessionStorage.removeItem('loggedinUser')
  return Promise.resolve()
}

function _saveLoggedinUser(user) {
  sessionStorage.setItem('loggedinUser', JSON.stringify(user))
}

function getLoggedinUser() {
  return JSON.parse(sessionStorage.getItem('loggedinUser') || null)
}

function getEmptyCredentials(fullname = '', username = '', password = 'secret') {
  return { fullname, username, password }
}

function _createUsers() {
  let users = loadFromStorage(STORAGE_KEY)
  if (!users || !users.length) {
    users = [
      {
        "_id": "u101",
        "username": "pukiPUT-TEST",
        "fullname": "Puki Ja",
        "password": "secret1"
      },
      {
        "_id": "u102",
        "username": "muki",
        "fullname": "Muki Ba",
        "password": "secret2"
      },
      {
        "_id": "u103",
        "fullname": "Hila Shor",
        "username": "Hila",
        "password": "hila"
      },
      {
        "_id": "u104",
        "fullname": "Guest",
        "username": "Guest",
        "password": "guest"
      }
    ]
    saveToStorage(STORAGE_KEY, users)
  }
}

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function loadFromStorage(key) {
  const data = localStorage.getItem(key)
  return (data) ? JSON.parse(data) : undefined
}