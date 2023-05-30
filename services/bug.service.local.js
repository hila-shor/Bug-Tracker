const fs = require('fs');
var bugs = require('../data/bugs.json')


module.exports = {
  query,
  get,
  remove,
  save
}

function query(filterBy) {
  return Promise.resolve(bugs)
}

function get(bugId) {
  const bug = bugs.find(bug => bug._id === bugId)
  return Promise.resolve(bug)
}

function remove(bugId) {
  bugs = bugs.filter(bug => bug._id !== bugId)
  return _writebugsToFile()
}

function save(bug) {
  if (bug._id) {
    const bugToUpdate = bugs.find(currbug => currbug._id === bug._id)
    bugToUpdate.title = bug.title
    bugToUpdate.description = bug.description
    bugToUpdate.severity = bug.severity

    return _writebugsToFile().then(() => bugToUpdate)
  } else {
    bug._id = _makeId()
    bug.createdAt = Date.now()
    bugs.push(bug)
    return _writebugsToFile().then(() => bug)
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

function _writebugsToFile() {
  return new Promise((res, rej) => {
    const data = JSON.stringify(bugs, null, 2)
    fs.writeFile('data/bugs.json', data, (err) => {
      if (err) return rej(err)
      // console.log("File written successfully\n");
      res()
    });
  })
}