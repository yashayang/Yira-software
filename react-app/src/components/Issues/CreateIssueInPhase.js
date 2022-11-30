import { useState } from "react";
import { useDispatch } from "react-redux";
import { thunkCreatePhase, thunkGetAllPhasesIssues } from "../../store/phase";
import '../CSS/CreateIssueInPhase.css';

const CreateIssueInPhase = () => {
  const [summary, setSummary] = useState("");
  const [summaryInput, setsummaryInput] = useState(false);
  const [errors, setErrors] = useState([]);

  const handleCreateIssueInput = () => {
    setsummaryInput(true)
  }

  return (
    <>
      {!summaryInput && <div onClick={handleCreateIssueInput} className='create-issue-outer'><i className="fa-sharp fa-solid fa-plus" id="create-issue-plus"></i>{" "}Create issue</div>}
      {summaryInput &&
       <div>

       </div>
      }
    </>
  )
}

export default CreateIssueInPhase;
