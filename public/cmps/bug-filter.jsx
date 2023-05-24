const { useState, useEffect, useRef } = React
import {bugService} from './../services/bug.service.js'

export function BugFilter({ onSetFilter}){

  const [filterByToEdit, setFilterByToEdit ]= useState(bugService.getDefaultFilter())
  const elInputRef = useRef(null)
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

  return <section className="bug-filter main-layout full ">
            <h2> Filter your bugs</h2>
            <div className='filter-fields'>
              <label htmlFor="title">Bug title</label>
              <input type="text"
                ref={elInputRef}
                placeholder="Search..."
                onChange={handleChange}
                id='title'
                name='txt'
                value={filterByToEdit.txt}/>
              
              <input type="range" min="0" max="10" value={filterByToEdit.severity} name="severity"
              onChange={handleChange}/>
            </div>
        </section>
}