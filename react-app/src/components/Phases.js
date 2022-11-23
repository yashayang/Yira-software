import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { getAllPhasesIssues } from '../store/phase'

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
    <div>
      {phasesArr.map((phase, i) => {
      return (
        <div key={i}>
          {phase.title}
          {phase.Issues.map((issue, i) => {
            return (
              <div key={i}>
                {issue.summary}
              </div>
            )
          })}
        <div></div>
        </div>
        )
      })}
    </div>
  )
}

export default Phases
