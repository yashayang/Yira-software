import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkUpdateIssue } from "../../../store/issue";
import "../../CSS/UpdateIssues.css"


const UpdateAssigneeReporterForm = ({currIssue}) => {
  const dispatch = useDispatch();
  const currUser = useSelector(state => state.session.user)
  const allUsersArr = useSelector(state => state.session.AllUsers?.users)

  const issueId = currIssue.issueId
  const currPhaseId = currIssue.phaseId
  const currAssigneeId = currIssue.Assignee?.id;
  const currReportorId = currIssue.ownerId;
  const [assigneeId, setAssigneeId] = useState(currAssigneeId)
  const [reportorId, setReportorId] = useState(currReportorId)

  const handleAssigneeId = async (e) => {
    e.stopPropagation()
    e.preventDefault()
    setAssigneeId(e.target.value)


    let issue
    if (e.target.value === "") {
      issue = {
        "assignee_id": null,
        "summary": currIssue.summary,
        "phase_id": currPhaseId,
        "owner_id": currReportorId
      }
    } else {
      issue = {
        "assignee_id": Number(e.target.value),
        "summary": currIssue.summary,
        "phase_id": currPhaseId,
        "owner_id": currReportorId
      }
    }
    console.log("UpdateAssigneeReportorForm ---- issue", issue)
    await dispatch(thunkUpdateIssue(issueId, issue, currPhaseId))
  }

  const handleReportor = async (e) => {
    e.stopPropagation()
    e.preventDefault()
    setReportorId(e.target.value)

    const issue = {
      "summary": currIssue.summary,
      "owner_id": Number(e.target.value),
      "phase_id": currPhaseId,
      "owner_id": currReportorId
    }

    await dispatch(thunkUpdateIssue(issueId, issue, currPhaseId))
  }

  return (
    <div className="update-issue-right-assignee-reporter">
    <div className="update-issue-assignee">
      <div className="update-issue-label-container">
        <label>Assignee</label>
      </div>
      <div>
        <select
          name="assigneeId"
          value={assigneeId}
          className="update-issue-assignee-select"
          onChange={handleAssigneeId}
        >
          <option value="">
            Unassigned
          </option>
          {allUsersArr?.map((user, i) => (
            <option value={Number(user.id)} key={i}>
              {user.first_name[0].toUpperCase() + user.first_name.slice(1) + " " + user.last_name[0].toUpperCase() + user.last_name.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </div>

    <div className="update-issue-reporter">
      <div className="update-issue-label-container">
        <label>Reporter</label><i className="fa-solid fa-asterisk"></i>
      </div>
      <div>
        <select
          name="reporter"
          className="update-issue-assignee-select"
          value={reportorId}
          onChange={handleReportor}
        >
        {allUsersArr?.map((user, i) =>
          <option value={user.id} key={i}>
            {user.first_name[0].toUpperCase() + user.first_name.slice(1) + " " + user.last_name[0].toUpperCase() + user.last_name.slice(1)}
          </option>
        )}
        </select>
      </div>
    </div>
  </div>
  )
}

export default UpdateAssigneeReporterForm;
