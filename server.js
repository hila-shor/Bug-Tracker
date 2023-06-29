// const fs = require('fs')
const express = require('express')
var cookieParser = require('cookie-parser')

const bugService = require('./services/bug.service.js')
const userService = require('./services/user.service.js')

const app = express()


// Cookies lifespan is 7 sec's
const COOKIE_AGE = 1000 * 7
const IS_PREMIUM = false

// App configuration
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

//Routing express

app.get('/favicon.ico', (req, res) => {
  res.status(204).end(); // Respond with empty response and status code 204 (No Content)
});
//Hello
// app.get('/api/hello', (req, res) => {
//   // console.log('req.cookies', req.cookies)
//   var visitCount = req.cookies.visitCount || 0
//   // console.log('visitCount fromm cookie: ', visitCount)
//   visitCount++
//   res.cookie('visitCount', visitCount, { maxAge: 1000 * 25 })
//   res.send('Hello')
// })

//BUGS ROUTS
//List
app.get('/api/bug', (req, res) => {
  const filterBy = req.query
  bugService.query(filterBy)
    .then(({ filteredBugs, totalPages }) => {
      res.send({ filteredBugs, totalPages })
    })
    .catch(err => {
      console.log('Error:', err)
      res.status(400).send('Cannot get bugs')
    })
})

app.get('/api/bug/save_pdf', (req, res) => {
  console.log('on app.get..... in server.js')
  bugService.createPDF(res)
})

//Update
app.put('/api/bug/:bugId', (req, res) => {
  const bug = req.body
  console.log(req.body)
  const loggedinUser = userService.validateToken(req.cookies.loginToken)

  bugService.save(bug, loggedinUser)
    .then((savedBug) => {
      res.send(savedBug)
    })
    .catch(err => {
      console.log('Error:', err)
      res.status(400).send('Cannot update bugs')
    })
})

//Create
app.post('/api/bug', (req, res) => {

  //only logedin user can add car- send the loginToken to function that decrypt it to user if there is no user we get err 401 
  const loggedinUser = userService.validateToken(req.cookies.loginToken)
  if (!loggedinUser) return res.status(401).send('Cannot add bug')

  const bug = req.body
  // bug.creator = { _id: loggedinUser._id, fullname: loggedinUser.fullname }
  bug.creator = { _id: loggedinUser['_id'], fullname: loggedinUser['fullname'] }

  bugService.save(bug, loggedinUser)
    .then((savedBug) => {
      res.send(savedBug)
    })
    .catch(err => {
      console.log('Error:', err)
      res.status(400).send('Cannot create bugs')
    })
})

//Delete
app.delete('/api/bug/:bugId', (req, res) => {
  const { bugId } = req.params
  const loggedinUser = userService.validateToken(req.cookies.loginToken)
  bugService.remove(bugId, loggedinUser)
    .then(() => {
      res.send('bug removed successfully')
    })
    .catch(err => {
      console.log('Error:', err)
      // res.status(400).send('Cannot delete bugs')
      res.status(400).send(err)
    })
})

// Read- getById- with cookie 
app.get('/api/bug/:bugId', (req, res) => {
  // console.log('req.params from Read: ', req.params)
  const { bugId } = req.params

  let visitCountIds = req.cookies.visitCountIds || []
  if (!visitCountIds.includes(bugId)) {
    if (visitCountIds.length >= 3 && !IS_PREMIUM) {
      return res.status(401).send('Wait for a bit')
    }
    visitCountIds.push(bugId)
  }
  // visitCountIds.push(bugId)
  console.log('The user visited at the following bugs: ', visitCountIds)

  bugService.get(bugId)
    .then((bug) => {
      res.cookie('visitCountIds', visitCountIds, { maxAge: COOKIE_AGE })
      res.send(bug)
    })
    .catch(err => {
      console.log('Error:', err)
      res.status(400).send('Cannot get byId bug')
    })
})

//USERS ROUTS
//List
app.get('/api/user/', (req, res) => {
  userService.query()
    .then((users) => {
      res.send(users)
    })
    .catch(err => {
      console.log('Error:', err)
      res.status(400).send('Cannot get users')
    })
})

//Update
app.put('/api/user/:bugId', (req, res) => {
  const user = req.body
  console.log(req.body)
  userService.save(user)
    .then((savedUser) => {
      res.send(savedUser)
    })
})

//Create
app.post('/api/user', (req, res) => {
  const user = req.body
  console.log('user from app.post - server.js ', user)
  userService.save(user).then((savedUser) => {
    res.send(savedUser)
  })
})

// Read- getById
app.get('/api/user/:userId', (req, res) => {
  const { userId } = req.params
  userService.get(userId).then((user) => {
    res.send(user)
  })
})

//Delete
app.delete('/api/user/:userId', (req, res) => {
  const { userId } = req.params
  userService.remove(userId)
    .then(() => {
      res.send('bug removed successfully')
    })
    .catch(err => {
      console.log('Error:', err)
      res.status(400).send('Cannot delete user')
    })
})

//Login
app.post('/api/user/login', (req, res) => {
  const { username, password } = req.body
  userService.login({ username, password })
    .then((user) => {
      console.log('user that send to cookie , user: ', user)
      const loginToken = userService.getLoginToken(user)
      res.cookie('loginToken', loginToken)
      res.send(user)
    })
    .catch(err => {
      console.log('Error:', err)
      res.status(400).send('Cannot login')
    })
})

//Logout
app.post('/api/user/logout', (req, res) => {
  res.clearCookie('loginToken')
  res.send('Logged out')
})

//Signup
app.post('/api/user/signup', (req, res) => {
  const user = req.body
  userService.signup(user)
    .then((user) => {
      userService.login(user)
      const loginToken = userService.getLoginToken(user)
      res.cookie('loginToken', loginToken)
      res.send(user)
    })
    .catch(err => {
      console.log('Error:', err)
      res.status(400).send('Cannot login')
    })
})


//Listen to port 3030
app.listen(3030, () => console.log('Server listening on port 3030'))
