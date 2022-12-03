import { useState } from "react";
import { useDispatch } from "react-redux";
import { thunkCreateIssue, thunkGetAllPhasesIssues } from "../../store/issue";
import '../CSS/CreateIssueInPhase.css';

const CreateIssueInPhase = ({phaseId, assigneeId}) => {
  const dispatch = useDispatch();
  const [summary, setSummary] = useState("");
  const [summaryInput, setsummaryInput] = useState(false);
  const [errors, setErrors] = useState([]);

  const handleCreateIssueInput = () => {
    setsummaryInput(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors([])
    const issueInfo = {
      summary,
      description: "",
      attachment: "",
      phase_id: parseInt(phaseId),
      owner_id: parseInt(assigneeId)
    }
    console.log("CREATE ISSUE IN PHASE -issueInfo", issueInfo)
    const response = await dispatch(thunkCreateIssue(phaseId, issueInfo))

    console.log("CREATE ISSUE IN PHASE -response", response)

    let errorsArr = []
    if(response.errors) {
      let errorMsg = response.errors[0].slice(response.errors[0].indexOf(':')+1, response.errors[0].length)
      errorsArr.push(errorMsg)
      // console.log("!!!!!!!", errorsArr)
      setErrors(errorsArr)
    } else {
      setsummaryInput(false)
      setSummary("")
      dispatch(thunkGetAllPhasesIssues())
    }
  }

  return (
    <>
      {!summaryInput && <div onClick={handleCreateIssueInput} className='create-issue-outer'><i className="fa-sharp fa-solid fa-plus" id="create-issue-plus"></i>{" "}Create issue</div>}
      {summaryInput &&
        <div className="card-container">

          <div className="create-issue-inphase-validation-errors">
            {
            errors &&
            errors.map((error)=>(<div key={error}>{error}</div>))
            }
          </div>

          <form onSubmit={handleSubmit}>
            <div className="phase-title-container">
              <input
                className="create-issue-inphase-summary-input"
                value={summary}
                placeholder="What needs to be done?"
                required
                onChange={(e) => setSummary(e.target.value)}
              />
            </div>
            <div className="create-issue-button-container">
              <button type="submit" className="phase-create-submit-button"><i className="fa-sharp fa-solid fa-check"></i></button>
              <button className="phase-create-cancel-button" onClick={() =>{
                setErrors([])
                setsummaryInput(false)
                }}>
                <i className="fa-sharp fa-solid fa-xmark"></i></button>
            </div>
          </form>

        </div>
      }
    </>
  )
}

export default CreateIssueInPhase;
