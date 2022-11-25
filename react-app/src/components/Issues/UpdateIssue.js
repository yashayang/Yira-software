import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom"
import { thunkUpdateIssue, thunkGetOneIssue } from "../../store/issue";
import { loadAllUsers } from '../../store/session';
import "../CSS/UpdateIssues.css"

const UpdateIssue = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const currUser = useSelector(state => state.session.user)
  const allUsersArr = useSelector(state => state.session.AllUsers?.users)
  const currIssue = useSelector(state => state.issues.singleIssue)
  const { issueId } = useParams();
  const [phaseId, setPhaseId] = useState(1);
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState(currUser.id)
  const [errors, setErrors] = useState([]);
  const [summaryInput, setSummaryInput] = useState(false);
  const [descriptionInput, setDescriptionInput] = useState(false);

  const currSummary = currIssue.summary;
  const currDescription = currIssue.description;
  const currPhaseId = currIssue.phaseId;
  const currAssigneeId = currIssue.ownerId;
  // console.log("UPDATE ISSUE-curr", currSummary, currDescription, currPhaseId, currAssigneeId)

  useEffect(() => {
    dispatch(thunkGetOneIssue(parseInt(issueId)))
    dispatch(loadAllUsers())
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

  return (
    <div className="update-issue-main-container">
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
          {!descriptionInput && <div onClick={() => setDescriptionInput(true)}>Add a description...</div>}
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
  )
}

export default UpdateIssue;
