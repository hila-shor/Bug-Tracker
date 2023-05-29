const { useState, useEffect } = React

import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

import { BugList } from '../cmps/bug-list.jsx'
import { BugFilter } from '../cmps/bug-filter.jsx'



export function BugIndex() {

    const [bugs, setBugs] = useState([])
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
        .then(setBugs)
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
        
        function onAddBug() {
            const bug = {
            title: prompt('Bug title?'),
            description: prompt('Bug description'),
            severity: +prompt('Bug severity?'),
        }
        bugService.save(bug)
            .then(savedBug => {
                console.log('Added Bug', savedBug)
                setBugs([...bugs, savedBug])
                showSuccessMsg('Bug added')
            })
            .catch(err => {
                console.log('Error from onAddBug ->', err)
                showErrorMsg('Cannot add bug')
            })
        }

    function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const bugToSave = { ...bug, severity }
        bugService.save(bugToSave)
            .then(savedBug => {
                console.log('Updated Bug:', savedBug)
                const bugsToUpdate = bugs.map(currBug => (currBug._id === savedBug._id) ? savedBug : currBug)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch(err => {
                console.log('Error from onEditBug ->', err)
                showErrorMsg('Cannot update bug')
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

    return (
        <main className='bug-index main-layout'>
            
            <BugFilter onSetFilter={onSetFilter}/> 
            <div className='action-btn flex'>
                <button onClick={onSetViewMode}>{isTableMode? 'Grid View':'Table View'}</button>
                <button onClick={onAddBug}> + Add Bug</button>
                <button onClick={bugService.getPDF}>Download as PDF</button>

                {/* <button onClick={handleDownloadSelectedBugs}>Download Selected Bugs as PDF</button> */}
            
            </div>
            <BugList 
            bugs={bugs} 
            onRemoveBug={onRemoveBug} 
            onEditBug={onEditBug} 
            isTableMode={isTableMode}
            handleSelectBug={handleSelectBug} />
            
        </main>
    )

}
