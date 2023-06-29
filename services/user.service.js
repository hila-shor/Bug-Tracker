const PDFDocument = require('pdfkit')
const fs = require('fs')
var users = require('../data/user.json')

const Cryptr = require('cryptr')
const cryptr = new Cryptr('secretKey')

module.exports = {
  query,
  get,
  remove,
  save,
  createPDF,
  login,
  signup,
  getLoginToken,
  validateToken
}

function getLoginToken(user) {
  return cryptr.encrypt(JSON.stringify(user))
}

function validateToken(loginToken) {
  try {
    const json = cryptr.decrypt(loginToken)
    const loggedinUser = JSON.parse(json)
    return loggedinUser
  } catch (err) {
    console.log('Invalid login token', err)
  }
  return null
}

function signup(user) {
  const userToSave = user
  userToSave._id = _makeId()
  users.push(userToSave)
  return _writeUsersToFile().then(() => userToSave)
}

function login(credentials) {
  const user = users.find(u => u.username === credentials.username)
  if (!user) return Promise.reject('Login failed')
  return Promise.resolve(user)
}

function query() {
  // let filteredUsers = users
  return Promise.resolve(users)
}

function get(userId) {
  const user = users.find(user => user._id === userId)
  return Promise.resolve(user)
}

function remove(userId) {

  const idx = users.findIndex(user => user._id === userId)
  if (idx === -1) return Promise.reject('No such user')
  users.splice(idx, 1)
  // users = users.filter(user => user._id !== userId)
  return _writeUsersToFile()
}

function save(user) {
  if (user._id) {
    const userToUpdate = users.find(currUser => currUser._id === user._id)
    userToUpdate.isAbleToDelete = user.isAbleToDelete
    return _writeUsersToFile().then(() => userToUpdate)
  } else {
    user._id = _makeId()
    // user.createdAt = Date.now()
    users.push(user)
    return _writeUsersToFile().then(() => user)
  }
}

function _makeId(length = 5) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

function _writeUsersToFile() {
  return new Promise((res, rej) => {
    const data = JSON.stringify(users, null, 2)
    fs.writeFile('data/user.json', data, (err) => {
      if (err) return rej(err)
      console.log("File written successfully\n");
      res()
    });
  })
}

function createPDF(res) {
  console.log('createPDF function')
  const doc = new PDFDocument()

  // Set the appropriate content headers 
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', 'attachment; filename="output-t.pdf"')

  // Pipe the PDF document directly to the response
  doc.pipe(res);

  // Add your PDF content here
  doc.image('public/assets/img/users-pic.png', {
    fit: [250, 300], align: 'center',
  }).font('Times-Bold').fontSize(20).text('Users-tracker').moveDown(1.5)
  doc


  users.forEach((user, idx) => {
    doc.font('Times-Bold').fontSize(16).text(`${idx + 1}. ${user.title}:`)
    doc.font('Times-Roman').fontSize(12).text(`${user.description}. Severity of user: ${user.severity}`).moveDown(1.5)
  });

  doc.end((err) => {
    if (err) {
      console.log('Error while generating PDF:', err)
    } else {
      console.log('PDF generation completed')
    }
  });
}
