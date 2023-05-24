const { Link } = ReactRouterDOM

export function BugPreview({bug, isTableMode, onRemoveBug, onEditBug,handleSelectBug}) {


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
                    <td>{bug.title}</td>
                    <td>{bug.description}</td>
                    <td>{bug.severity}</td>
                    <td>
                        <button onClick={() => { onRemoveBug(bug._id) }}>x</button>
                        <button onClick={() => { onEditBug(bug) }}>Edit</button>
                        <Link to={`/bug/${bug._id}`}>Details</Link>
                    </td>
                    <td><input type="checkbox"  onChange={() => handleSelectBug(bug._id)}/></td>
                </tr>
            )}
    }


