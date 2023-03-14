import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { thunkGetAllPhasesIssues } from '../store/issue';
import { loadAllUsers } from '../store/session';
import CreateIssueInPhase from './Issues/CreateIssueInPhase';
import CreatePhase from './Phases/CreatePhase';
import UpdatedPhase from './Phases/UpdatePhase';
import DeletePhase from './Phases/DeletePhase';
import IssueCards from './Issues/IssueCards'
import "./CSS/Phases.css"


function Boards(){
  const dispatch = useDispatch();
  const [showSideBar, setShowSideBar] = useState(true);

  const phases = useSelector(state => state.issues.AllPhases);
  const phasesArr = Object.values(phases);
  const projectName = phasesArr[0]?.Project?.name;
  const projectId = phasesArr[0]?.Project?.id;

  const curr_user = useSelector(state => state.session.user);
  const curr_user_init = curr_user.first_name[0].toUpperCase() + curr_user.last_name[0].toUpperCase();
  const currUserId = curr_user?.id;

  const all_users = useSelector(state => state.session.AllUsers);
  const all_users_init = all_users?.users.map(user => user.first_name[0].toUpperCase() + user.last_name[0].toUpperCase());

  // console.log("PHASE BROWSING-phasesArr:", phasesArr)

  useEffect(() => {
    dispatch(thunkGetAllPhasesIssues())
    dispatch(loadAllUsers())
  }, [dispatch])

  if (!phases) return null;

  return (
    <div className='main-page-main-container'>
      {showSideBar
      ?
      <div className='sidebar-show-container'>
        <div className='sidebar-project-name-container'>
          <div className='sidebar-project-project-logo'><i className="fa-solid fa-list-check"></i></div>
          <div>
            <div className='sidebar-project-name'>Project 1</div>
            <div className='sidebar-project-subtitle'>software project</div>
          </div>
          <div className='sidebar-collapse-button' onClick={() => setShowSideBar(false)}><i className="fa-solid fa-less-than"></i></div>
        </div>

        <div className='sidebar-project-planning-container'>
          <div className='sidebar-project-planning-title'>PLANNING</div>
          <div className='sidebar-project-planning-board'>
            <div className='sidebar-project-project-logo'><i className="fa-sharp fa-solid fa-folder-open"></i></div>
            <div className='sidebar-project-planning-board-title'>Board</div>
          </div>
        </div>
            <hr className='breakline'></hr>
        <div className='sidebar-footer-container'>
            <div className='sidebar-footer'>You are in a team-managed project</div>
            <div className="sidebar-social-container">Created By <span className="sidebar-my-name">Yasha Yang</span>
            </div>
            <div className="sidebar-social-link-container">
              <a href='https://github.com/yashayang' className="sidebar-social-link" target="_blank" rel="noreferrer" ><span><i className="fa-brands fa-github"></i></span></a>
              <a href='https://www.linkedin.com/in/yashayang/' className="sidebar-social-link" target="_blank" rel="noreferrer" ><span><i className="fa-brands fa-linkedin"></i></span></a>
            </div>
        </div>
      </div>
      :
      <div className='Sidebar-close-container'>
        <div className='sidebar-project-name-container'>
          <div className='sidebar-collapse-button' onClick={() => setShowSideBar(true)}><i className="fa-solid fa-greater-than"></i></div>
        </div>
      </div>
      }

      <div className="project-main-container">
        <div className='project-path'>Projects  /  Project 1</div>
        <div className='project-title'>{projectName}</div>
        <div className='user-circle-container'>
          {all_users?.users.map((user, i) => currUserId === user.id ? <div className='curr-user-circle' key={i}>{user.first_name[0].toUpperCase() + user.last_name[0].toUpperCase()}</div> : <div className='other-user-circle' key={i}>{user.first_name[0].toUpperCase() + user.last_name[0].toUpperCase()}</div>)}
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
                  return <IssueCards issue={issue} phase={phase}/>
                })}
                <CreateIssueInPhase phaseId={phase.id} assigneeId={currUserId}/>
            </div>
          )})}
          <CreatePhase projectId={projectId} ownerId={currUserId}/>
        </div>
      </div>
    </div>
  )
}

export default Boards;
