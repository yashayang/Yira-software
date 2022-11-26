import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom"
import { thunkCreateIssue } from "../../store/issue";
import { thunkGetAllPhasesIssues } from '../../store/issue';
import { loadAllUsers } from '../../store/session';
import "../CSS/CreateIssues.css"

const CreateIssue = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const currUser = useSelector(state => state.session.user)
  const allUsersArr = useSelector(state => state.session.AllUsers?.users)
  const allPhases = useSelector(state => state.issues.AllPhases)
  const allPhasesArr = Object.values(allPhases)
  const [phaseId, setPhaseId] = useState(1);
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState(currUser.id)
  const [errors, setErrors] = useState([]);
  // console.log(allUsersArr)

  useEffect(() => {
    dispatch(thunkGetAllPhasesIssues())
    dispatch(loadAllUsers())
  }, [dispatch])

  if (!allPhases) return null;

  const handleSubmit = async(e) => {
    e.preventDefault()
    setErrors([])
    const issueInfo = { summary, description, phaseId, assigneeId }
    // console.log("CREATEISSUE FORM-issueInfo:", issueInfo)

    const response = await dispatch(thunkCreateIssue(phaseId, issueInfo))
    let errorsArr = []
    if(response.errors) {
      let errorMsg = response.errors[0].slice(response.errors[0].indexOf(':')+1, response.errors[0].length)
      errorsArr.push(errorMsg)
      // console.log("!!!!!!!", errorsArr)
      setErrors(errorsArr)
    } else {
      history.push('/projects')
    }
  }

  const handleCancel = async(e) => {
    e.preventDefault()
    history.push('/projects')
  }

  return (
    <form className="create-issue-main-container" onSubmit={handleSubmit}>
      <div className="create-issue-title">Create Issue</div>
      <div className="create-issue-validation-errors">
        {
        errors &&
        errors.map((error)=>(<div key={error}>{error}</div>))
        }
      </div>

      <div className="create-issue-label-container">
        <label>Phases</label><i className="fa-solid fa-asterisk"></i>
      </div>
      <div className="create-issue-select-container">
        <select
          name="phaseId"
          className="create-issue-select"
          required
          onChange={(e) => setPhaseId(e.target.value)}
        >
        {allPhasesArr?.map((phase, i) => <option value={phase.id} key={i}>{phase.title}</option>)}
        </select>
      </div>

      <div className="create-issue-label-container">
        <label>Summary</label><i className="fa-solid fa-asterisk"></i>
      </div>
      <div className="create-issue-summary-input-outer">
        <input className="create-issue-summary-input"
          type="text"
          value={summary}
          required
          onChange={(e) => setSummary(e.target.value)}
        />
      </div>

      <div className="create-issue-label-container">
        <label>Description</label>
      </div>
      <div>
        <textarea className="create-issue-description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="create-issue-label-container">
        <label>Assignee</label>
      </div>
      <div>
        <select
          name="assigneeId"
          className="create-issue-assignee-select"
          onChange={(e) => setAssigneeId(e.target.value)}
        >
        <option disabled selected value={Number(assigneeId)}>Unassigned</option>
        {allUsersArr?.map((user, i) => <option value={Number(user.id)} key={i}>{user.first_name[0].toUpperCase() + user.first_name.slice(1) + " " + user.last_name[0].toUpperCase() + user.last_name.slice(1)}</option>)}
        </select>
      </div>

      <div className="create-issue-label-container">
        <label>Reporter</label><i className="fa-solid fa-asterisk"></i>
      </div>
      <div>
        <select
          name="reporter"
          className="create-issue-assignee-select"
          // onChange={(e) => setAssigneeId(e.target.value)}
        >
        <option disabled selected>{currUser.first_name[0].toUpperCase() + currUser.first_name.slice(1) + " " + currUser.last_name[0].toUpperCase() + currUser.last_name.slice(1)}</option>
        {/* {allUsersArr?.map((user, i) => <option value={user.id} key={i}>{user.first_name[0].toUpperCase() + user.first_name.slice(1) + " " + user.last_name[0].toUpperCase() + user.last_name.slice(1)}</option>)} */}
        </select>
      </div>

      <div className="create-issue-footer">
        <div className="create-issue-button-container">
        <div className="create-issue-cancel" type="submit" onClick={handleCancel}>Cancel</div>
        <button className="create-issue-create-button" type="submit">Create</button>
        </div>
      </div>

    </form>
  )
}

export default CreateIssue;
