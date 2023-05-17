const express = require('express')
var cookieParser = require('cookie-parser')
const bugService = require('./services/bug.service.js')

const app = express()

// App configuration
app.use(express.static('public'))
app.use(cookieParser())


//Routing express

//Hello
app.get('/api/hello', (req, res) => {
  // console.log('req.cookies', req.cookies)
  var visitCount = req.cookies.visitCount || 0
  // console.log('visitCount fromm cookie: ', visitCount)
  visitCount++
  res.cookie('visitCount', visitCount, { maxAge: 1000 * 25 })
  res.send('Hello')
})

//List
app.get('/api/bug', (req, res) => {
  bugService.query().then((bugs) => {
    res.send(bugs)
  })
})

//Save (with query - after the ? in the url)
app.get('/api/bug/save', (req, res) => {
  const bug = {
    title: req.query.title,
    description: req.query.description,
    severity: +req.query.severity,
    _id: req.query._id
  }
  bugService.save(bug).then((savedBug) => {
    res.send(savedBug)
  })
})
//Delete
app.get('/api/bug/:bugId/remove', (req, res) => {
  const { bugId } = req.params
  bugService.remove(bugId).then(() => {
    res.send('bug removed successfully')
  })
})

// Read- getById
app.get('/api/bug/:bugId', (req, res) => {
  // console.log('req.params from Read: ', req.params)
  const { bugId } = req.params
  bugService.get(bugId).then((bug) => {
    res.send(bug)
  })
})


//Listen to port 3030
app.listen(3030, () => console.log('Server listening on port 3030'))