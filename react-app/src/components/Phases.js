import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { NavLink } from 'react-router-dom';
import { getAllPhasesIssues } from '../store/phase';
import { loadAllUsers } from '../store/session';
import "./CSS/Phases.css"

function Phases(){
  const dispatch = useDispatch();

  const phases = useSelector(state => state.phases.AllPhases)
  const phasesArr = Object.values(phases)
  const projectName = phasesArr[0]?.Project.name

  const curr_user = useSelector(state => state.session.user)
  const curr_user_init = curr_user.first_name[0].toUpperCase() + curr_user.last_name[0].toUpperCase()

  const all_users = useSelector(state => state.session.AllUsers)
  const all_users_init = all_users?.users.map(user => user.first_name[0].toUpperCase() + user.last_name[0].toUpperCase())

  // console.log("PHASE BROWSING-all phases:", phases)

  useEffect(() => {
    dispatch(getAllPhasesIssues(phases))
    dispatch(loadAllUsers())
  }, [dispatch])

  if (!phases) return null;

  return (
    <div className="project-main-container">
      <div className='project-path'>Projects  /  Project 1</div>
      <div className='project-title'>{projectName}</div>
      <div className='user-circle-container'>
        {all_users_init?.map(init => init === curr_user_init ? <div className='curr-user-circle'>{curr_user_init}</div> : <div className='other-user-circle'>{init}</div>)}
      </div>
      <div className="phase-main-container">
        {phasesArr.map((phase, i) => {
        return (
          <div className="card-container" key={i}>
            <div className="phase-title-container">
              <div className="phase-title">
                {phase.title === "DONE" ? <div>{phase.title}<i className="fa-sharp fa-solid fa-check" id="phase-title-done"></i></div> : phase.title}
              </div>
              <div className='phase-ellipsis-container'><i className="fa-solid fa-ellipsis"></i></div>
            </div>
            <div className="issue-card-container" >
              {phase.Issues.map((issue, i) => {
              return (
                <div className="issue-card-outer" key={i}>
                  <NavLink to={`/issues/${issue.issueId}`} style={{ textDecoration: 'none'}}>
                  <div className="issue-card-title">
                    <div className="issue-summary">{issue.summary}</div>
                    <div className='issue-ellipsis-container'><i className="fa-solid fa-ellipsis"></i></div>
                  </div>
                  <div className="project-name-outer">
                    <div className="project-name-left">
                      <div className='project-name-icon'><i className="fa-solid fa-square-check"></i></div>
                      <div className="project-name">{phase.Project.name}--{issue.issueId}</div>
                    </div>
                    {issue.user?.first_name[0].toUpperCase()+issue.user?.last_name[0].toUpperCase() === curr_user_init
                    ?
                    <div className='curr-user-circle-small'>{curr_user_init}</div>
                    :
                    <div className='other-user-circle-small'>{issue.user?.first_name[0].toUpperCase()+issue.user?.last_name[0].toUpperCase()}</div>
                    }
                  </div>
                  </NavLink>
                </div>
              )
            })}
            <NavLink to='/issues' style={{ textDecoration: 'none'}}>
              <div className='create-issue-outer'><i className="fa-sharp fa-solid fa-plus" id="create-issue-plus"></i>{" "}Create issue</div>
            </NavLink>
            </div>
          </div>
          )
        })}
        <div className="addPhase-main-container"><i className="fa-solid fa-plus" id="create-phase-plus"></i></div>
      </div>
    </div>
  )
}

export default Phases
