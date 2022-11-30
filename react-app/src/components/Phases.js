import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { thunkGetAllPhasesIssues } from '../store/issue';
import { loadAllUsers } from '../store/session';
import CreateIssueInPhase from './Issues/CreateIssueInPhase';
import CreatePhase from './Phases/CreatePhase';
import UpdatedPhase from './Phases/UpdatePhase';
import DeletePhase from './Phases/DeletePhase';
import "./CSS/Phases.css"

import IssueCards from './Issues/IssueCards'


// import React, { useState } from 'react';
import { Modal } from '../context/Modal';
import UpdateIssueForm from './Issues/UpdateIssueModal/UpdateIssueForm';
import './CSS/UpdateIssues.css';


function Phases(){
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [activeId, setActiveId] = useState()

  const phases = useSelector(state => state.issues.AllPhases)
  const phasesArr = Object.values(phases)
  const projectName = phasesArr[0]?.Project?.name
  const projectId = phasesArr[0]?.Project?.id

  const curr_user = useSelector(state => state.session.user)
  const curr_user_init = curr_user.first_name[0].toUpperCase() + curr_user.last_name[0].toUpperCase()
  const currUserId = curr_user?.id

  const all_users = useSelector(state => state.session.AllUsers)
  const all_users_init = all_users?.users.map(user => user.first_name[0].toUpperCase() + user.last_name[0].toUpperCase())

  // console.log("PHASE BROWSING-phasesArr:", phasesArr)

  useEffect(() => {
    dispatch(thunkGetAllPhasesIssues())
    dispatch(loadAllUsers())
  }, [dispatch])

  if (!phases) return null;

  function activeDiv(issueId) {
    setActiveId(issueId)
    setShowModal(true)
  }


  return (
    <div className="project-main-container">
      <div className='project-path'>Projects  /  Project 1</div>
      <div className='project-title'>{projectName}</div>
      <div className='user-circle-container'>
        {all_users_init?.map((init, i) => init === curr_user_init ? <div className='curr-user-circle' key={i}>{curr_user_init}</div> : <div className='other-user-circle'>{init}</div>)}
      </div>
      <div className="phase-main-container">
        {phasesArr?.map((phase, i) => {
        return (
          <div className="card-container" key={i}>
            <div className="phase-title-container" key={i}>
              <UpdatedPhase phaseId={phase.id} phaseTitle={phase.title} projectId={projectId} ownerId={currUserId}/>
              <DeletePhase phaseId={phase.id}/>
            </div>
              {phase.Issues && Object.values(phase.Issues).map((issue) => {
                return < IssueCards issue={issue} phase={phase}/>
            })}


              <CreateIssueInPhase />


          </div>
          )
        })}
        <CreatePhase projectId={projectId} ownerId={currUserId}/>
      </div>
    </div>
  )
}

export default Phases
