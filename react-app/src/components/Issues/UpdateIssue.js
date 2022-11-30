import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom"
import { thunkUpdateIssue, thunkGetOneIssue, thunkGetAllPhasesIssues, cleanState } from "../../store/issue";
import { loadAllUsers } from '../../store/session';
import "../CSS/UpdateIssues.css"

const UpdateIssue = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const currUser = useSelector(state => state.session.user)
  const allUsersArr = useSelector(state => state.session.AllUsers?.users)
  const currIssue = useSelector(state => state.issues.singleIssue)
  const allPhases = useSelector(state => state.issues.AllPhases)
  const allPhasesArr = Object.values(allPhases)
  const { issueId } = useParams();

  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [phaseId, setPhaseId] = useState();
  const [assigneeId, setAssigneeId] = useState(currUser.id)
  const [errors, setErrors] = useState([]);
  const [summaryErrors, setSummaryErrors] = useState([]);
  const [descriptionErrors, setDescriptionErrors] = useState([]);
  const [summaryInput, setSummaryInput] = useState(false);
  const [descriptionInput, setDescriptionInput] = useState(false);


  const currSummary = currIssue?.summary;
  const currDescription = currIssue?.description;
  const currPhaseId = currIssue?.phaseId;
  const currAssigneeId = currIssue?.ownerId;
  // console.log("UPDATE ISSUE-curr", currSummary, currDescription, currPhaseId, currAssigneeId)

  useEffect(() => {
    dispatch(thunkGetOneIssue(parseInt(issueId)))
    dispatch(loadAllUsers())
    dispatch(thunkGetAllPhasesIssues())
    return () => {
      dispatch(cleanState())
    }
  }, [dispatch, issueId])


  const showSummary = async (e) => {
    setSummary(currIssue.summary)
    setDescription(currIssue.description)
    setSummaryInput(true)
  }

  const handleSummary = async (e) => {
    e.preventDefault()
    setErrors([])
    const issue = {
      summary,
      description: currDescription,
      phaseId: currPhaseId,
      assigneeId: currAssigneeId
    }
    // console.log("UPDATE ISSUE-issue:", issue)
    const response = await dispatch(thunkUpdateIssue(issueId, issue))
    // console.log("UPDATE ISSUE-response:", response)
    let errorsArr = []
    if(response.errors) {
      let errorMsg = response.errors[0].slice(response.errors[0].indexOf(':')+1, response.errors[0].length)
      errorsArr.push(errorMsg)
      setSummaryErrors(errorsArr)
    }
    if (response.issueId) {
      setSummaryInput(false)
    }
  }

  const handleDescription = async (e) => {
    e.preventDefault()
    const issue = {
      summary: currSummary,
      description,
      phaseId: currPhaseId,
      assigneeId: currAssigneeId
    }
    // console.log("UPDATE ISSUE-issue:", issue)
    const response = await dispatch(thunkUpdateIssue(issueId, issue))
    // console.log("UPDATE ISSUE-response:", response)
    let errorsArr = []
    if(response.errors) {
      let errorMsg = response.errors[0].slice(response.errors[0].indexOf(':')+1, response.errors[0].length)
      errorsArr.push(errorMsg)
      setDescriptionErrors(errorsArr)
    }
    if (response.issueId) {
      setDescriptionInput(false)
    }
  }

  // let phaseNameOnStage = currIssue.Phase?.title

  const handleSubmit = async (e) => {
    e.preventDefault()
    const issue = {
      summary: currSummary,
      description: currDescription,
      phaseId: phaseId ? phaseId : currPhaseId,
      assigneeId
    }
    // console.log("UPDATE ISSUE-handleSubmit-issue:", issue)
    dispatch(thunkUpdateIssue(issueId, issue))
    // .then(res => phaseNameOnStage = res.Phase.title)
    // console.log("UPDATE ISSUE-response:", response)
    history.push('/projects')
  }

  // const showMenu = () => {
  //   // if (showPhases) return
  //   setShowPhases(!showPhases)
  // }

  return (
    <div className="update-issue-main-container">
      <div className="update-issue-left-container">
        <div className="create-issue-validation-errors">
          {
          summaryErrors &&
          summaryErrors.map((error)=>(<div key={error}>{error}</div>))
          }
        </div>
        {!summaryInput
        ? <div className="update-issue-summary" onClick={showSummary}><h3>{currIssue?.summary}</h3></div>
        : <div className="update-issue-summary-input">
          <form onSubmit={handleSummary}>
            <div>
              <input
                type="text"
                value={summary}
                required
                onChange={(e) => setSummary(e.target.value)}
              />
            </div>
            <div>
              <button type="submit"><i className="fa-sharp fa-solid fa-check"></i></button>
              <button onClick={() =>{
                setSummaryErrors([])
                setSummaryInput(false)
                }}>
                <i className="fa-sharp fa-solid fa-xmark"></i></button>
            </div>
          </form>
          </div>
        }
        <div className="update-issue-description">
          <label className="update-issue-description-label">Description</label>
          <div className="create-issue-validation-errors">
            {
            descriptionErrors &&
            descriptionErrors.map((error)=>(<div key={error}>{error}</div>))
            }
          </div>
          {!descriptionInput &&
            <div onClick={() => setDescriptionInput(true)} className="update-issue-description-placeholder">
              {currDescription
              ? <div>{currDescription}</div>
              : <div>Add a description...</div>}
            </div>}
          {descriptionInput && <form onSubmit={handleDescription}>
            <textarea
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div>
              <button>Save</button>
              <button onClick={() =>{
                setDescriptionErrors([])
                setDescription(currDescription)
                setDescriptionInput(false)
                }}>Cancel</button>
            </div>
          </form>}
        </div>
        <div className="update-issue-time-container">
          <div className="update-issue-time-inner">Created at: {new Date(currIssue.createdAt).toString().slice(3,-33)} (PT)</div>
          <div className="update-issue-time-inner">Updated at: {new Date(currIssue.updatedAt).toString().slice(3,-33)} (PT)</div>
        </div>
      </div>

      <div className="update-issue-right-container">
        <form onSubmit={handleSubmit}>
          <div>
            <select
              name="phaseId"
              value={phaseId}
              onChange={(e) => setPhaseId(e.target.value)}
              className="update-issue-right-phase-selector"
            >
            {allPhasesArr?.map((phase, i) => phase.id === currPhaseId ? <option value={phase.id} selected key={i}>{phase.title}</option> : <option value={Number(phase.id)} key={i}>{phase.title}</option>)}
            </select>
          </div>

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
                  onChange={(e) => setAssigneeId(e.target.value)}
                >
                <option disabled selected value={Number(assigneeId)}>{currIssue?.User?.first_name[0].toUpperCase() +currIssue?.User?.first_name.slice(1) + " " + currIssue?.User?.last_name[0].toUpperCase() +currIssue?.User?.last_name.slice(1)}</option>
                {allUsersArr?.map((user, i) => {
                  return (
                    user.id !== currIssue?.User?.id &&
                    <option value={Number(user.id)} key={i}>{user.first_name[0].toUpperCase() + user.first_name.slice(1) + " " + user.last_name[0].toUpperCase() + user.last_name.slice(1)}</option>
                  )
                })}
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
                  // onChange={(e) => setAssigneeId(e.target.value)}
                >
                <option disabled selected>{currUser.first_name[0].toUpperCase() + currUser.first_name.slice(1) + " " + currUser.last_name[0].toUpperCase() + currUser.last_name.slice(1)}</option>
                {/* {allUsersArr?.map((user, i) => <option value={user.id} key={i}>{user.first_name[0].toUpperCase() + user.first_name.slice(1) + " " + user.last_name[0].toUpperCase() + user.last_name.slice(1)}</option>)} */}
                </select>
              </div>
            </div>
          </div>

          <button>submit</button>

        </form>
      </div>
    </div>
  )
}

export default UpdateIssue;
