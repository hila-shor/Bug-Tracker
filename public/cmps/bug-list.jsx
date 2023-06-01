const { Link } = ReactRouterDOM

import { BugPreview } from "./bug-preview.jsx"

export function BugList({ bugs, onRemoveBug , isTableMode, handleSelectBug}) {

    return <section className="bug-list">
            {!isTableMode &&<ul className="ul-bug-list">
                {bugs.map(bug =>
                                <li className="bug-preview" key={bug._id}>
                                    <BugPreview bug={bug} />
                                    <div>
                                        <button onClick={() => { onRemoveBug(bug._id) }}>x</button>
                                        <Link className="bug-edit-link btn" to={`/bug/edit/${bug._id}`}>Edit</Link>
                                    </div>
                                    <Link to={`/bug/${bug._id}`}>Details</Link>
                                </li>)}
                        </ul>}
            {isTableMode && <table>
                                <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Title</th>
                                    <th>Desc</th>
                                    <th>Severity</th>
                                    <th>actives</th>
                                    <th><input type="checkbox"/></th>
                                </tr>
                                </thead>
                                <tbody>
                                    {bugs.map(bug=> 
                                        <BugPreview 
                                            key = {bug._id} 
                                            bug ={bug} 
                                            isTableMode={isTableMode} 
                                            onRemoveBug={onRemoveBug} 
                                            handleSelectBug={handleSelectBug}/>
                                    )}
                                </tbody>

                        </table>}
    </section>
}