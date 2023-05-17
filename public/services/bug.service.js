
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const STORAGE_KEY = 'bugDB'
const BASE_URL = '/api/bug/'

export const bugService = {
    query,
    getById,
    save,
    remove,
}


function query() {
    return axios.get(BASE_URL)
        .then(res => res.data)
}
function getById(bugId) {
    return axios.get(BASE_URL + bugId)
        .then(res => res.data)
}
function remove(bugId) {
    return axios.get(BASE_URL + bugId + '/remove')
}
function save(bug) {
    let queryParams = `?title=${bug.title}&description=${bug.description}&severity=${bug.severity}`
    if (bug._id) {
        queryParams += `&_id=${bug._id}&createdAt=${bug.createdAt}`
    }
    return axios.get(BASE_URL + 'save' + queryParams).then(res => res.data)
}