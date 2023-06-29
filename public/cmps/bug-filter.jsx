const { useState, useEffect, useRef } = React
// import { useHistory, useLocation } from 'react-router-dom'

import {bugService} from './../services/bug.service.js'
// import {bugService} from './../services/bug.service.local.js'


export function BugFilter({ onSetFilter, totalPages, setSort}){

  const [filterByToEdit, setFilterByToEdit ]= useState(bugService.getDefaultFilter())
  const elInputRef = useRef(null)
  // const location = useLocation()
  // const history = useHistory()
   // const [pageNum, setPageNum] = useState(1) // Add state for page number
  // console.log('bug-filter cmp, filterByToEdit: ',filterByToEdit )

  //when loading the bug-filter the serch input will be focus
  useEffect(() => {
    elInputRef.current.focus()
  }, [])

  useEffect(() => {
    onSetFilter(filterByToEdit)
  }, [filterByToEdit])

  function handleChange({target}){
    // console.log('from handleChange, target: ', target)
    let {value, name:field, type}= target
    value = type === 'number'? +value : value;
    setFilterByToEdit((prevFilter)=>{
      return {...prevFilter, [field]:value}
    })
  }


  function onSetSort({target}){
    setSort(target.value)
  }

  return <section className="bug-filter main-layout full ">
            {/* <h2> Filter your bugs</h2> */}
            <div className='filter-fields'>
              <label htmlFor="title">Bug title</label>
              <input type="text"
                ref={elInputRef}
                placeholder="Search..."
                onChange={handleChange}
                id='title'
                name='txt'
                value={filterByToEdit.txt}/>
              
              <input type="range" 
                  min="0" 
                  max="10" 
                  value={filterByToEdit.severity} name="severity"
                  onChange={handleChange}/>

              <label>Page
                <input
                  type="number"
                  name="pageIdx"
                  min="1"
                  max={totalPages}
                  value={filterByToEdit.pageIdx}
                  onChange={handleChange}/>
              </label>

              <select onChange={onSetSort}>
                <option value="">Sorting By</option>
                <option value="title">Title</option>
                <option value="createdAt">Created Time</option>
              </select>
              
            </div>
        </section>
}