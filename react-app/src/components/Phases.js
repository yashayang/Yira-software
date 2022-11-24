import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { getAllPhasesIssues } from '../store/phase';
import "./CSS/Phases.css"

function Phases(){
  const dispatch = useDispatch();

  const phases = useSelector(state => state.phases.AllPhases)
  const phasesArr = Object.values(phases)
  const projectName = phasesArr[0]?.Project.name

  const curr_user = useSelector(state => state.session.user)
  const curr_user_init = curr_user.first_name[0].toUpperCase() + curr_user.last_name[0].toUpperCase()

  // console.log(curr_user_init)
  useEffect(() => {
    dispatch(getAllPhasesIssues(phases))
  }, [dispatch])

  if (!phases) return null;

  return (
    <div className="project-main-container">
      <div className='project-path'>Projects  /  Project 1</div>
      <div className='project-title'>{projectName}</div>
      <div className='user-circle-container'>
        <div className='user-circle'>{curr_user_init}</div>
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
                  <div className="issue-card-title">
                    <div className="issue-summary">{issue.summary}</div>
                    <div className='issue-ellipsis-container'><i className="fa-solid fa-ellipsis"></i></div>
                  </div>
                  <div className="project-name-outer">
                    <div className='project-name-icon'><i className="fa-solid fa-square-check"></i></div>
                    <div className="project-name">{phase.Project.name}--{issue.issueId}</div>
                  </div>
                </div>
              )
            })}
            <div className='create-issue-outer'><i className="fa-sharp fa-solid fa-plus" id="create-issue-plus"></i>{" "}Create issue</div>
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
