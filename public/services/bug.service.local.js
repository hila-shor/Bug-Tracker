import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const PAGE_SIZE = 10
const STORAGE_KEY = 'bugDB'
_createBugs()

export const bugService = {
  query,
  getById,
  save,
  remove,
  getDefaultFilter,
  getEmptyBug
}


function query(filterBy = getDefaultFilter()) {

  let totalPages = 0
  return storageService.query(STORAGE_KEY)
    .then(bugs => {
      let filteredBugs = bugs
      console.log('from bugService local- bugs ', bugs)

      if (filterBy.txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        filteredBugs = filteredBugs.filter(bug => {
          // console.log('bug details: ', bug.title, bug.description)
          return regex.test(bug.title.toLowerCase()) || regex.test(bug.description.toLowerCase())
        })
      }
      if (filterBy.severity) {
        filteredBugs = filteredBugs.filter(bug => {
          return +bug.severity >= +filterBy.severity
        })
      }
      if (filterBy.pageIdx !== undefined) {
        totalPages = Math.ceil(filteredBugs.length / PAGE_SIZE)
        const startIdx = filterBy.pageIdx * PAGE_SIZE - PAGE_SIZE
        filteredBugs = filteredBugs.slice(startIdx, PAGE_SIZE + startIdx)
        return { filteredBugs, totalPages }
      }

      return { filteredBugs, totalPages }
    })
    .catch(error => {
      // Handle any error that occurs during the query
      console.error('Error querying bugs:', error);
      throw error; // Optionally re-throw the error to propagate it further
    })
}

function getById(bugId) {
  return storageService.get(STORAGE_KEY, bugId)
}

function remove(bugId) {
  return storageService.remove(STORAGE_KEY, bugId)
}

function save(bug) {
  if (bug._id) {
    return storageService.put(STORAGE_KEY, bug)
  } else {
    return storageService.post(STORAGE_KEY, bug)
  }
}

function getDefaultFilter() {
  return { txt: '', severity: 0, pageIdx: 1 }
}

function getEmptyBug(title = '', description = '', severity = '', labels = []) {
  return {
    title,
    description,
    severity,
    labels
  }
}

function _createBugs() {
  let bugs = loadFromStorage(STORAGE_KEY)
  if (!bugs || !bugs.length) {
    bugs = [
      {
        "_id": "b-003",
        "title": "Missing images",
        "description": "Certain images are not displaying on the product detail page",
        "severity": "3",
        "createdAt": "1824165392759",
        "labels": [
          "ui",
          "images"
        ]
      },
      {
        "_id": "b-004",
        "title": "Crash on startup",
        "description": "App crashes immediately after launch",
        "severity": "4",
        "createdAt": "1542107359484",
        "labels": [
          "crash",
          "startup"
        ]
      },
      {
        "_id": "b-005",
        "title": "Incorrect currency conversion",
        "description": "Wrong exchange rate used for conversions",
        "severity": "2",
        "createdAt": "1542107359494",
        "labels": [
          "currency",
          "conversion"
        ]
      }
    ]
    saveToStorage(STORAGE_KEY, bugs)
  }
}


function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function loadFromStorage(key) {
  const data = localStorage.getItem(key)
  return (data) ? JSON.parse(data) : undefined
}