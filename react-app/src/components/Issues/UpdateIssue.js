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
  const [summaryInput, setSummaryInput] = useState(false);
  const [descriptionInput, setDescriptionInput] = useState(false);

  // console.log("UPDATE ISSUE- allPhasesArr:", allPhasesArr)
  const currSummary = currIssue.summary;
  const currDescription = currIssue.description;
  const currPhaseId = currIssue.phaseId;
  const currAssigneeId = currIssue.ownerId;
  // console.log("UPDATE ISSUE-curr", currSummary, currDescription, currPhaseId, currAssigneeId)
  // const [showPhases, setShowPhases] = useState(false)
  // console.log("UPDATE ISSUE-currPhaseId:", currPhaseId)
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

    const issue = {
      summary,
      description: currDescription,
      phaseId: currPhaseId,
      assigneeId: currAssigneeId
    }

    // console.log("UPDATE ISSUE-issue:", issue)

    const response = await dispatch(thunkUpdateIssue(issueId, issue))
    console.log("UPDATE ISSUE-response:", response)
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
    console.log("UPDATE ISSUE-issue:", issue)
    const response = await dispatch(thunkUpdateIssue(issueId, issue))
    console.log("UPDATE ISSUE-response:", response)
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
    console.log("UPDATE ISSUE-handleSubmit-issue:", issue)
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
      <div>
        {!summaryInput
        ? <h3 onClick={showSummary}>{currIssue.summary}</h3>
        : <div>
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
              <button onClick={() => setSummaryInput(false)}><i className="fa-sharp fa-solid fa-xmark"></i></button>
            </div>
          </form>
          </div>
        }
        <div>
          <div>
            <label>Description</label>
          </div>
            {!descriptionInput &&
              <div onClick={() => setDescriptionInput(true)}>
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
                <button onClick={() => setDescriptionInput(false)}>Cancel</button>
              </div>
          </form>}
        </div>
      </div>
      <div>
        <div>
          <form onSubmit={handleSubmit}>
            <select
              name="phaseId"
              onChange={(e) => setPhaseId(e.target.value)}
            >
            {allPhasesArr?.map((phase, i) => phase.id === currPhaseId ? <option value={phase.id} selected key={i}>{phase.title}</option> : <option value={Number(phase.id)} key={i}>{phase.title}</option>)}
            </select>

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
            <button>submit</button>
          </form>
          {/* <div onClick={showMenu}>
            {phaseNameOnStage}
            <i className="fa-solid fa-angle-down"></i>
          </div>
          {showPhases &&
            <>
              {allPhasesArr?.map((phase, i) => {
              return (
                phase.id !== currIssue.phaseId &&
                <div value={phase?.id} key={i} onClick={(e) =>{
                  return (
                    phaseNameOnStage = phase.title
                    // setNewPhaseId(e.target.value)
                    )
                }} type="submit">{phase?.title}</div>
              )
              })}
            </>
          } */}

        </div>

      </div>
    </div>
  )
}

export default UpdateIssue;
