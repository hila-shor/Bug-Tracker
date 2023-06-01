const {useState, useEffect} = React
const {useNavigate , useParams , Link} = ReactRouterDOM

import { bugService } from '../services/bug.service.js'


export function BugEdit(){

  const [bugToEdit, setBugToEdit]=useState(bugService.getEmptyBug)
  console.log(bugToEdit)

  const navigate = useNavigate()
  const {bugId} = useParams()

  useEffect(() =>{
    if(!bugId) return
    loadBug()
} , [])

  function loadBug() {
    bugService.getById(bugId)
    .then((bug) => setBugToEdit(bug))
    .catch((err) =>{
        console.log(err)
        navigate('/bugs')
    })
}
  function onSaveBug(ev){
    console.log('save bug func')
    ev.preventDefault()
    bugService.save(bugToEdit)
    .then((bug)=>{
      
      navigate('/bug')
    })
    .catch(err => {
    console.log('Error from onAddBug ->', err)
    
})
}

function onBackToBugsList(){
  navigate('/bug')
}

  function handleChange({ target }) {
    const { value, name: field, type } = target;
    let updatedValue = value;
    
    if (type === 'text' && field === 'labels') {
      updatedValue = value.split(',').map(item => item.trim())
    } else if (type === 'number') {
      updatedValue = +value;
    }
  
    setBugToEdit(prev => ({ ...prev, [field]: updatedValue }))
  }
  

  return (
    <section className="bug-edit main-layout">
      <h1>Hi from bug Edit</h1>

      <form onSubmit={onSaveBug}>
        <button type="submit">save</button>
        <label>Bug name:
          <input type="text"
                  name="title"
                  value={bugToEdit.title}
                  onChange={handleChange}/>
        </label>

        <label> Description:
          <input type="text"
            name="description"
            value={bugToEdit.description}
            onChange={handleChange}/>
        </label>

        <select name="severity"
                onChange={handleChange}>
          <option value="">Severity</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select> 

        <label>
          <input type="text"
            name="labels"
            value={bugToEdit.labels}
            placeholder="Enter labels separated by commas"
            style={{width: '400px'}}
            onChange={handleChange}/>
        </label>

      </form>
      <button onClick={onBackToBugsList}>Back</button>
    </section>)
}