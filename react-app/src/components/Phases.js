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
    <div className="outer-container">
      {phasesArr.map((phase, i) => {
      return (
        <div className="card-container-outer" key={i}>
          <div className="phase-title">
            {phase.title}
          </div>
          <div>
             {phase.Issues.map((issue, i) => {
            return (
              <div key={i}>
                {issue.summary}
              </div>
            )
          })}
          </div>
        </div>
        )
      })}
    </div>
  )
}

export default Phases
