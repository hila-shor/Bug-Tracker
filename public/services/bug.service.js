
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
    getDefaultFilter
}

function query(filterBy = getDefaultFilter()) {
    const queryParams = `?txt=${filterBy.txt}&severity=${filterBy.severity}`
    return axios.get(BASE_URL + queryParams)
        .then(res => res.data)
    // .then(bugs => {
    //     if (filterBy.txt) {
    //         const regex = new RegExp(filterBy.txt, 'i')
    //         bugs = bugs.filter(bug => {
    //             return regex.test(bug.title.toLowerCase()) || regex.test(bug.description.toLowerCase())
    //         })
    //     }
    //     if (filterBy.severity) {
    //         bugs = bugs.filter(bug => {
    //             return +bug.severity >= +filterBy.severity
    //         })
    //     }
    //     return bugs
    // })
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
    return { txt: '', severity: 0 }
}

