
// import { storageService } from './async-storage.service.js'
// import { utilService } from './util.service.js'

// const STORAGE_KEY = 'bugDB'
const BASE_URL = '/api/bug/'

export const bugService = {
    query,
    getById,
    remove,
    save,
    getPDF,
    getDefaultFilter,
    getEmptyBug
}

function query(filterBy = getDefaultFilter()) {
    const queryParams = `?txt=${filterBy.txt}&severity=${filterBy.severity}&pageIdx=${filterBy.pageIdx}`
    return axios.get(BASE_URL + queryParams)
        .then(res => res.data)
}

function getById(bugId) {
    return axios.get(BASE_URL + bugId)
        .then(res => res.data)
}

function remove(bugId) {
    return axios.delete(BASE_URL + bugId)
}

function save(bug) {
    if (bug._id) {
        return axios.put(BASE_URL + `${bug._id}`, bug).then(res => res.data)
    } else {
        console.log('axios.post')
        return axios.post(BASE_URL, bug).then(res => res.data)
    }
}

function getPDF() {
    console.log('getpdf function');
    return axios({
        method: 'get',
        url: BASE_URL + 'save_pdf',
        responseType: 'blob'
    })
        .then((response) => {
            const url = URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.download = 'output-t.pdf';
            link.click();
        })
        .catch((error) => {
            console.error('Error while downloading PDF:', error);
        });
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


