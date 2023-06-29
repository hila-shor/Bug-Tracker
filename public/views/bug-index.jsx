const { useState, useEffect } = React
const {Link} = ReactRouterDOM

import { bugService } from '../services/bug.service.js'
// import { bugService } from '../services/bug.service.local.js'


import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

import { BugList } from '../cmps/bug-list.jsx'
import { BugFilter } from '../cmps/bug-filter.jsx'



export function BugIndex() {

    const [bugs, setBugs] = useState([])
    const [totalPages, setTotalPages ]= useState(null)
    const [isTableMode, setIsTableMode] = useState(true)
    const [selectedBugs, setSelectedBugs] = useState([])
    const [filterBy , setFilterBy] = useState(bugService.getDefaultFilter())
    // console.log('from bug-index cmp, filterBy: ', filterBy );
    // console.log('selectedBugs: ',selectedBugs)

    useEffect(() => {
        loadBugs()
    }, [filterBy])

    function loadBugs() {
        bugService.query(filterBy)
        .then(({ filteredBugs, totalPages }) => {
            console.log('filteredBugs from bug-index, query res: ',filteredBugs)
            setBugs(filteredBugs)
            // You can do something with the totalPages value here
            // console.log('Total Pages:', totalPages)
            setTotalPages(totalPages)
        })
        // .then(setBugs)
        .catch(err => {
            console.log('Error from loadBugs ->', err);
            showErrorMsg('Failed to load bugs');
        })
    }

    function onRemoveBug(bugId) {
        bugService.remove(bugId)
            .then(() => {
                console.log('Deleted Succesfully!')
                const bugsToUpdate = bugs.filter(bug => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch(err => {
                console.log('Error from onRemoveBug ->', err)
                showErrorMsg('Cannot remove bug')
            })
        }

    function onSetViewMode(){
        setIsTableMode(!isTableMode )
    }

    function handleSelectBug (bugId) {
        // console.log('from bug-index cmp handleselectBug(), : ', bugId)
        if (selectedBugs.includes(bugId)) {
            setSelectedBugs(selectedBugs.filter((id) => id !== bugId));
        } else {
            setSelectedBugs([...selectedBugs, bugId]);
        }
        
    }

    function onSetFilter(filterBy) {
        setFilterBy(filterBy)
    }

    function setSort(sortBy){
        if (sortBy === 'title') {
            // bugs.sort((c1, c2) => c1.title.localeCompare(c2.title) * Direction)
            const sortedBugs= bugs.slice().sort((c1, c2) => c1.title.localeCompare(c2.title))
            setBugs(sortedBugs)
        } else if (sortBy === 'createdAt') {
            const sortedBugs = bugs.slice().sort((c1, c2) => (c1.createdAt - c2.createdAt))
            setBugs(sortedBugs)
            }
    }

    return (
        <main className='bug-index main-layout'>
            
            <BugFilter onSetFilter={onSetFilter} totalPages={totalPages} setSort={setSort}/> 
            <div className='action-btn flex'>
                <button onClick={onSetViewMode}>{isTableMode? 'Grid View':'Table View'}</button>
                <Link className="add-link" to={`/bug/edit`}> + Add Bug Test</Link>
                <button onClick={bugService.getPDF}>Download as PDF</button>
            </div>
            <BugList 
            bugs={bugs} 
            onRemoveBug={onRemoveBug} 
            isTableMode={isTableMode}
            handleSelectBug={handleSelectBug} />
            
        </main>
    )
}
