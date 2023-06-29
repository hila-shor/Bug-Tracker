import { storageService } from './async-storage.service.js'
// import { utilService } from './util.service.js'

const BASE_URL = '/api/user/'

export const userService = {
  updateUser,
  query,
  getById,
  remove,
  signup,
  login,
  logout,
  _saveLoggedinUser,
  getLoggedinUser,
  getEmptyCredentials
}

function updateUser(userId, user) {
  return axios.put(BASE_URL + `${user._id}`, user).then(res => res.data)
}

function getById(userId) {
  return axios.get(BASE_URL + userId).then(res => res.data)
}
function query() {
  return axios.get(BASE_URL).then(res => res.data)
}

function remove(userId) {
  return axios.delete(BASE_URL + userId).then(res => res.data)
}

function signup(credentials) {
  return axios.post(BASE_URL + 'signup', credentials)
    .then(res => res.data)
    .then(user => {
      _saveLoggedinUser(user)
      return user
    })
}

function login(credentials) {
  return axios.post(BASE_URL + 'login', credentials)
    .then(res => res.data)
    .then((user) => {
      _saveLoggedinUser(user)
      return user
    })
}

function logout() {
  return axios.post(BASE_URL + 'logout')
    .then(() => {
      sessionStorage.removeItem('loggedinUser')
    })
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
