import { useState } from "react";
import { useDispatch } from "react-redux";
import { thunkUpdateIssue, thunkGetOneIssue } from "../../../store/issue";
import "../../CSS/UpdateIssues.css"

const UpdateDescriptionForm = ({currIssue}) => {
  const dispatch = useDispatch();
  const issueId = currIssue.issueId
  const currPhaseId = currIssue.phaseId
  const currDescription = currIssue.description;
  const currReportorId = currIssue.ownerId;

  const [description, setDescription] = useState(currDescription);
  const [descriptionInput, setDescriptionInput] = useState(false);
  const [descriptionErrors, setDescriptionErrors] = useState([]);

  const handleDescription = async (e) => {
    e.stopPropagation()
    e.preventDefault()
    setDescriptionErrors([])

    const issue = {
      description,
      "summary": currIssue.summary,
      "phase_id": currPhaseId,
      "owner_id": currReportorId ? currReportorId : 0
    }

    const response = await dispatch(thunkUpdateIssue(issueId, issue, currPhaseId))

    let errorsArr = []
    if(response.errors) {
      let errorMsg = response.errors[0].slice(response.errors[0].indexOf(':')+1, response.errors[0].length)
      errorsArr.push(errorMsg)
      setDescriptionErrors(errorsArr)
    }

    if (response.issueId) {
      setDescriptionInput(false)
      dispatch(thunkGetOneIssue(parseInt(issueId)))
    }
  }

  return (
    <div className="update-issue-description">
      <label className="update-issue-description-label">Description</label>
      <div className="update-issue-description-errors">
        {
        descriptionErrors &&
        descriptionErrors.map((error)=>(<div key={error}>{error}</div>))
        }
      </div>
      {!descriptionInput &&
        <div onClick={() => {
          setDescriptionInput(true)
          }}
          className="update-issue-description-placeholder"
        >
          {currDescription
          ? <div>{currDescription}</div>
          : <div>Add a description...</div>}
        </div>}
      {descriptionInput && <form className="update-issue-description-input-container" onSubmit={handleDescription}>
        <textarea
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="update-issue-description-input"
        />
        <div className="update-issue-description-button-container">
          <button className="update-issue-description-save">Save</button>
          <div className="update-issue-description-cancel" onClick={() =>{
            setDescriptionErrors([])
            setDescription(currDescription)
            setDescriptionInput(false)
            }}>Cancel</div>
        </div>
      </form>}
    </div>
  )
}

export default UpdateDescriptionForm;
