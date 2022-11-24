import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { getAllPhasesIssues } from '../store/phase';
import "./CSS/Phases.css"

function Phases(){
  const dispatch = useDispatch();
  const phases = useSelector(state => state.phases.AllPhases)
  const phasesArr = Object.values(phases)
  console.log(phasesArr)
  useEffect(() => {
    dispatch(getAllPhasesIssues(phases))
  }, [dispatch])

  if (!phases) return null;

  return (
    <div className="phase-main-container">
      {phasesArr.map((phase, i) => {
      return (
        <div className="card-container" key={i}>
          <div className="phase-title">
            {phase.title}
          </div>
          <div className="issue-card-container" >
             {phase.Issues.map((issue, i) => {
            return (
              <div className="issue-card-outer" key={i}>
                <div className="issue-card">{issue.summary}</div>
                <div className="project-name-outer">
                  <div className='project-name-icon'><i className="fa-solid fa-square-check"></i></div>
                  <div className="project-name"> project name </div>
                </div>
              </div>
            )
          })}
          <div className='create-issue-outer'><i class="fa-sharp fa-solid fa-plus"></i>{" "}Create issue</div>
          </div>
        </div>
        )
      })}
    </div>
  )
}

export default Phases
