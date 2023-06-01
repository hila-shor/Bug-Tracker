const { Link } = ReactRouterDOM

export function BugPreview({bug, isTableMode, onRemoveBug,handleSelectBug}) {


    if(!isTableMode){
        return (
        <article >
            <h4>{bug.title}</h4>
            <img src="assets/img/bug.png"/>
            <p>Severity: <span>{bug.severity}</span></p>
        </article> 
        )} else {
            return (
                <tr>
                    <td>{bug._id}</td>
                    <td>{bug.title}</td>
                    <td>{bug.description}</td>
                    <td>{bug.severity}</td>
                    <td>
                        <button onClick={() => { onRemoveBug(bug._id) }}>x</button>
                        <Link className="bug-edit-link btn" to={`/bug/edit/${bug._id}`} >Edit</Link>
                        <Link to={`/bug/${bug._id}`}>Details</Link>
                    </td>
                    <td><input type="checkbox"  onChange={() => handleSelectBug(bug._id)}/></td>
                </tr>
            )}
    }


