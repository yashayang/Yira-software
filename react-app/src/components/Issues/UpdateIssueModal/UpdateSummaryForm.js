import { useState } from "react";
import { useDispatch } from "react-redux";
import { thunkUpdateIssue, thunkGetOneIssue } from "../../../store/issue";
import "../../CSS/UpdateIssues.css"

const UpdateSummaryForm = ({currIssue}) => {
  const dispatch = useDispatch();
  const issueId = currIssue.issueId
  const currPhaseId = currIssue.phaseId
  const currSummary = currIssue.summary
  const currReportorId = currIssue.ownerId;
  const currDescription = currIssue.description;
  const currAssigneeId = currIssue.Assignee?.id;

  const [summary, setSummary] = useState(currSummary);
  const [summaryInput, setSummaryInput] = useState(false);
  const [summaryErrors, setSummaryErrors] = useState([]);

  const showSummary = async (e) => {
    setSummary(currSummary)
    setSummaryInput(true)
  }

  const handleSummary = async (e) => {
    e.stopPropagation()
    e.preventDefault()
    setSummaryErrors([])

    const issue = {
      summary,
      "description": currDescription,
      "phase_id": currPhaseId,
      "assignee_id": currAssigneeId ? currAssigneeId : 0,
      "owner_id": currReportorId ? currReportorId : 0
    }

    const response = await dispatch(thunkUpdateIssue(issueId, issue, currPhaseId))
    let errorsArr = []
    if(response.errors) {
      let errorMsg = response.errors[0].slice(response.errors[0].indexOf(':')+1, response.errors[0].length)
      errorsArr.push(errorMsg)
      setSummaryErrors(errorsArr)
    }

    if (response.issueId) {
      setSummaryInput(false)
      dispatch(thunkGetOneIssue(parseInt(issueId)))
    }
  }


  return (
    <>
      <div className="update-issue-summary-errors">
        {
        summaryErrors &&
        summaryErrors.map((error)=>(<div key={error}>{error}</div>))
        }
      </div>
      {!summaryInput
      ? <div className="update-issue-summary" onClick={showSummary}><span>{currSummary}</span></div>
      : <div className="update-issue-summary-input-container">
          <form onSubmit={handleSummary} id="summary-form">
            <div>
              <input
                type="text"
                value={summary}
                required
                onChange={(e) => setSummary(e.target.value)}
                className="update-issue-summary-input"
              />
            </div>
            <div className="update-issue-summary-button-container">
              <button type="submit" className="update-issue-summary-button"><i className="fa-sharp fa-solid fa-check"></i></button>
              <button  className="update-issue-summary-button" onClick={() =>{
                setSummaryErrors([])
                setSummary(currSummary)
                setSummaryInput(false)
                }}>
                <i className="fa-sharp fa-solid fa-xmark"></i></button>
            </div>
          </form>
        </div>
      }
    </>
  )
}

export default UpdateSummaryForm;
