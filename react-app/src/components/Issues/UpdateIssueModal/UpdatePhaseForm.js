import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkUpdateIssue, thunkGetAllPhasesIssues } from "../../../store/issue";
import "../../CSS/UpdateIssues.css"

const UpdatePhaseForm = ({currIssue}) => {
  const dispatch = useDispatch();
  const issueId = currIssue.issueId
  const currPhaseId = currIssue.phaseId
  const currReportorId = currIssue.ownerId;
  const currDescription = currIssue.description;
  const currAssigneeId = currIssue.Assignee?.id;

  const allPhases = useSelector(state => state.issues.AllPhases)
  const allPhasesArr = Object.values(allPhases)
  const [phaseId, setPhaseId] = useState(currPhaseId)

  const handlePhaseId = async (e) => {
    e.stopPropagation()
    e.preventDefault()
    setPhaseId(e.target.value)

    const issue = {
      "phase_id": Number(e.target.value),
      "summary": currIssue.summary,
      "description": currDescription,
      "assignee_id": currAssigneeId ? currAssigneeId : 0,
      "owner_id": currReportorId ? currReportorId : 0
    }

    await dispatch(thunkUpdateIssue(issueId, issue, currPhaseId))
    // await dispatch(thunkGetAllPhasesIssues())
  }

  return (
    <div>
    <select
      name="phaseId"
      value={phaseId}
      onChange={handlePhaseId}
      className="update-issue-right-phase-selector"
    >
    {allPhasesArr?.map((phase, i) =>(
      phase.id === currPhaseId
      ?
      <option value={currPhaseId} selected key={i}>
        {phase.title}
      </option>
      :
      <option value={Number(phase.id)} key={i}>
        {phase.title}
      </option>))}
    </select>
  </div>
  )
}

export default UpdatePhaseForm;
